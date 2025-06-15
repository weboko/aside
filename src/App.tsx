import { useState, useEffect } from "react";
import { bytesToHex, hexToBytes } from "@waku/utils/bytes";

import { Header } from "./components/Header";
import { Chat, ONLINE_EVENT, ERROR_EVENT, EXIT_EVENT } from "./services/chat";
import { useWaku } from "./components/WakuProvider";
import { StepAsideScreen } from "./components/StepAsideScreen";
import { ChatScreen} from "./components/ChatScreen";
import { useMessages } from "./services/useMessages";

import "./App.css";
import styles from "./App.module.css";

function App() {
  const { stage, node } = useWaku();
  const [chatStage, setChatStage] = useState("offline");
  const [chat, setChat] = useState<Chat>();
  const { messages, sendMessage, reset } = useMessages(chat);
  const [notification, setNotification] = useState<string | null>(null);

  const onCreate = async () => {
    if (!node) {
      return;
    }

    const chat = new Chat(node);
    setChat(chat);

    const hexPublicKey = bytesToHex(chat.publicKey);

    try {
      await navigator.clipboard.writeText(hexPublicKey);
      setNotification("Copied");
      setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
    } catch (_) {
      console.error("Failed to copy to buffer.");
      setNotification("Failed to copy");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const onPaste = async () => {
    if (!node) {
      return;
    }

    try {
      const hexPublicKey = await navigator.clipboard.readText();
      const publicKey = hexToBytes(hexPublicKey);
      
      const chat = new Chat(node, publicKey);
      setChat(chat);
      setChatStage("online");
    } catch (_) {
      console.error("Failed to read from buffer.");
    }
  };

  const onExit = () => {
    chat?.exit();
    chat?.dispose();
    setChat(undefined);
    setChatStage("offline");
    reset();
  };

  useEffect(() => {
    if (!chat) {
      return;
    }

    const onOnlineEvent = () => {
      setChatStage("online");
    };

    const onErrorEvent = () => {
      setChatStage("offline");
    };

    const onExitEvent = () => {
      chat?.dispose();
      setChat(undefined);
      setChatStage("offline");
      reset();
    };

    chat.events.addEventListener(ONLINE_EVENT, onOnlineEvent);
    chat.events.addEventListener(ERROR_EVENT, onErrorEvent);
    chat.events.addEventListener(EXIT_EVENT, onExitEvent);

    return () => {
      if (!chat) return;

      chat.events.removeEventListener(ONLINE_EVENT, onOnlineEvent);
      chat.events.removeEventListener(ERROR_EVENT, onErrorEvent);
      chat.events.removeEventListener(EXIT_EVENT, onExitEvent);
    }
  }, [chat, setChat, setChatStage]);

  return (
    <div className={styles.container}>
      {chat && <Header stage={stage} chatStage={chatStage} onExit={onExit} />}

      {notification && <div className={styles.notification}>{notification}</div>}

      {!chat && (
        <StepAsideScreen
          onPaste={onPaste}
          onCreate={onCreate}
        />
      )}

      {chat && (
        <ChatScreen
          messages={messages}
          sendMessage={sendMessage}
        />
      )}
    </div>
  );
}

export default App;
