import "./global.css";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import HomeScreen from "./components/screens/HomeScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ProfileScreen from "./components/screens/ProfileScreen";
import AboutScreen from "./components/screens/AboutScreen";
import OnboardingScreen from "./components/onboarding/OnboardingScreen";
import { storage } from "./utils/storage";

const Tab = createBottomTabNavigator();

function TabBarIcon({ focused, name }: { focused: boolean; name: string }) {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Register: focused ? '📝' : '📄',
    Profile: focused ? '👤' : '👥',
    About: focused ? 'ℹ️' : 'ⓘ',
  };

  return <Text style={{ fontSize: 20 }}>{icons[name as keyof typeof icons]}</Text>;
}

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await storage.getOnboardingCompleted();
      setShowOnboarding(!completed);
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      setShowOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await storage.setOnboardingCompleted(true);
      setShowOnboarding(false);
    } catch (error) {
      console.log('Error saving onboarding status:', error);
      setShowOnboarding(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name={route.name} />
          ),
          tabBarActiveTintColor: '#D32F2F',
          tabBarInactiveTintColor: '#666666',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E0E0E0',
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Find Donors' }}
        />
        <Tab.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Become Donor' }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: 'My Profile' }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About & Help' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}


