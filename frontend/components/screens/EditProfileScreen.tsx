import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Input, LoadingSpinner } from '../ui';
import BloodGroupSelector from '../ui/BloodGroupSelector';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';

function EditProfileScreen() {
  const navigation = useNavigation();
  const { profile: userProfile, updateProfile, isLoading: userLoading } = useUser();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bloodGroup: 'A+',
    age: '',
    weight: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setProfile({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        bloodGroup: userProfile.bloodGroup || 'A+',
        age: userProfile.age || '',
        weight: userProfile.weight || '',
        address: userProfile.address || '',
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    // Basic validation
    if (!profile.firstName || !profile.lastName || !profile.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Update the user profile in context and storage
      await updateProfile(profile);

      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('ProfileMain' as never) }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfileField = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (userLoading) {
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Input
          label="First Name *"
          value={profile.firstName}
          onChangeText={(value) => updateProfileField('firstName', value)}
          placeholder="Enter your first name"
          style={styles.input}
        />

        <Input
          label="Last Name *"
          value={profile.lastName}
          onChangeText={(value) => updateProfileField('lastName', value)}
          placeholder="Enter your last name"
          style={styles.input}
        />

        <Input
          label="Email"
          value={profile.email}
          onChangeText={(value) => updateProfileField('email', value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.input}
        />

        <Input
          label="Phone Number *"
          value={profile.phoneNumber}
          onChangeText={(value) => updateProfileField('phoneNumber', value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Medical Information</Text>
        
        <View style={styles.bloodGroupContainer}>
          <Text style={styles.inputLabel}>Blood Group *</Text>
          <BloodGroupSelector
            selectedBloodGroup={profile.bloodGroup}
            onSelect={(bloodGroup) => updateProfileField('bloodGroup', bloodGroup)}
          />
        </View>

        <Input
          label="Age"
          value={profile.age}
          onChangeText={(value) => updateProfileField('age', value)}
          placeholder="Enter your age"
          keyboardType="numeric"
          style={styles.input}
        />

        <Input
          label="Weight (kg)"
          value={profile.weight}
          onChangeText={(value) => updateProfileField('weight', value)}
          placeholder="Enter your weight"
          keyboardType="numeric"
          style={styles.input}
        />
      </Card>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>Location</Text>
        
        <Input
          label="Address"
          value={profile.address}
          onChangeText={(value) => updateProfileField('address', value)}
          placeholder="Enter your address"
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Save Changes"
          variant="primary"
          onPress={handleSaveProfile}
          loading={loading}
          style={styles.saveButton}
        />
      </View>

      <Text style={styles.note}>
        * Required fields{'\n'}
        💡 Keep your profile updated to help others find you when they need blood donation.
      </Text>
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
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  bloodGroupContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  buttonContainer: {
    marginVertical: 24,
  },
  saveButton: {
    marginBottom: 16,
  },
  note: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
    lineHeight: 18,
  },
});

EditProfileScreen.displayName = 'EditProfileScreen';

export default EditProfileScreen;
