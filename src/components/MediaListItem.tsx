import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MediaItemWithOwner } from '../../types/DBTypes';
import type { RootStackParamList } from '../../navigators/Navigator';
import { useUserContext } from '../../hooks/ContextHooks';
import { colors } from '../constants/theme';

type MediaListItemProps = {
  navigation?: NativeStackNavigationProp<RootStackParamList, 'Tabs'> | undefined;
  item: MediaItemWithOwner;
  onView: (item: MediaItemWithOwner) => void;
  onModify?: (item: MediaItemWithOwner) => void;
  onDelete?: (item: MediaItemWithOwner) => void;
};

const MediaListItem = ({
  navigation,
  item,
  onView,
  onModify,
  onDelete,
}: MediaListItemProps) => {
  const {user} = useUserContext();
  const canModifyOrDelete =
    user && (user.username === item.username || user.level_name === 'Admin');

  return (
    <View style={styles.row}>
      <View style={styles.thumbnailCell}>
        <TouchableOpacity
          onPress={() => {
            navigation?.navigate('Single', { item });
          }}
          activeOpacity={0.7}
          accessibilityLabel={`View ${item.title}`}
        >
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
            accessibilityLabel={item.title}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.textMuted} numberOfLines={2}>
          {item.description ?? '—'}
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.textMuted}>
          {new Date(item.created_at).toLocaleString('fi-FI')}
        </Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.textMuted}>{item.filesize}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.textMuted}>{item.media_type}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.textMuted}>{item.username}</Text>
      </View>
      <View style={styles.actionsCell}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onView(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
          {canModifyOrDelete && (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onModify?.(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Modify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onDelete?.(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    alignItems: 'center',
    backgroundColor: '#1f2937',
  },
  thumbnailCell: {
    width: 80,
    marginRight: 8,
  },
  thumbnail: {
    width: 80,
    height: 60,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#374151',
  },
  cell: {
    flex: 1,
    minWidth: 60,
    marginRight: 8,
    justifyContent: 'center',
  },
  text: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  textMuted: {
    color: '#9ca3af',
    fontSize: 13,
  },
  actionsCell: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minWidth: 120,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default MediaListItem;
