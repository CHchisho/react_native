import {useMemo} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider, createTheme} from '@rneui/themed';
import {UserProvider} from './contexts/UserContext';
import {UpdateProvider} from './contexts/UpdateContext';
import Navigator from './navigators/Navigator';

const App = () => {
  const theme = useMemo(() => createTheme({}), []);

  return (
    <>
      <SafeAreaProvider>
        <ThemeProvider theme={theme}>
          <UserProvider>
            <UpdateProvider>
              <Navigator />
            </UpdateProvider>
          </UserProvider>
        </ThemeProvider>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
