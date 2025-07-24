import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, LoadingSpinner } from '../ui';
import AccessibilitySettings from '../ui/AccessibilitySettings';
import { useUser } from '../../contexts/UserContext';

function ProfileMainScreen() {
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const navigation = useNavigation();
  const { profile, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          variant="bloodDrop"
          text="Loading profile..."
          size="large"
        />
      </View>
    );
  }

  const getDisplayName = () => {
    if (!profile?.firstName && !profile?.lastName) {
      return 'Welcome, Donor!';
    }
    return `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  };

  const getBloodGroup = () => {
    return profile?.bloodGroup ? `${profile.bloodGroup} Donor` : 'Blood Donor';
  };

  const getDaysSinceLastDonation = () => {
    if (!profile?.lastDonationDate) return 0;
    const lastDate = new Date(profile.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.firstName ? profile.firstName.charAt(0).toUpperCase() : '👤'}
            </Text>
          </View>
          <Text style={styles.name}>{getDisplayName()}</Text>
          <Text style={styles.bloodGroup}>{getBloodGroup()}</Text>
        </View>
      </Card>

      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Donation Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.totalDonations || 0}</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getDaysSinceLastDonation()}</Text>
            <Text style={styles.statLabel}>Days Since Last</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.livesSaved || 0}</Text>
            <Text style={styles.statLabel}>Lives Saved</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.actionCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Button
          title="Update Availability"
          variant="primary"
          onPress={() => navigation.navigate('UpdateAvailability' as never)}
          style={styles.actionButton}
        />
        <Button
          title="Edit Profile"
          variant="secondary"
          onPress={() => navigation.navigate('EditProfile' as never)}
          style={styles.actionButton}
        />
        <Button
          title="Donation History"
          variant="accent"
          onPress={() => navigation.navigate('DonationHistory' as never)}
          style={styles.actionButton}
        />
      </Card>

      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Button
          title="Notification Preferences"
          variant="secondary"
          onPress={() => navigation.navigate('NotificationPreferences' as never)}
          style={styles.actionButton}
        />
        <Button
          title="Privacy Settings"
          variant="secondary"
          onPress={() => navigation.navigate('PrivacySettings' as never)}
          style={styles.actionButton}
        />
        <Button
          title="Help & Support"
          variant="secondary"
          onPress={() => navigation.navigate('HelpSupport' as never)}
          style={styles.actionButton}
        />
        <Button
          title="♿ Accessibility Settings"
          variant="secondary"
          onPress={() => setShowAccessibilitySettings(true)}
          style={styles.actionButton}
          accessibilityLabel="Open accessibility settings"
          accessibilityHint="Configure accessibility options like high contrast and large text"
        />
      </Card>

      <AccessibilitySettings
        visible={showAccessibilitySettings}
        onClose={() => setShowAccessibilitySettings(false)}
        onSettingsChange={(settings) => {
          console.log('Accessibility settings updated:', settings);
          // Here you could update global accessibility context
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  profileCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  bloodGroup: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },
  statsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  actionCard: {
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
  },
});

ProfileMainScreen.displayName = 'ProfileMainScreen';

export default ProfileMainScreen;
