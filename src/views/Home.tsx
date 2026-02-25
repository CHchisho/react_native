import { View, FlatList } from 'react-native';
import { Text } from '@rneui/themed';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MediaListItem from '../components/MediaListItem';
import { useMedia } from '../../hooks/apiHooks';
import type { MediaItemWithOwner } from '../../types/DBTypes';
import type { RootStackParamList } from '../../navigators/Navigator';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Tabs'>;
};

const Home = ({ navigation }: HomeScreenProps) => {
  const { mediaArray } = useMedia();
  const stackNavigation = navigation.getParent() as
    | NativeStackNavigationProp<RootStackParamList, 'Tabs'>
    | undefined;

  const handleView = (item: MediaItemWithOwner) => {
    stackNavigation?.navigate('Single', { item });
  };

  const handleModify = (item: MediaItemWithOwner) => {
    console.log('modify', item);
  };

  const handleDelete = (item: MediaItemWithOwner) => {
    console.log('delete', item);
  };

  const renderItem = ({ item }: { item: MediaItemWithOwner }) => (
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text h3 style={{ marginBottom: 16 }}>
        My Media
      </Text>
      <FlatList
        data={mediaArray}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default Home;
