import React from 'react';
import { Header } from '../Header';
import { Button } from '../Button';
import styles from './StepAsideScreen.module.css';

interface StepAsideScreenProps {
  // You can pass navigation callbacks or use your routing library’s hooks
  onBack: () => void;
  onPaste: () => void;
  onCreate: () => void;
}

export const StepAsideScreen: React.FC<StepAsideScreenProps> = ({
  onBack,
  onPaste,
  onCreate,
}) => {
  return (
    <div className={styles.container}>
      {/* Top header with back arrow */}
      <Header onBack={onBack} />

      {/* Spacer grows to push footer content to bottom */}
      <div className={styles.spacer} />

      {/* Footer area: title + buttons */}
      <div className={styles.footer}>
        <h1 className={styles.title}>Let’s step aside</h1>

        <div className={styles.buttonsWrapper}>
          <Button onClick={onPaste} variant="primary">
            {/* If you want an icon before text, you could insert here; omitted for simplicity */}
            Paste
          </Button>
        </div>

        <div className={styles.buttonsWrapper}>
          <Button onClick={onCreate} variant="secondary">
            + Create
          </Button>
        </div>
      </div>
    </div>
  );
};
