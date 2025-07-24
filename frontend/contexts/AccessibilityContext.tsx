import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';

export interface AccessibilitySettings {
  highContrastMode: boolean;
  largeTextMode: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => Promise<void>;
  toggleHighContrast: () => Promise<void>;
  toggleLargeText: () => Promise<void>;
  toggleReduceMotion: () => Promise<void>;
  toggleScreenReader: () => Promise<void>;
}

const defaultSettings: AccessibilitySettings = {
  highContrastMode: false,
  largeTextMode: false,
  reduceMotion: false,
  screenReaderOptimized: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    applySettings();
  }, [settings]);

  const loadSettings = async () => {
    try {
      const highContrastMode = await storage.getHighContrastMode();
      const largeTextMode = await storage.getLargeTextMode();
      
      setSettings({
        highContrastMode,
        largeTextMode,
        reduceMotion: false, // Could be stored in storage
        screenReaderOptimized: false, // Could be stored in storage
      });
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };

  const applySettings = () => {
    // Apply high contrast mode
    if (typeof document !== 'undefined') {
      const body = document.body;
      if (settings.highContrastMode) {
        body.classList.add('high-contrast');
      } else {
        body.classList.remove('high-contrast');
      }

      // Apply large text mode
      if (settings.largeTextMode) {
        body.classList.add('large-text');
      } else {
        body.classList.remove('large-text');
      }

      // Apply reduce motion
      if (settings.reduceMotion) {
        body.classList.add('reduce-motion');
      } else {
        body.classList.remove('reduce-motion');
      }
    }
  };

  const updateSettings = async (newSettings: Partial<AccessibilitySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    // Save to storage
    try {
      if (newSettings.highContrastMode !== undefined) {
        await storage.setHighContrastMode(newSettings.highContrastMode);
      }
      if (newSettings.largeTextMode !== undefined) {
        await storage.setLargeTextMode(newSettings.largeTextMode);
      }
      // Add more storage calls for other settings as needed
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  const toggleHighContrast = async () => {
    await updateSettings({ highContrastMode: !settings.highContrastMode });
  };

  const toggleLargeText = async () => {
    await updateSettings({ largeTextMode: !settings.largeTextMode });
  };

  const toggleReduceMotion = async () => {
    await updateSettings({ reduceMotion: !settings.reduceMotion });
  };

  const toggleScreenReader = async () => {
    await updateSettings({ screenReaderOptimized: !settings.screenReaderOptimized });
  };

  const value: AccessibilityContextType = {
    settings,
    updateSettings,
    toggleHighContrast,
    toggleLargeText,
    toggleReduceMotion,
    toggleScreenReader,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
