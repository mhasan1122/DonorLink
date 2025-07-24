import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from '../ui';
import AccessibilitySettings from '../ui/AccessibilitySettings';

function ProfileScreen() {
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.bloodGroup}>A+ Donor</Text>
        </View>
      </Card>

      <Card style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Donation Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>Days Since Last</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Lives Saved</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.actionCard}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Button
          title="Update Availability"
          variant="primary"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <Button
          title="Edit Profile"
          variant="secondary"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <Button
          title="Donation History"
          variant="accent"
          onPress={() => {}}
          style={styles.actionButton}
        />
      </Card>

      <Card style={styles.settingsCard}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Button
          title="Notification Preferences"
          variant="secondary"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <Button
          title="Privacy Settings"
          variant="secondary"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <Button
          title="Help & Support"
          variant="secondary"
          onPress={() => {}}
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
  profileCard: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D32F2F',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  actionCard: {
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 8,
  },
});

ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
