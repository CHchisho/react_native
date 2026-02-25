import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@rneui/themed';
import { UserProvider } from './contexts/UserContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <>
      <SafeAreaProvider>
        <ThemeProvider>
          <UserProvider>
            <Navigator />
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
