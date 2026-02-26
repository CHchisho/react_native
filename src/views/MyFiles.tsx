import {useMemo} from 'react';
import {View, FlatList} from 'react-native';
import {Text} from '@rneui/themed';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import type {MediaItemWithOwner} from '../../types/DBTypes';
import {useMedia} from '../../hooks/apiHooks';
import {useUserContext} from '../../hooks/ContextHooks';
import MediaListItem from '../components/MediaListItem';

type Props = NativeStackScreenProps<RootStackParamList, 'MyFiles'>;

const MyFiles = ({navigation}: Props) => {
  const {user} = useUserContext();
  const {mediaArray} = useMedia();

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
    console.log('modify', item);
  };

  const handleDelete = (item: MediaItemWithOwner) => {
    console.log('delete', item);
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
      <Text h4 style={{marginBottom: 16}}>
        My files
      </Text>
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
