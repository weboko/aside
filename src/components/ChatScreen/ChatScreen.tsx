import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageStatus } from '../ChatMessage';
import { AutoGrowTextarea } from "../AutoGrowTextArea";
import styles from './ChatScreen.module.css';

export interface Message {
  id: string;
  text: string;
  status: MessageStatus;
  isOwn: boolean;
}

interface ChatScreenProps {
  messages: Message[];
  sendMessage: (text: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ messages, sendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;

    sendMessage(text);
    setInputValue('');
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatScreenContainer}> {/* Changed from <> to <div> and added className */}
      <div className={styles.messagesContainer}>
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            text={msg.text}
            status={msg.status}
            isOwn={msg.isOwn}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <AutoGrowTextarea
          className={styles.input}
          placeholder=""
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
        />
        
        <button
          className={styles.sendButton}
          onClick={handleSend}
          aria-label="Send"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 21l21-9L2 3v7l15 2-15 2v7z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div> // Corresponding closing div
  );
};
