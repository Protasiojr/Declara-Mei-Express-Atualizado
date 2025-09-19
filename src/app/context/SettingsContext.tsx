import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  meiLimit: number;
  setMeiLimit: (limit: number) => void;
  employeeLimit: number;
  setEmployeeLimit: (limit: number) => void;
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
  const [employeeLimit, setEmployeeLimitState] = useState<number>(1);

  useEffect(() => {
    try {
      const storedMeiLimit = localStorage.getItem('meiLimit');
      if (storedMeiLimit) {
        setMeiLimitState(parseFloat(storedMeiLimit));
      }
      const storedEmployeeLimit = localStorage.getItem('employeeLimit');
      if (storedEmployeeLimit) {
        setEmployeeLimitState(parseInt(storedEmployeeLimit, 10));
      }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
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

  const setEmployeeLimit = (newLimit: number) => {
    setEmployeeLimitState(newLimit);
    try {
        localStorage.setItem('employeeLimit', newLimit.toString());
    } catch (error) {
        console.error("Failed to set employeeLimit in localStorage", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ meiLimit, setMeiLimit, employeeLimit, setEmployeeLimit }}>
      {children}
    </SettingsContext.Provider>
  );
};