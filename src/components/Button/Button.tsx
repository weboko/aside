import React from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  const className = `
    ${styles.button} 
    ${variant === 'primary' ? styles.primary : styles.secondary}
    ${disabled ? styles.disabled : ''}
  `.trim();

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
