import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: 'onboarding_completed',
  USER_PREFERENCES: 'user_preferences',
  HIGH_CONTRAST_MODE: 'high_contrast_mode',
  LARGE_TEXT_MODE: 'large_text_mode',
  USER_PROFILE: 'user_profile',
};

export const storage = {
  // Onboarding
  async setOnboardingCompleted(completed: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
  },

  async getOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return value ? JSON.parse(value) : false;
    } catch {
      return false;
    }
  },

  // User Preferences
  async setUserPreferences(preferences: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },

  async getUserPreferences(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  },

  // Accessibility Settings
  async setHighContrastMode(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.HIGH_CONTRAST_MODE, JSON.stringify(enabled));
  },

  async getHighContrastMode(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_CONTRAST_MODE);
      return value ? JSON.parse(value) : false;
    } catch {
      return false;
    }
  },

  async setLargeTextMode(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LARGE_TEXT_MODE, JSON.stringify(enabled));
  },

  async getLargeTextMode(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.LARGE_TEXT_MODE);
      return value ? JSON.parse(value) : false;
    } catch {
      return false;
    }
  },

  // User Profile
  async setUserProfile(profile: any): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  async getUserProfile(): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  },

  async clearUserProfile(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },

  // Clear all data
  async clearAll(): Promise<void> {
    await AsyncStorage.clear();
  },
};
