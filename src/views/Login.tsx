import {useEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button} from '@rneui/themed';
import {useUserContext} from '../../hooks/ContextHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const {handleAutoLogin} = useUserContext();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    handleAutoLogin();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1, padding: 16, paddingBottom: 32}}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{marginBottom: 24}}>
        {showRegister ? (
          <>
            <RegisterForm />
            <Button
              type="clear"
              title="Already have an account? Log in"
              onPress={() => setShowRegister(false)}
              titleStyle={{fontSize: 14}}
            />
          </>
        ) : (
          <>
            <LoginForm />
            <Button
              type="clear"
              title="No account yet? Register"
              onPress={() => setShowRegister(true)}
              titleStyle={{fontSize: 14}}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Login;
