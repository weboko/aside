import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  onBack: () => void;
  // You could extend to accept title, right actions, etc.
}

export const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <div className={styles.header}>
      <button
        onClick={onBack}
        className={styles.backButton}
        aria-label="Back"
      >
        {/* Simple inline SVG for a left arrow */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.icon}
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
