import { useState, useEffect } from "react";

import { IAsideMessage } from "./types";
import { Message} from "../components/ChatScreen";
import { Chat, MESSAGE_EVENT, SENT_EVENT, ACK_EVENT } from "./chat";

type UseMessagesReturn = {
  messages: Message[];
  reset: () => void;
  sendMessage: (text: string) => void;
};

export const useMessages = (chat?: Chat): UseMessagesReturn => {
  const [messages, setMessages] = useState<Message[]>([]);

  const reset = () => {
    setMessages([]);
  };

  const sendMessage = (text: string): void => {
    if (!chat) {
      return;
    }

    const content = text.trim();
    if (content.length === 0) {
      return;
    }

    const message = {
      content,
      type: "chat",
      messageId: crypto.randomUUID(),
    };

    chat.send(message as IAsideMessage);

    setMessages((prev) => {
      return [...prev, {
        id: message.messageId,
        text: message.content,
        status: "queued",
        isOwn: true,
      }];
    });
  };
  
  useEffect(() => {
    if (!chat) {
      return;
    }

    const onMessageAck = (e: CustomEvent<string>) => {
      const id = e.detail;
      setMessages((prev) => {
        return prev.map(m => {
          return m.id === id
            ? { ...m, status: "ack" }
            : m;
        })
      });
    };

    const onMessageSent = (e: CustomEvent<string>) => {
      const id = e.detail;
      setMessages((prev) => {
        return prev.map(m => {
          return m.id === id
            ? { ...m, status: "sent" }
            : m;
        })
      });
    };

    const onMessageReceived = (e: CustomEvent<{ id: string, content: string }>) => {
      const id = e.detail.id;
      const text = e.detail.content;

      setMessages((prev) => {
        return [...prev, {
          id,
          text,
          status: "sent", // can be ignored as it is not displayed
          isOwn: false,
        }];
      });
    };

    chat.events.addEventListener(ACK_EVENT, onMessageAck as any);
    chat.events.addEventListener(SENT_EVENT, onMessageSent as any);
    chat.events.addEventListener(MESSAGE_EVENT, onMessageReceived as any);

    return () => {
      if (!chat) {
        return;
      }

      chat.events.removeEventListener(ACK_EVENT, onMessageAck as any);
      chat.events.removeEventListener(SENT_EVENT, onMessageSent as any);
      chat.events.removeEventListener(MESSAGE_EVENT, onMessageReceived as any);
    };
  }, [chat, setMessages]);

  return {
    messages,
    sendMessage,
    reset,
  }
};
