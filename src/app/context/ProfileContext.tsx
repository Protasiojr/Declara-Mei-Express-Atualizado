import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImageState] = useState<string | null>(null);

  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setProfileImageState(storedImage);
    }
  }, []);

  const setProfileImage = (newImage: string | null) => {
    setProfileImageState(newImage);
    if (newImage) {
      localStorage.setItem('profileImage', newImage);
    } else {
      localStorage.removeItem('profileImage');
    }
  };

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};
