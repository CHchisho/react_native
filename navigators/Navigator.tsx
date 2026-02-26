import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {Icon} from '@rneui/themed';
import {useUserContext} from '../hooks/ContextHooks';
import {colors} from '../src/constants/theme';
import Home from '../src/views/Home';
import Single from '../src/views/Single';
import Profile from '../src/views/Profile';
import Login from '../src/views/Login';
import MyFiles from '../src/views/MyFiles';
import Upload from '../src/views/Upload';
import type {MediaItemWithOwner} from '../types/DBTypes';

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  Single: {item: MediaItemWithOwner};
  MyFiles: undefined;
  Upload: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({color, size}) => (
          <Icon
            type="material"
            iconProps={{
              name: route.name === 'Home' ? 'home' : 'person',
              size: size ?? 24,
              color,
            }}
          />
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
        headerStyle: {backgroundColor: '#1f2937'},
        headerTitleStyle: {color: '#e5e7eb'},
      }}
    >
      <Stack.Screen
        name="Tabs"
        component={TabScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Single" component={Single} />
      <Stack.Screen
        name="MyFiles"
        component={MyFiles}
        options={{title: 'My files'}}
      />
      <Stack.Screen
        name="Upload"
        component={Upload}
        options={{title: 'Add photo'}}
      />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  const {user} = useUserContext();

  return (
    <NavigationContainer>
      {user == null ? (
        <Stack.Navigator
          screenOptions={{
            headerTintColor: colors.accent,
            headerStyle: {backgroundColor: '#1f2937'},
            headerTitleStyle: {color: '#e5e7eb'},
          }}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      ) : (
        <StackScreen />
      )}
    </NavigationContainer>
  );
};

export default Navigator;
