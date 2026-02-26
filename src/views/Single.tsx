import React from 'react';
import {
  Image,
  ScrollView,
  View,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import {Text, Card, Button} from '@rneui/themed';
import {useVideoPlayer, VideoView} from 'expo-video';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import Likes from '../components/Likes';
import Comments from '../components/Comments';
import {useUserContext, useUpdateContext} from '../../hooks/ContextHooks';
import {useMedia} from '../../hooks/apiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {MediaItemWithOwner} from '../../types/DBTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Single'>;

function formatFilesize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function VideoPlayer({uri}: {uri: string}) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });
  return (
    <VideoView
      style={styles.video}
      player={player}
      contentFit="contain"
      nativeControls={true}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
}

const Single = ({route, navigation}: Props) => {
  const {item} = route.params;
  const {width} = useWindowDimensions();
  const {user} = useUserContext();
  const {deleteMedia} = useMedia();
  const {setUpdate} = useUpdateContext();

  const isImage = item.media_type.startsWith('image');
  const isVideo = item.media_type.startsWith('video');
  const isOwner = user != null && user.user_id === item.user_id;

  const mediaUrl = isVideo
    ? item.thumbnail ||
      (item.filename
        ? `${process.env.EXPO_PUBLIC_MEDIA_API}/uploads/${item.filename}`
        : '')
    : item.thumbnail;

  const handleDelete = () => {
    Alert.alert(
      'Delete media',
      `Delete "${item.title}"? This cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) return;
              await deleteMedia(item.media_id, token);
              setUpdate((u) => !u);
              navigation.goBack();
            } catch (e) {
              Alert.alert(
                'Error',
                e instanceof Error ? e.message : 'Failed to delete',
              );
            }
          },
        },
      ],
    );
  };

  const handleModify = () => {
    navigation.navigate('Modify', {item});
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text h4 style={styles.title}>
        {item.title}
      </Text>
      <Text style={styles.owner}>By: {item.username}</Text>

      {item.description != null && item.description !== '' && (
        <Card containerStyle={styles.card}>
          <Card.Title>Description</Card.Title>
          <Card.Divider />
          <Text>{item.description}</Text>
        </Card>
      )}

      <Card containerStyle={styles.card}>
        {isImage && (
          <View style={styles.mediaWrapper}>
            <Image
              source={{uri: item.thumbnail}}
              style={styles.media}
              resizeMode="contain"
              accessibilityLabel={item.title}
            />
          </View>
        )}
        {isVideo && mediaUrl && (
          <View style={styles.videoWrapper}>
            <VideoPlayer uri={mediaUrl} />
          </View>
        )}
        {!isImage && !isVideo && (
          <Text style={styles.unknownType}>Media type: {item.media_type}</Text>
        )}
      </Card>

      <Likes item={item} />
      <Comments mediaId={item.media_id} />

      <Card containerStyle={styles.card}>
        <Card.Title>Details</Card.Title>
        <Card.Divider />
        <Text style={styles.detail}>
          Created: {new Date(item.created_at).toLocaleString('fi-FI')}
        </Text>
        <Text style={styles.detail}>Size: {formatFilesize(item.filesize)}</Text>
        <Text style={styles.detail}>Type: {item.media_type}</Text>
        <Text style={styles.detail}>Owner: {item.username}</Text>
      </Card>

      {isOwner && (
        <View style={styles.actions}>
          <Button
            title="Modify"
            type="outline"
            onPress={handleModify}
            containerStyle={styles.button}
          />
          <Button
            title="Delete"
            buttonStyle={styles.deleteButton}
            onPress={handleDelete}
            containerStyle={styles.button}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {flex: 1},
  container: {padding: 16, paddingBottom: 32},
  title: {marginBottom: 16},
  owner: {color: '#e63946', marginBottom: 12},
  card: {marginTop: 16},
  mediaWrapper: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#374151',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {flex: 1},
  unknownType: {color: '#86939e'},
  detail: {marginBottom: 4},
  actions: {flexDirection: 'row', marginTop: 24, gap: 12},
  button: {flex: 1},
  deleteButton: {backgroundColor: '#dc2626'},
});

export default Single;
