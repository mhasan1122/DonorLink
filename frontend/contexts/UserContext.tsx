import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';

export interface UserProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bloodGroup: string;
  age: string;
  weight: string;
  address: string;
  isAvailable: boolean;
  lastDonationDate: string;
  totalDonations: number;
  livesSaved: number;
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  isLoading: boolean;
}

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  bloodGroup: 'A+',
  age: '',
  weight: '',
  address: '',
  isAvailable: true,
  lastDonationDate: '',
  totalDonations: 0,
  livesSaved: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const savedProfile = await storage.getUserProfile();
      if (savedProfile && Object.keys(savedProfile).length > 0) {
        setProfile(savedProfile);
      } else {
        // Set default profile if no saved profile exists
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfile(defaultProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...profile, ...newProfile } as UserProfile;
      setProfile(updatedProfile);
      await storage.setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const clearProfile = async () => {
    try {
      setProfile(defaultProfile);
      await storage.clearUserProfile();
    } catch (error) {
      console.error('Error clearing user profile:', error);
      throw error;
    }
  };

  const value: UserContextType = {
    profile,
    updateProfile,
    loadProfile,
    clearProfile,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
