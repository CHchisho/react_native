import {View, FlatList, Alert} from 'react-native';
import {Text, Button} from '@rneui/themed';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../../hooks/apiHooks';
import {useUpdateContext} from '../../hooks/ContextHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {MediaItemWithOwner} from '../../types/DBTypes';
import type {
  RootStackParamList,
  TabParamList,
} from '../../navigators/Navigator';

type HomeScreenProps = BottomTabScreenProps<TabParamList, 'Home'>;

const Home = ({navigation}: HomeScreenProps) => {
  const {mediaArray, deleteMedia} = useMedia();
  const {setUpdate} = useUpdateContext();
  const stackNavigation = navigation.getParent() as NativeStackNavigationProp<
    RootStackParamList,
    'Tabs'
  >;

  const openUpload = () => {
    navigation.navigate('Upload');
  };

  const handleView = (item: MediaItemWithOwner) => {
    stackNavigation?.navigate('Single', {item});
  };

  const handleModify = (item: MediaItemWithOwner) => {
    stackNavigation?.navigate('Modify', {item});
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
      navigation={stackNavigation}
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
        data={mediaArray}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default Home;
