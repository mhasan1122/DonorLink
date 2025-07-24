import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Card } from './';
import { storage } from '../../utils/storage';

interface AccessibilitySettingsProps {
  visible: boolean;
  onClose: () => void;
  onSettingsChange: (settings: AccessibilitySettings) => void;
}

export interface AccessibilitySettings {
  highContrastMode: boolean;
  largeTextMode: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
}

export default function AccessibilitySettings({
  visible,
  onClose,
  onSettingsChange
}: AccessibilitySettingsProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrastMode: false,
    largeTextMode: false,
    reduceMotion: false,
    screenReaderOptimized: false,
  });

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const highContrastMode = await storage.getHighContrastMode();
      const largeTextMode = await storage.getLargeTextMode();
      
      setSettings({
        highContrastMode,
        largeTextMode,
        reduceMotion: false, // Could be stored in storage too
        screenReaderOptimized: false, // Could be stored in storage too
      });
    } catch (error) {
      console.error('Error loading accessibility settings:', error);
    }
  };

  const updateSetting = async (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Save to storage
    try {
      if (key === 'highContrastMode') {
        await storage.setHighContrastMode(value);
      } else if (key === 'largeTextMode') {
        await storage.setLargeTextMode(value);
      }
      // Add more storage calls for other settings as needed
    } catch (error) {
      console.error('Error saving accessibility setting:', error);
    }

    onSettingsChange(newSettings);
  };

  const renderSettingItem = (
    title: string,
    description: string,
    key: keyof AccessibilitySettings,
    icon: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingIcon}>{icon}</Text>
          <Text style={styles.settingTitle}>{title}</Text>
        </View>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
        thumbColor={settings[key] ? '#FFFFFF' : '#CCCCCC'}
        accessibilityLabel={`Toggle ${title}`}
        accessibilityHint={description}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Accessibility Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <Card style={styles.introCard}>
            <Text style={styles.introTitle}>♿ Make LifeDonor Work Better for You</Text>
            <Text style={styles.introText}>
              Customize the app to meet your accessibility needs. These settings will be saved 
              and applied across the entire app.
            </Text>
          </Card>

          <Card style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Visual Accessibility</Text>
            
            {renderSettingItem(
              'High Contrast Mode',
              'Increases contrast for better visibility',
              'highContrastMode',
              '🔆'
            )}

            {renderSettingItem(
              'Large Text Mode',
              'Makes text larger and easier to read',
              'largeTextMode',
              '🔍'
            )}
          </Card>

          <Card style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Motion & Animation</Text>
            
            {renderSettingItem(
              'Reduce Motion',
              'Minimizes animations and transitions',
              'reduceMotion',
              '🎭'
            )}
          </Card>

          <Card style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Screen Reader Support</Text>
            
            {renderSettingItem(
              'Screen Reader Optimized',
              'Optimizes interface for screen readers',
              'screenReaderOptimized',
              '🔊'
            )}
          </Card>

          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>💡 Additional Tips</Text>
            <Text style={styles.infoText}>
              • Use voice commands to search for donors{'\n'}
              • Double-tap cards to hear donor information{'\n'}
              • Swipe gestures work with screen readers{'\n'}
              • All buttons have descriptive labels
            </Text>
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Done"
            variant="primary"
            onPress={onClose}
            style={styles.doneButton}
            accessibilityLabel="Close accessibility settings"
            accessibilityHint="Returns to the previous screen"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introCard: {
    marginVertical: 16,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  settingsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 18,
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#E3F2FD',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  doneButton: {
    width: '100%',
  },
});
