import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DonorListScreen from '../DonorListScreen';
import DonorDetailScreen from '../DonorDetailScreen';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DonorList"
        component={DonorListScreen}
        options={{
          title: "Find Blood Donors",
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
        name="DonorDetail"
        component={DonorDetailScreen}
        options={{
          title: "Donor Details",
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

HomeScreen.displayName = 'HomeScreen';

export default HomeScreen;
