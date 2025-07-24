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
import { UserProvider } from "./contexts/UserContext";

const Tab = createBottomTabNavigator();

function TabBarIcon({ focused, name }: { focused: boolean; name: string }) {
  const icons = {
    Home: '🏠',
    Register: '📝',
    Profile: '👤',
    About: 'ℹ️',
  };

  return (
    <Text style={{
      fontSize: 20,
      opacity: focused ? 1 : 0.6,
      transform: [{ scale: focused ? 1.1 : 1 }]
    }}>
      {icons[name as keyof typeof icons]}
    </Text>
  );
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
    return (
      <UserProvider>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name={route.name} />
            ),
            tabBarIconStyle: {
              marginTop: 2,
            },
            tabBarActiveTintColor: '#D32F2F',
            tabBarInactiveTintColor: '#666666',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopColor: '#E0E0E0',
              borderTopWidth: 1,
              paddingTop: 10,
              paddingBottom: 10,
              height: 65,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 5,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
              marginTop: 2,
              marginBottom: 2,
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
    </UserProvider>
  );
}


