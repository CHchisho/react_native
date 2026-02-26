import {View, ScrollView} from 'react-native';
import {Text, Card, Button} from '@rneui/themed';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Upload'>;

const Upload = ({navigation}: Props) => {
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 16, paddingBottom: 32}}
    >
      <Text h4 style={{marginBottom: 16}}>
        Add photo
      </Text>

      <Card>
        <Card.Title>Upload media</Card.Title>
        <Card.Divider />
        <Text style={{color: '#9ca3af', marginBottom: 16}}>Soon</Text>
        <Button
          title="Back"
          type="outline"
          onPress={() => navigation.goBack()}
        />
      </Card>
    </ScrollView>
  );
};

export default Upload;
