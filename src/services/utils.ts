import { Type, Field } from "protobufjs";

import { IAsideMessage } from "./types";

const ProtoMessage = new Type("AsideMessage")
    .add(new Field("type", 1, "string", "required"))
    .add(new Field("pubkey", 2, "Uint8Array", "optional"))
    .add(new Field("messageId", 3, "string", "optional"))
    .add(new Field("content", 4, "string", "optional"));

export const toPayload = (message: IAsideMessage): Uint8Array => {
  const m = ProtoMessage.create(message);
  return ProtoMessage.encode(m).finish();
};

export const fromPayload = (payload: Uint8Array): IAsideMessage | undefined => {
  try {
    const decoded = ProtoMessage.decode(payload) as any;
    return {
      type: decoded.type,
      pubkey: decoded.pubkey,
      messageId: decoded.messageId,
      content: decoded.content,
    };
  } catch(e) {
    console.error("fromPayload failed:", e);
  }
};
