import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './contexts/UserContext';
import Home from './src/views/Home';

const App = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <View style={{ flex: 1 }}>
          <Home />
        </View>
        <StatusBar style="auto" />
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;
