import {useState} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Button, Card, ListItem} from '@rneui/themed';
import {useUserContext} from '../../hooks/ContextHooks';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import {colors} from '../constants/theme';
import ProfileUpdateForm from '../components/ProfileUpdateForm';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
};

const Profile = ({navigation}: ProfileScreenProps) => {
  const {user, handleLogout} = useUserContext();
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const openMyFiles = () => {
    const stack = navigation.getParent() as
      | {navigate: (name: 'MyFiles') => void}
      | undefined;
    stack?.navigate('MyFiles');
  };

  if (!user) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text h4>Profile</Text>
        <Text style={{marginVertical: 16, color: '#9ca3af'}}>
          Please login to view your profile.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 16, paddingBottom: 32}}
    >
      <Text h4 style={{marginBottom: 16}}>
        Profile
      </Text>

      <Card containerStyle={{marginBottom: 16}}>
        <Card.Title>User data</Card.Title>
        <Card.Divider />
        <ListItem.Content>
          <ListItem.Title style={{color: colors.accent}}>
            Username
          </ListItem.Title>
          <ListItem.Subtitle style={{marginBottom: 12}}>
            {user.username}
          </ListItem.Subtitle>
          <ListItem.Title style={{color: colors.accent}}>Email</ListItem.Title>
          <ListItem.Subtitle style={{marginBottom: 12}}>
            {user.email}
          </ListItem.Subtitle>
          <ListItem.Title style={{color: colors.accent}}>
            User level
          </ListItem.Title>
          <ListItem.Subtitle style={{marginBottom: 12}}>
            {user.level_name}
          </ListItem.Subtitle>
          <ListItem.Title style={{color: colors.accent}}>
            Created
          </ListItem.Title>
          <ListItem.Subtitle>
            {new Date(user.created_at).toLocaleString('fi-FI')}
          </ListItem.Subtitle>
        </ListItem.Content>
      </Card>

      {showUpdateForm ? (
        <>
          <ProfileUpdateForm onSuccess={() => setShowUpdateForm(false)} />
          <Button
            type="clear"
            title="Cancel"
            onPress={() => setShowUpdateForm(false)}
            titleStyle={{fontSize: 14}}
          />
        </>
      ) : (
        <Button
          title="Update profile"
          onPress={() => setShowUpdateForm(true)}
          containerStyle={{marginBottom: 16}}
        />
      )}

      <Button
        title="My files"
        onPress={openMyFiles}
        containerStyle={{marginBottom: 16}}
      />

      <Button title="Logout" type="outline" onPress={handleLogout} />
    </ScrollView>
  );
};

export default Profile;
