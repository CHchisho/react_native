import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './contexts/UserContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <UserProvider>
          <Navigator />
        </UserProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
