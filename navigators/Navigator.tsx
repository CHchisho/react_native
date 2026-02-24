import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { colors } from '../src/constants/theme';
import Home from '../src/views/Home';
import Single from '../src/views/Single';
import Profile from '../src/views/Profile';
import type { MediaItemWithOwner } from '../types/DBTypes';

export type RootStackParamList = {
  Tabs: undefined;
  Single: {item: MediaItemWithOwner};
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ color, size }) => (
          <Text style={{ color, fontSize: size ?? 24 }}>
            {route.name === 'Home' ? '⌂' : '👤'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.accent,
        headerStyle: { backgroundColor: '#1f2937' },
        headerTitleStyle: { color: '#e5e7eb' },
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Single" component={Single} />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;
