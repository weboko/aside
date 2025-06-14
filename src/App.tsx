import { useState, useEffect } from "react";
import { bytesToHex, hexToBytes } from "@waku/utils/bytes";

import { Header } from "./components/Header";
import { Chat, ONLINE_EVENT, ERROR_EVENT } from "./services/chat";
import { useWaku } from "./components/WakuProvider";
import { StepAsideScreen } from "./components/StepAsideScreen";

import "./App.css";
import styles from "./App.module.css";

function App() {
  const { stage, node } = useWaku();
  const [chatStage, setChatStage] = useState("offline");
  const [chat, setChat] = useState<Chat>();

  const onCreate = async () => {
    if (!node) {
      return;
    }

    const chat = new Chat(node);
    setChat(chat);

    const hexPublicKey = bytesToHex(chat.publicKey);

    try {
      await navigator.clipboard.writeText(hexPublicKey);
    } catch (_) {
      console.error("Failed to copy to buffer.");
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
    } catch (_) {
      console.error("Failed to read from buffer.");
    }
  };

  const onExit = () => {
    chat?.dispose();
    setChat(undefined);
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

    chat.events.addEventListener(ONLINE_EVENT, onOnlineEvent);
    chat.events.addEventListener(ERROR_EVENT, onErrorEvent);

    return () => {
      if (!chat) return;

      chat.events.removeEventListener(ONLINE_EVENT, onOnlineEvent);
      chat.events.addEventListener(ONLINE_EVENT, onErrorEvent);
    }
  }, [chat]);

  return (
    <div className={styles.container}>
      {chat && <Header stage={stage} chatStage={chatStage} onExit={onExit} />}

      <StepAsideScreen
        onPaste={onPaste}
        onCreate={onCreate}
      />
    </div>
  );
}

export default App;
