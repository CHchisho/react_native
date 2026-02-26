import { View } from 'react-native';
import { Text, Button } from '@rneui/themed';
import { useUserContext } from '../../hooks/ContextHooks';

const Profile = () => {
  const { user, handleLogout } = useUserContext();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text h4>Profile</Text>
      {user && (
        <Text style={{ marginVertical: 16 }}>Hello, {user.username}</Text>
      )}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Profile;
