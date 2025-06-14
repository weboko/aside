import { Waku } from "./waku";
import { IEncoder, IEncryptedMessage } from "@waku/interfaces";
import { crypto, ecies } from "@waku/message-encryption";

import { CLUSTER_ID, CONTENT_TOPIC, SHARD_ID } from "../const";
import { fromPayload, toPayload } from "./utils";
import { IAsideMessage } from "./types";

interface IChat {
  events: EventTarget;
}

export const MESSAGE_EVENT = "received";
export const ACK_EVENT = "ack";
export const SENT_EVENT = "sent";
export const ERROR_EVENT = "error";
export const ONLINE_EVENT = "online";
export const EXIT_EVENT = "exit";

export class Chat implements IChat {
  private compromised = false;
  private readonly privateKey = crypto.generatePrivateKey();
  private messagesInterval: ReturnType<typeof setInterval> | undefined = undefined;

  public readonly events = new EventTarget(); 
  public readonly publicKey = crypto.getPublicKey(this.privateKey);

  private encoder: IEncoder | undefined = undefined;
  private readonly decoder = ecies.createDecoder(
    CONTENT_TOPIC,
    this.privateKey,
    { clusterId: CLUSTER_ID, shard: SHARD_ID }
  );

  private ackMessages = new Set();
  private messageQueue: IAsideMessage[] = [];

  public constructor(private readonly node: Waku, public alicePublicKey?: Uint8Array) {
    this.node.node.nextFilter.subscribe(this.decoder, this.onMessage.bind(this));

    if (alicePublicKey) {
      this.createEncoder(alicePublicKey);
      
      this.messageQueue.push({
        type: "pubkey",
        pubkey: this.publicKey,
      });
    }

    this.setupMessageSending();
  }

  public exit(): void {
    this.messageQueue.push({
      type: "exit"
    });
    this.sendScheduled();
  }

  public dispose(): void {
    this.stopMessageSending();
    this.node.node.nextFilter.unsubscribe(this.decoder);
  }

  public async send(message: IAsideMessage): Promise<void> {
    if (this.compromised) {
      console.warn("send: ignoring, the key was compromised");
      return;
    }

    this.messageQueue.push(message);
    
    if (this.messageQueue.length === 1) {
      await this.sendScheduled();
    }
  }

  private setupMessageSending(): void {
    if (this.messagesInterval) {
      return;
    }

    this.messagesInterval = setInterval(() => {
      void this.sendScheduled();
    }, 500);
  }

  private stopMessageSending(): void {
    if (!this.messagesInterval) {
      return;
    }

    clearInterval(this.messagesInterval);
    this.messagesInterval = undefined;
  }

  private async onMessage(m: IEncryptedMessage): Promise<void> {
    if (this.compromised) {
      console.warn("onMessage: ignoring all messages, the key was compromised");
      return;
    }

    if (!m) {
      console.warn("onMessage: cannot read message");
      return;
    }

    const message = fromPayload(m.payload);

    if (!message) {
      console.warn("onMessage: cannot read payload");
      return;
    }

    const isSignedByMe = m.verifySignature(this.publicKey);
    if (isSignedByMe) {
      return;
    }

    if (!this.alicePublicKey && message.type === "pubkey"){
      this.alicePublicKey = message.pubkey;
      this.createEncoder(message.pubkey);

      this.events.dispatchEvent(new CustomEvent(ONLINE_EVENT, {
        detail: true,
      }));

      return;
    }

    if (!this.alicePublicKey) {
      return;
    }

    const isSignedByAlice = m.verifySignature(this.alicePublicKey);
    if (!isSignedByAlice) {
      this.compromised = true;
      this.events.dispatchEvent(
        new CustomEvent(ERROR_EVENT, { detail: "channel compromised" })
      );
      return;
    }

    if (message.type === "chat") {
      this.events.dispatchEvent(
        new CustomEvent(MESSAGE_EVENT, { detail: {
          id: message.messageId,
          content: message.content,
        }})
      );

      this.acknowledgeMessage(message.messageId);
    }

    if (message.type === "ack") {
      this.events.dispatchEvent(
        new CustomEvent(ACK_EVENT, { detail: message.messageId })
      );
    }

    if (message.type === "exit") {
      this.events.dispatchEvent(
        new CustomEvent(EXIT_EVENT, { detail: true })
      );
    }
  }

  private createEncoder(alicePublicKey: Uint8Array): void {
    this.encoder = ecies.createEncoder({
      contentTopic: CONTENT_TOPIC,
      publicKey: alicePublicKey,
      sigPrivKey: this.privateKey,
      pubsubTopicShardInfo: {
        clusterId: CLUSTER_ID,
        shard: SHARD_ID,
      },
    });
  }

  private acknowledgeMessage(id: string): void {
    if (this.ackMessages.has(id)) {
      return;
    }

    this.messageQueue.push({
      type: "ack",
      messageId: id,
    });

    this.ackMessages.add(id);
  }

  private async sendScheduled(): Promise<void> {
    if (this.compromised) {
      console.info("sendScheduled: key is compromised, not sending");
      return;
    }

    if (!this.encoder) {
      console.info("sendScheduled: encoder not initialized, waiting for incoming message");
      return;
    }

    if (this.messageQueue.length === 0) {
      console.info("sendScheduled: no messages to send, skipping");
      return;
    }

    const message = this.messageQueue.shift();
    const payload = toPayload(message!);
    
    const response = await this.node.node.lightPush.send(this.encoder, { payload }, { autoRetry: false });

    // if not success, put message back into the queue
    if (response.successes.length === 0) {
      this.messageQueue.unshift(message!);
      return;
    }

    // let UI know user message was sent
    if (message?.type === "chat") {
      this.events.dispatchEvent(new CustomEvent(SENT_EVENT, {
        detail: message.messageId,
      }));
    }
  }
}