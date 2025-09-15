import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompanyContextType {
  logo: string | null;
  setLogo: (logo: string | null) => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logo, setLogoState] = useState<string | null>(null);

  useEffect(() => {
    const storedLogo = localStorage.getItem('companyLogo');
    if (storedLogo) {
      setLogoState(storedLogo);
    }
  }, []);

  const setLogo = (newLogo: string | null) => {
    setLogoState(newLogo);
    if (newLogo) {
      localStorage.setItem('companyLogo', newLogo);
    } else {
      localStorage.removeItem('companyLogo');
    }
  };

  return (
    <CompanyContext.Provider value={{ logo, setLogo }}>
      {children}
    </CompanyContext.Provider>
  );
};
