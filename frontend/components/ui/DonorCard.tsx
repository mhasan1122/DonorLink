import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated } from 'react-native';
import Card from './Card';

interface Donor {
  id: number;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  divisionId: number;
  zilaId: number;
  upazilaId: number;
  phoneNumber: string;
  lastDonationDate: string;
  isAvailable: boolean;
  currentLocation?: string;
}

interface DonorCardProps {
  donor: Donor;
  onPress: () => void;
  showContact?: boolean;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function DonorCard({
  donor,
  onPress,
  showContact = false,
  onFavorite,
  isFavorite = false
}: DonorCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteAnim = useRef(new Animated.Value(1)).current;
  const getBloodGroupEmoji = (bloodGroup: string) => {
    const emojiMap: { [key: string]: string } = {
      'A+': '🅰️',
      'A-': '🅰️',
      'B+': '🅱️',
      'B-': '🅱️',
      'AB+': '🆎',
      'AB-': '🆎',
      'O+': '⭕',
      'O-': '⭕',
    };
    return emojiMap[bloodGroup] || '🩸';
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colorMap: { [key: string]: string } = {
      'A+': '#D32F2F',
      'A-': '#C62828',
      'B+': '#1976D2',
      'B-': '#1565C0',
      'AB+': '#7B1FA2',
      'AB-': '#6A1B9A',
      'O+': '#388E3C',
      'O-': '#2E7D32',
    };
    return colorMap[bloodGroup] || '#D32F2F';
  };

  const getDaysSinceLastDonation = () => {
    const lastDonation = new Date(donor.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCall = () => {
    Linking.openURL(`tel:${donor.phoneNumber}`);
  };

  const handlePress = () => {
    // Animate press feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  const handleFavorite = () => {
    if (!onFavorite) return;

    // Animate favorite button
    Animated.sequence([
      Animated.timing(favoriteAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    onFavorite();
  };

  const daysSinceLastDonation = getDaysSinceLastDonation();
  const isRecentDonor = daysSinceLastDonation < 90; // Less than 3 months
  const bloodGroupColor = getBloodGroupColor(donor.bloodGroup);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Card onPress={handlePress} variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.nameSection}>
          <Text style={styles.name}>
            {donor.firstName} {donor.lastName}
          </Text>
          <Text style={styles.location}>
            📍 {donor.currentLocation || 'Location not specified'}
          </Text>
        </View>
        
        <View style={styles.badgeContainer}>
          <View style={[styles.bloodGroupBadge, { backgroundColor: bloodGroupColor }]}>
            <Text style={styles.bloodGroupEmoji}>
              {getBloodGroupEmoji(donor.bloodGroup)}
            </Text>
            <Text style={styles.bloodGroupText}>
              {donor.bloodGroup}
            </Text>
          </View>

          {onFavorite && (
            <Animated.View style={{ transform: [{ scale: favoriteAnim }] }}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavorite}
                activeOpacity={0.8}
              >
                <Text style={styles.favoriteIcon}>
                  {isFavorite ? '❤️' : '🤍'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>

      <View style={styles.statusRow}>
        <View style={styles.statusItem}>
          <View style={[
            styles.availabilityBadge,
            { backgroundColor: donor.isAvailable ? '#4CAF50' : '#FFC107' }
          ]}>
            <Text style={styles.availabilityText}>
              {donor.isAvailable ? '✅ Available' : '⏳ Busy'}
            </Text>
          </View>
        </View>

        <View style={styles.statusItem}>
          <Text style={styles.lastDonationLabel}>Last donated:</Text>
          <Text style={[
            styles.lastDonationText,
            isRecentDonor && styles.recentDonationText
          ]}>
            {daysSinceLastDonation} days ago
            {isRecentDonor && ' 🔥'}
          </Text>
        </View>
      </View>

      {showContact && (
        <View style={styles.contactSection}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Text style={styles.callButtonText}>
              📞 Call {donor.phoneNumber}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.tapHint}>
          Tap for more details
        </Text>
      </View>
    </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
    marginRight: 12,
  },
  badgeContainer: {
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666666',
  },
  bloodGroupBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  bloodGroupEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  bloodGroupText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusItem: {
    flex: 1,
  },
  availabilityBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastDonationLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'right',
  },
  lastDonationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'right',
  },
  recentDonationText: {
    color: '#D32F2F',
  },
  contactSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  callButton: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  tapHint: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteIcon: {
    fontSize: 16,
  },
});
