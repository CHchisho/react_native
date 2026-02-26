import {Image, ScrollView} from 'react-native';
import {Text, Card, Divider} from '@rneui/themed';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import Likes from '../components/Likes';
import Comments from '../components/Comments';

type Props = NativeStackScreenProps<RootStackParamList, 'Single'>;

const Single = ({route}: Props) => {
  const {item} = route.params;
  const isImage = item.media_type.startsWith('image');
  const isVideo = item.media_type.startsWith('video');

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 16, paddingBottom: 32}}
    >
      <Text h4 style={{marginBottom: 16}}>
        {item.title}
      </Text>
      <Text style={{color: '#e63946', marginBottom: 12}}>
        By: {item.username}
      </Text>

      {item.description != null && item.description !== '' && (
        <Card>
          <Card.Title>Description</Card.Title>
          <Card.Divider />
          <Text>{item.description}</Text>
        </Card>
      )}

      <Card containerStyle={{marginTop: 16}}>
        <Image
          source={{uri: item.thumbnail}}
          style={{width: '100%', aspectRatio: 16 / 10, borderRadius: 8}}
          resizeMode="contain"
          accessibilityLabel={item.title}
        />
      </Card>

      <Likes item={item} />
      <Comments mediaId={item.media_id} />

      {!isImage && !isVideo && (
        <Card containerStyle={{marginTop: 16}}>
          <Text style={{color: '#86939e'}}>Media type: {item.media_type}</Text>
        </Card>
      )}

      <Card containerStyle={{marginTop: 16}}>
        <Card.Title>Created</Card.Title>
        <Card.Divider />
        <Text>{new Date(item.created_at).toLocaleString('fi-FI')}</Text>
      </Card>

      <Card containerStyle={{marginTop: 16}}>
        <Card.Title>Size</Card.Title>
        <Card.Divider />
        <Text>{item.filesize}</Text>
      </Card>

      <Card containerStyle={{marginTop: 16}}>
        <Card.Title>Type</Card.Title>
        <Card.Divider />
        <Text>{item.media_type}</Text>
      </Card>

      <Card containerStyle={{marginTop: 16}}>
        <Card.Title>Owner</Card.Title>
        <Card.Divider />
        <Text>{item.username}</Text>
      </Card>
    </ScrollView>
  );
};

export default Single;
