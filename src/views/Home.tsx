import {View, Text, FlatList, StyleSheet} from 'react-native';
import MediaListItem from '../components/MediaListItem';
import {useMedia} from '../../hooks/apiHooks';
import type {MediaItemWithOwner} from '../../types/DBTypes';

const Home = () => {
  const {mediaArray} = useMedia();

  const handleView = (item: MediaItemWithOwner) => {
    console.log('view', item);
  };

  const handleModify = (item: MediaItemWithOwner) => {
    console.log('modify', item);
  };

  const handleDelete = (item: MediaItemWithOwner) => {
    console.log('delete', item);
  };

  const renderItem = ({item}: {item: MediaItemWithOwner}) => (
    <MediaListItem
      item={item}
      onView={handleView}
      onModify={handleModify}
      onDelete={handleDelete}
    />
  );

  const keyExtractor = (item: MediaItemWithOwner) => String(item.media_id);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Media</Text>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.thumbHeader]}>Thumbnail</Text>
          <Text style={styles.headerCell}>Title</Text>
          <Text style={styles.headerCell}>Description</Text>
          <Text style={styles.headerCell}>Created</Text>
          <Text style={styles.headerCell}>Size</Text>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Owner</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>
        <FlatList
          data={mediaArray}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#111827',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#60a5fa',
    color: '#60a5fa',
    alignSelf: 'flex-start',
  },
  table: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#60a5fa',
    backgroundColor: '#374151',
    alignItems: 'center',
  },
  headerCell: {
    flex: 1,
    minWidth: 60,
    marginRight: 8,
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  thumbHeader: {
    width: 80,
    flex: 0,
    minWidth: 80,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default Home;
