import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  stage: string;
  chatStage: string;
  onExit?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stage, chatStage, onExit }) => {
  const isConnecting = stage === "loading";
  const isPeerOffline = !isConnecting && chatStage === "offline";
  const isPeerOnline = !isConnecting && chatStage === "online";

  const statusText = isConnecting
    ? "Connecting..."
    : isPeerOffline
    ? "Peer is offline"
    : isPeerOnline
    ? "Peer connected"
    : undefined;

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        {statusText && (
          <div className={styles.statusContainer}>
            <span
              className={`
                ${styles.statusDot} 
                ${isConnecting ? styles.connectingDot : ""}
                ${isPeerOffline ? styles.peerOfflineDot : ""}
                ${isPeerOnline ? styles.peerOnlineDot : ""}
              `}
            />
            <span 
              className={`
                ${styles.statusText} 
                ${isConnecting ? styles.connecting : ""}
                ${isPeerOffline ? styles.peerOffline : ""}
                ${isPeerOnline ? styles.peerOnline : ""}
              `}
            >
              {statusText}
              </span>
          </div>
        )}
      </div>
      <button onClick={onExit} className={styles.exitButton}>
        Exit
      </button>
    </div>
  );
};
