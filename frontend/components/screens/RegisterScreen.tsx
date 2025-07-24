import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DonorRegistrationScreen from '../DonorRegistrationScreen';
import HealthCheckScreen from '../HealthCheckScreen';

const Stack = createNativeStackNavigator();

function RegisterScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DonorRegistration" 
        component={DonorRegistrationScreen} 
        options={{ 
          title: "Become a Donor",
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
        name="HealthCheck" 
        component={HealthCheckScreen} 
        options={{ 
          title: "Health Check",
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

RegisterScreen.displayName = 'RegisterScreen';

export default RegisterScreen;
