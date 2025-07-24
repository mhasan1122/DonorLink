import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMainScreen from './ProfileMainScreen';
import UpdateAvailabilityScreen from './UpdateAvailabilityScreen';
import EditProfileScreen from './EditProfileScreen';
import DonationHistoryScreen from './DonationHistoryScreen';
import NotificationPreferencesScreen from './NotificationPreferencesScreen';
import PrivacySettingsScreen from './PrivacySettingsScreen';
import HelpSupportScreen from './HelpSupportScreen';

const Stack = createNativeStackNavigator();

function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={ProfileMainScreen}
        options={{
          title: "My Profile",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="UpdateAvailability"
        component={UpdateAvailabilityScreen}
        options={{
          title: "Update Availability",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="DonationHistory"
        component={DonationHistoryScreen}
        options={{
          title: "Donation History",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="NotificationPreferences"
        component={NotificationPreferencesScreen}
        options={{
          title: "Notification Preferences",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          title: "Privacy Settings",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{
          title: "Help & Support",
          headerStyle: {
            backgroundColor: '#D32F2F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

ProfileScreen.displayName = 'ProfileScreen';

export default ProfileScreen;
