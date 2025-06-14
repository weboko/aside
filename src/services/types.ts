type IPubkeyMessage = {
  type: "pubkey",
  pubkey: Uint8Array,
};

type IChatMessage = {
  type: "chat",
  messageId: string,
  content: string,
};

type IAckMessage = {
  type: "ack",
  messageId: string,
};

type IExitMessage = {
  type: "exit",
};

export type IAsideMessage = IPubkeyMessage | IChatMessage | IAckMessage | IExitMessage;
