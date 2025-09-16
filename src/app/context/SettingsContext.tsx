import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  meiLimit: number;
  setMeiLimit: (limit: number) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meiLimit, setMeiLimitState] = useState<number>(81000);

  useEffect(() => {
    try {
      const storedLimit = localStorage.getItem('meiLimit');
      if (storedLimit) {
        setMeiLimitState(parseFloat(storedLimit));
      }
    } catch (error) {
        console.error("Failed to parse meiLimit from localStorage", error);
    }
  }, []);

  const setMeiLimit = (newLimit: number) => {
    setMeiLimitState(newLimit);
    try {
        localStorage.setItem('meiLimit', newLimit.toString());
    } catch (error) {
        console.error("Failed to set meiLimit in localStorage", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ meiLimit, setMeiLimit }}>
      {children}
    </SettingsContext.Provider>
  );
};
