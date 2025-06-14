import React from 'react';
import styles from './ChatMessage.module.css';

export type MessageStatus = 'queued' | 'sent' | 'ack';

interface ChatMessageProps {
  text: string;
  status: MessageStatus;
  isOwn: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, status, isOwn }) => {
  return (
    <div
      className={`
        ${styles.messageWrapper} 
        ${isOwn ? styles.own : styles.peer}
      `}
    >
      <div className={styles.bubble}>
        <span className={styles.text}>{text}</span>
      </div>

      {isOwn && status === 'queued' && (
        <div className={styles.statusLine}>
          <svg
            className={styles.icon}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 2a2 2 0 0 0 0 4 2 2 0 0 1 .586 1.414V9a6 6 0 0 0 2 4.472V18a2 2 0 0 1-.586 1.414 2 2 0 1 0 0 4h12a2 2 0 1 0 0-4 2 2 0 0 1-.586-1.414V13.472A6 6 0 0 0 18 9V7.414A2 2 0 0 1 18.586 6 2 2 0 1 0 18 2H6z"
              fill="currentColor"
            />
          </svg>
          <span className={styles.statusText}>Queued to send</span>
        </div>
      )}

      {isOwn && status === 'sent' && (
        <div
          className={`
            ${styles.statusLine} 
            ${styles.statusSent}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 10"
            width="12"
            height="10"
            fill="none"
          >
            <path
              d="M1 5 L3.5 8 L7 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.statusText}>Sent</span>
        </div>
      )}

      {isOwn && status === 'ack' && (
        <div
          className={`
            ${styles.statusLine} 
            ${styles.statusDelivered}
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 10"
            width="12"
            height="10"
            fill="none"
          >
            <path
              d="M1 5 L3.5 8 L7 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 5 L6.5 8 L10 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.statusText}>Delivered</span>
        </div>
      )}
    </div>
  );
};
