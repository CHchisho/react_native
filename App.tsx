import {StatusBar} from 'expo-status-bar';
import {Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Hello, React Native!
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default App;
