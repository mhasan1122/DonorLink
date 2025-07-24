import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API_ENDPOINTS, apiRequest } from "../config/api";
import { Card, Button, LoadingSpinner } from "./ui";

function DonorDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDonor = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(API_ENDPOINTS.DONOR_BY_ID(id));
        setDonor(data);
      } catch (error) {
        console.error('Error fetching donor:', error);
        setError("Donor not found");
      } finally {
        setLoading(false);
      }
    };

    fetchDonor();
  }, [id]);

  // Helper functions
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
    if (!donor?.lastDonationDate) return null;
    const lastDonation = new Date(donor.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCall = () => {
    if (donor?.phoneNumber) {
      Linking.openURL(`tel:${donor.phoneNumber}`);
    }
  };

  const handleSMS = () => {
    if (donor?.phoneNumber) {
      Linking.openURL(`sms:${donor.phoneNumber}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Loading donor details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorEmoji}>😔</Text>
        <Text style={styles.errorTitle}>Donor Not Found</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  if (!donor) return null;

  const daysSinceLastDonation = getDaysSinceLastDonation();
  const isRecentDonor = daysSinceLastDonation && daysSinceLastDonation < 90;
  const bloodGroupColor = getBloodGroupColor(donor.bloodGroup);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          size="small"
          style={styles.headerBackButton}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: bloodGroupColor }]}>
                <Text style={styles.avatarText}>
                  {donor.firstName.charAt(0)}{donor.lastName.charAt(0)}
                </Text>
              </View>
            </View>

            <View style={styles.nameSection}>
              <Text style={styles.donorName}>
                {donor.firstName} {donor.lastName}
              </Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>
                  {donor.currentLocation || 'Location not specified'}
                </Text>
              </View>
            </View>

            <View style={[styles.bloodGroupBadge, { backgroundColor: bloodGroupColor }]}>
              <Text style={styles.bloodGroupEmoji}>
                {getBloodGroupEmoji(donor.bloodGroup)}
              </Text>
              <Text style={styles.bloodGroupText}>
                {donor.bloodGroup}
              </Text>
            </View>
          </View>

          {/* Availability Status */}
          <View style={styles.statusContainer}>
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: donor.isAvailable ? '#4CAF50' : '#FFC107' }
            ]}>
              <Text style={styles.availabilityText}>
                {donor.isAvailable ? '✅ Available for Donation' : '⏳ Currently Unavailable'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Health Information Card */}
        <Card style={styles.infoCard} variant="elevated">
          <Text style={styles.cardTitle}>🩸 Health & Donation Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group:</Text>
            <View style={styles.infoValueContainer}>
              <Text style={[styles.infoValue, { color: bloodGroupColor, fontWeight: 'bold' }]}>
                {getBloodGroupEmoji(donor.bloodGroup)} {donor.bloodGroup}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Donation:</Text>
            <View style={styles.infoValueContainer}>
              <Text style={styles.infoValue}>
                {formatDate(donor.lastDonationDate)}
              </Text>
              {daysSinceLastDonation && (
                <Text style={[
                  styles.daysSinceText,
                  isRecentDonor && styles.recentDonationText
                ]}>
                  ({daysSinceLastDonation} days ago{isRecentDonor && ' 🔥'})
                </Text>
              )}
            </View>
          </View>

          {donor.notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Medical Notes:</Text>
              <Text style={styles.infoValue}>{donor.notes}</Text>
            </View>
          )}
        </Card>

        {/* Contact Information Card */}
        <Card style={styles.infoCard} variant="elevated">
          <Text style={styles.cardTitle}>📞 Contact Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number:</Text>
            <Text style={styles.infoValue}>{donor.phoneNumber}</Text>
          </View>

          {/* Contact Action Buttons */}
          <View style={styles.contactActions}>
            <TouchableOpacity
              style={[styles.contactButton, styles.callButton]}
              onPress={handleCall}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>📞 Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactButton, styles.smsButton]}
              onPress={handleSMS}
              activeOpacity={0.8}
            >
              <Text style={styles.contactButtonText}>💬 SMS</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Location Information Card */}
        <Card style={styles.infoCard} variant="elevated">
          <Text style={styles.cardTitle}>📍 Location Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Location:</Text>
            <Text style={styles.infoValue}>
              {donor.currentLocation || 'Not specified'}
            </Text>
          </View>

          {donor.village && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Village:</Text>
              <Text style={styles.infoValue}>{donor.village}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Administrative Area:</Text>
            <Text style={styles.infoValue}>
              Division: {donor.divisionId} • Zila: {donor.zilaId} • Upazila: {donor.upazilaId}
            </Text>
          </View>
        </Card>

        {/* System Information Card */}
        <Card style={styles.infoCard} variant="outlined">
          <Text style={styles.cardTitle}>ℹ️ System Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registered:</Text>
            <Text style={styles.infoValue}>{formatDate(donor.createdAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>{formatDate(donor.updatedAt)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Donor ID:</Text>
            <Text style={styles.infoValue}>#{donor.id}</Text>
          </View>
        </Card>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <Button
          title="📞 Call Now"
          onPress={handleCall}
          variant="primary"
          style={styles.primaryActionButton}
        />
        <Button
          title="💬 Send Message"
          onPress={handleSMS}
          variant="accent"
          style={styles.secondaryActionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 32,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    paddingHorizontal: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  headerBackButton: {
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nameSection: {
    flex: 1,
    marginRight: 12,
  },
  donorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    lineHeight: 28,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 16,
    color: '#666666',
    flex: 1,
    lineHeight: 20,
  },
  bloodGroupBadge: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bloodGroupEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  bloodGroupText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusContainer: {
    alignItems: 'center',
  },
  availabilityBadge: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  availabilityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 8,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  daysSinceText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  recentDonationText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  contactButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  smsButton: {
    backgroundColor: '#1976D2',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100, // Space for fixed bottom buttons
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  primaryActionButton: {
    flex: 1,
  },
  secondaryActionButton: {
    flex: 1,
  },
});

DonorDetailScreen.displayName = 'DonorDetailScreen';

export default DonorDetailScreen;