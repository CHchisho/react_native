import {useMemo} from 'react';
import {View, FlatList, Alert} from 'react-native';
import {Text} from '@rneui/themed';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import type {MediaItemWithOwner} from '../../types/DBTypes';
import {useMedia} from '../../hooks/apiHooks';
import {useUserContext, useUpdateContext} from '../../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MediaListItem from '../components/MediaListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'MyFiles'>;

const MyFiles = ({navigation}: Props) => {
  const {user} = useUserContext();
  const {mediaArray, deleteMedia} = useMedia();
  const {setUpdate} = useUpdateContext();

  const myMedia = useMemo(() => {
    if (!user) return [];
    return mediaArray.filter((item) => item.user_id === user.user_id);
  }, [mediaArray, user]);

  const stackNav = navigation as NativeStackNavigationProp<
    RootStackParamList,
    'Tabs'
  >;

  const handleView = (item: MediaItemWithOwner) => {
    navigation.navigate('Single', {item});
  };

  const handleModify = (item: MediaItemWithOwner) => {
    navigation.navigate('Modify', {item});
  };

  const handleDelete = (item: MediaItemWithOwner) => {
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

  const renderItem = ({item}: {item: MediaItemWithOwner}) => (
    <MediaListItem
      navigation={stackNav}
      item={item}
      onView={handleView}
      onModify={handleModify}
      onDelete={handleDelete}
    />
  );

  const keyExtractor = (item: MediaItemWithOwner) => String(item.media_id);

  return (
    <View style={{flex: 1, padding: 16}}>
      <FlatList
        data={myMedia}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <Text style={{color: '#9ca3af', marginTop: 16}}>
            You have no media files yet.
          </Text>
        }
      />
    </View>
  );
};

export default MyFiles;
