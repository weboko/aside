import React from 'react';
import styles from './ChatMessage.module.css';

export type MessageStatus = 'queued' | 'sent';

interface ChatMessageProps {
  text: string;
  status: MessageStatus;
  /**
   * True if this message is from the current user (align right);
   * false for peer messages (align left).
   */
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
          {/* Hourglass SVG icon */}
          <svg
            className={styles.icon}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* This is a rough hourglass path; adjust as needed */}
            <path
              d="M6 2a2 2 0 0 0 0 4 2 2 0 0 1 .586 1.414V9a6 6 0 0 0 2 4.472V18a2 2 0 0 1-.586 1.414 2 2 0 1 0 0 4h12a2 2 0 1 0 0-4 2 2 0 0 1-.586-1.414V13.472A6 6 0 0 0 18 9V7.414A2 2 0 0 1 18.586 6 2 2 0 1 0 18 2H6z"
              fill="currentColor"
            />
          </svg>
          <span className={styles.statusText}>Queued to send</span>
        </div>
      )}
    </div>
  );
};
