import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, Linking } from 'react-native';
import { Card, Button } from '../ui';

interface PrivacySettings {
  profileVisibility: boolean;
  showPhoneNumber: boolean;
  showEmail: boolean;
  showLastDonation: boolean;
  allowDirectContact: boolean;
  shareLocationData: boolean;
  analyticsOptIn: boolean;
  marketingOptIn: boolean;
}

function PrivacySettingsScreen() {
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: true,
    showPhoneNumber: true,
    showEmail: false,
    showLastDonation: true,
    allowDirectContact: true,
    shareLocationData: true,
    analyticsOptIn: false,
    marketingOptIn: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Your privacy settings have been updated successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to update settings. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and you will lose all your donation history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deletion',
              'Please contact support to proceed with account deletion.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const renderSettingRow = (
    key: keyof PrivacySettings,
    title: string,
    description: string,
    icon: string,
    isWarning?: boolean
  ) => (
    <View style={styles.settingRow} key={key}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, isWarning && styles.warningTitle]}>
            {title}
          </Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: '#CCCCCC', true: isWarning ? '#FFC107' : '#D32F2F' }}
        thumbColor={settings[key] ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.visibilityCard}>
        <Text style={styles.sectionTitle}>Profile Visibility</Text>
        <Text style={styles.sectionDescription}>
          Control what information is visible to other users
        </Text>
        
        {renderSettingRow(
          'profileVisibility',
          'Make Profile Visible',
          'Allow others to find and contact you for donations',
          '👁️'
        )}
        
        {renderSettingRow(
          'showPhoneNumber',
          'Show Phone Number',
          'Display your phone number to potential recipients',
          '📞'
        )}
        
        {renderSettingRow(
          'showEmail',
          'Show Email Address',
          'Display your email address in your profile',
          '📧'
        )}
        
        {renderSettingRow(
          'showLastDonation',
          'Show Last Donation Date',
          'Display when you last donated blood',
          '📅'
        )}
        
        {renderSettingRow(
          'allowDirectContact',
          'Allow Direct Contact',
          'Let people contact you directly through the app',
          '💬'
        )}
      </Card>

      <Card style={styles.dataCard}>
        <Text style={styles.sectionTitle}>Data & Analytics</Text>
        <Text style={styles.sectionDescription}>
          Control how your data is used
        </Text>
        
        {renderSettingRow(
          'shareLocationData',
          'Share Location Data',
          'Help us show you nearby donation opportunities',
          '📍'
        )}
        
        {renderSettingRow(
          'analyticsOptIn',
          'Analytics Data',
          'Help improve the app by sharing usage analytics',
          '📊',
          true
        )}
        
        {renderSettingRow(
          'marketingOptIn',
          'Marketing Communications',
          'Receive promotional content and updates',
          '📢',
          true
        )}
      </Card>

      <Card style={styles.securityCard}>
        <Text style={styles.sectionTitle}>Security & Account</Text>
        
        <Button
          title="🔒 Change Password"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              'Change Password',
              'This feature will be available in a future update.',
              [{ text: 'OK' }]
            );
          }}
          style={styles.securityButton}
        />
        
        <Button
          title="📱 Two-Factor Authentication"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              '2FA Setup',
              'This feature will be available in a future update.',
              [{ text: 'OK' }]
            );
          }}
          style={styles.securityButton}
        />
        
        <Button
          title="📋 Download My Data"
          variant="secondary"
          onPress={() => {
            Alert.alert(
              'Data Export',
              'We will send your data export to your registered email within 24 hours.',
              [{ text: 'OK' }]
            );
          }}
          style={styles.securityButton}
        />
      </Card>

      <Card style={styles.legalCard}>
        <Text style={styles.sectionTitle}>Legal & Policies</Text>
        
        <Button
          title="📄 Privacy Policy"
          variant="secondary"
          onPress={() => {
            Linking.openURL('https://donorlink.app/privacy');
          }}
          style={styles.legalButton}
        />
        
        <Button
          title="📋 Terms of Service"
          variant="secondary"
          onPress={() => {
            Linking.openURL('https://donorlink.app/terms');
          }}
          style={styles.legalButton}
        />
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Settings"
          variant="primary"
          onPress={handleSaveSettings}
          loading={loading}
          style={styles.saveButton}
        />
        
        <Button
          title="🗑️ Delete Account"
          variant="alert"
          onPress={handleDeleteAccount}
          style={styles.deleteButton}
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
  visibilityCard: {
    marginBottom: 16,
  },
  dataCard: {
    marginBottom: 16,
  },
  securityCard: {
    marginBottom: 16,
  },
  legalCard: {
    marginBottom: 24,
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
  warningTitle: {
    color: '#FF9800',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  securityButton: {
    marginBottom: 8,
  },
  legalButton: {
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  deleteButton: {
    marginBottom: 16,
  },
});

PrivacySettingsScreen.displayName = 'PrivacySettingsScreen';

export default PrivacySettingsScreen;
