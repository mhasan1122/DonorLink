import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Button, LoadingSpinner } from '../ui';
import { useUser } from '../../contexts/UserContext';

function UpdateAvailabilityScreen() {
  const navigation = useNavigation();
  const { profile, updateProfile, isLoading: userLoading } = useUser();
  const [isAvailable, setIsAvailable] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsAvailable(profile.isAvailable ?? true);
      setLastDonationDate(profile.lastDonationDate || '');
    }
  }, [profile]);

  const handleUpdateAvailability = async () => {
    setLoading(true);
    try {
      // Update the user profile with new availability status
      await updateProfile({
        isAvailable,
        lastDonationDate: lastDonationDate || profile?.lastDonationDate || ''
      });

      Alert.alert(
        'Success',
        'Your availability status has been updated successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('ProfileMain' as never) }]
      );
    } catch (error) {
      console.error('Error updating availability:', error);
      Alert.alert(
        'Error',
        'Failed to update availability. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateNextEligibleDate = () => {
    if (!lastDonationDate) return 'Not available';
    const lastDate = new Date(lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 56); // 8 weeks minimum gap
    return nextDate.toLocaleDateString();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          variant="bloodDrop"
          text="Loading availability..."
          size="large"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Available for Donation</Text>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#CCCCCC', true: '#D32F2F' }}
            thumbColor={isAvailable ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>
        <Text style={styles.statusDescription}>
          {isAvailable 
            ? '✅ You are currently available for blood donation'
            : '⏸️ You are currently unavailable for blood donation'
          }
        </Text>
      </Card>

      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Donation Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Donation:</Text>
          <Text style={styles.infoValue}>{formatDate(lastDonationDate)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Next Eligible Date:</Text>
          <Text style={styles.infoValue}>{calculateNextEligibleDate()}</Text>
        </View>
        <Text style={styles.infoNote}>
          💡 You can donate blood every 8 weeks (56 days) for whole blood donation.
        </Text>
      </Card>

      <Card style={styles.guidelinesCard}>
        <Text style={styles.sectionTitle}>Availability Guidelines</Text>
        <Text style={styles.guidelineText}>
          • Mark yourself as unavailable if you're sick, traveling, or recently donated{'\n'}
          • Update your status after recovering from illness{'\n'}
          • Keep your availability current to help those in need{'\n'}
          • You'll receive notifications when someone needs your blood type
        </Text>
      </Card>

      <Button
        title="Update Availability"
        variant="primary"
        onPress={handleUpdateAvailability}
        loading={loading}
        style={styles.updateButton}
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
  statusCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  infoNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  guidelinesCard: {
    marginBottom: 24,
  },
  guidelineText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  updateButton: {
    marginBottom: 32,
  },
});

UpdateAvailabilityScreen.displayName = 'UpdateAvailabilityScreen';

export default UpdateAvailabilityScreen;
