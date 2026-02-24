import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import {colors} from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Single'>;

const Single = ({route}: Props) => {
  const {item} = route.params;
  const isImage = item.media_type.startsWith('image');
  const isVideo = item.media_type.startsWith('video');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{item.title}</Text>

      {item.description != null && item.description !== '' && (
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>{item.description}</Text>
        </View>
      )}

      {isImage && (
        <View style={styles.section}>
          <Image
            source={{uri: item.thumbnail}}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={item.title}
          />
        </View>
      )}

      {isVideo && (
        <View style={styles.section}>
          <Text style={styles.textMuted}>Type: {item.media_type}</Text>
        </View>
      )}

      {!isImage && !isVideo && (
        <View style={styles.section}>
          <Text style={styles.textMuted}>Media type: {item.media_type}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Created</Text>
        <Text style={styles.text}>
          {new Date(item.created_at).toLocaleString('fi-FI')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Size</Text>
        <Text style={styles.text}>{item.filesize}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Type</Text>
        <Text style={styles.text}>{item.media_type}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Owner</Text>
        <Text style={styles.text}>{item.username}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#9ca3af',
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    color: '#e5e7eb',
  },
  textMuted: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 8,
    backgroundColor: '#1f2937',
  },
});

export default Single;
