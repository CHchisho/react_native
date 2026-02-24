import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  text: {
    fontSize: 24,
    color: colors.accent,
  },
});

export default Profile;
