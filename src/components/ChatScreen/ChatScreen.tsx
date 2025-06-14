import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageStatus } from '../ChatMessage';
import { AutoGrowTextarea } from "../AutoGrowTextArea";
import styles from './ChatScreen.module.css';

interface Message {
  id: number;
  text: string;
  status: MessageStatus;
  isOwn: boolean;
}

interface ChatScreenProps {
  peerOnline: boolean;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ peerOnline }) => {
  // messages array
  const [messages, setMessages] = useState<Message[]>([]);
  // input field
  const [inputValue, setInputValue] = useState('');
  // simple incremental id
  const nextIdRef = useRef(1);
  // ref to scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When peerOnline becomes true, mark queued => sent
  useEffect(() => {
    if (peerOnline) {
      setMessages(prev =>
        prev.map(msg =>
          msg.status === 'queued'
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }
  }, [peerOnline]);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    const status: MessageStatus = peerOnline ? 'sent' : 'queued';
    const newMsg: Message = {
      id: nextIdRef.current++,
      text,
      status,
      isOwn: true,
    };
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
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
        {/* <input
          type="text"
          className={styles.input}
          placeholder=""
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
        /> */}
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
    </>
  );
};
