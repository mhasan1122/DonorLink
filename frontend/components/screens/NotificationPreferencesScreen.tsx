import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { Card, Button } from '../ui';

interface NotificationSettings {
  emergencyRequests: boolean;
  donationReminders: boolean;
  healthTips: boolean;
  eventUpdates: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

function NotificationPreferencesScreen() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emergencyRequests: true,
    donationReminders: true,
    healthTips: false,
    eventUpdates: true,
    systemNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Your notification preferences have been updated successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update preferences. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSettingRow = (
    key: keyof NotificationSettings,
    title: string,
    description: string,
    icon: string
  ) => (
    <View style={styles.settingRow} key={key}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: '#CCCCCC', true: '#D32F2F' }}
        thumbColor={settings[key] ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.notificationCard}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <Text style={styles.sectionDescription}>
          Choose what notifications you want to receive
        </Text>
        
        {renderSettingRow(
          'emergencyRequests',
          'Emergency Blood Requests',
          'Get notified when someone urgently needs your blood type',
          '🚨'
        )}
        
        {renderSettingRow(
          'donationReminders',
          'Donation Reminders',
          'Reminders when you\'re eligible to donate again',
          '⏰'
        )}
        
        {renderSettingRow(
          'healthTips',
          'Health Tips',
          'Receive health tips and donation preparation advice',
          '💡'
        )}
        
        {renderSettingRow(
          'eventUpdates',
          'Blood Drive Events',
          'Updates about blood donation camps and events',
          '📅'
        )}
        
        {renderSettingRow(
          'systemNotifications',
          'System Updates',
          'Important app updates and maintenance notifications',
          '⚙️'
        )}
      </Card>

      <Card style={styles.deliveryCard}>
        <Text style={styles.sectionTitle}>Delivery Methods</Text>
        <Text style={styles.sectionDescription}>
          Choose how you want to receive notifications
        </Text>
        
        {renderSettingRow(
          'pushNotifications',
          'Push Notifications',
          'Instant notifications on your device',
          '📱'
        )}
        
        {renderSettingRow(
          'emailNotifications',
          'Email Notifications',
          'Receive notifications via email',
          '📧'
        )}
        
        {renderSettingRow(
          'smsNotifications',
          'SMS Notifications',
          'Receive notifications via text message',
          '💬'
        )}
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.infoTitle}>📋 Important Notes</Text>
        <Text style={styles.infoText}>
          • Emergency requests are highly recommended to stay enabled{'\n'}
          • You can change these settings anytime{'\n'}
          • Some notifications may be required for app functionality{'\n'}
          • We respect your privacy and won't spam you
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Preferences"
          variant="primary"
          onPress={handleSaveSettings}
          loading={loading}
          style={styles.saveButton}
        />
        
        <Button
          title="Reset to Default"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              'Reset Preferences',
              'Are you sure you want to reset all notification preferences to default?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Reset',
                  onPress: () => {
                    setSettings({
                      emergencyRequests: true,
                      donationReminders: true,
                      healthTips: false,
                      eventUpdates: true,
                      systemNotifications: true,
                      emailNotifications: true,
                      smsNotifications: false,
                      pushNotifications: true,
                    });
                  }
                }
              ]
            );
          }}
          style={styles.resetButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  notificationCard: {
    marginBottom: 16,
  },
  deliveryCard: {
    marginBottom: 16,
  },
  infoCard: {
    marginBottom: 24,
    backgroundColor: '#F0F8FF',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  resetButton: {
    marginBottom: 16,
  },
});

NotificationPreferencesScreen.displayName = 'NotificationPreferencesScreen';

export default NotificationPreferencesScreen;
