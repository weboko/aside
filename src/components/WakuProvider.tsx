import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Waku } from '../services/waku';

type WakuContextType = {
  stage: string;
  node?: Waku;
};

const WakuContext = createContext<WakuContextType | undefined>(undefined);

type WakuProviderProps = {
  children: ReactNode;
};

export const WakuProvider: React.FC<WakuProviderProps> = ({ children }) => {
  const [stage, setStage] = useState("loading");
  const [value, setValue] = useState<Waku>();

  useEffect(() => {
    async function run() {
      try {
        const node = await Waku.create();
        setValue(node);
        setStage("loaded");
      } catch(e) {
        setStage("error");
      }
    }

    run();
  }, [setValue, setStage]);

  return (
    <WakuContext.Provider
      value={{
        stage,
        node: value,
      }}
    >
      {children}
    </WakuContext.Provider>
  );
};

export function useWaku() {
  const context = useContext(WakuContext);

  if (!context) {
    throw new Error('useWaku must be used within a WakuProvider');
  }

  return context;
}