import React from 'react';
import { Button } from '../Button';
import styles from './StepAsideScreen.module.css';

interface StepAsideScreenProps {
  onPaste: () => void;
  onCreate: () => void;
}

export const StepAsideScreen: React.FC<StepAsideScreenProps> = ({
  onPaste,
  onCreate,
}) => {
  return (
    <>
      <div className={styles.spacer} />

      <div className={styles.footer}>
        <h1 className={styles.title}>Let’s step aside</h1>

        <div className={styles.buttonsWrapper}>
          <Button onClick={onPaste} variant="primary">
            Paste
          </Button>
        </div>

        <div className={styles.buttonsWrapper}>
          <Button onClick={onCreate} variant="secondary">
            + Create
          </Button>
        </div>
      </div>
    </>
  );
};
