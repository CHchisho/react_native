import React from 'react';
import { Image } from 'react-native';
import { ListItem, Button, Icon } from '@rneui/themed';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MediaItemWithOwner } from '../../types/DBTypes';
import type { RootStackParamList } from '../../navigators/Navigator';
import { useUserContext } from '../../hooks/ContextHooks';

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
  const { user } = useUserContext();
  const canModifyOrDelete =
    user && (user.username === item.username || user.level_name === 'Admin');

  return (
    <ListItem
      onPress={() => navigation?.navigate('Single', { item })}
      bottomDivider
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={{ width: 80, height: 60, borderRadius: 4 }}
        resizeMode="cover"
        accessibilityLabel={item.title}
      />
      <ListItem.Content>
        <ListItem.Title numberOfLines={2}>{item.title}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={2}>
          {item.description ?? '—'}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          {new Date(item.created_at).toLocaleString('fi-FI')} · {item.username}
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Content right>
        <Button
          type="clear"
          size="sm"
          icon={<Icon type="material" iconProps={{ name: 'visibility', size: 18 }} />}
          onPress={() => onView(item)}
          accessibilityLabel={`View ${item.title}`}
        />
        {canModifyOrDelete && (
          <>
            <Button
              type="clear"
              size="sm"
              icon={<Icon type="material" iconProps={{ name: 'edit', size: 18 }} />}
              onPress={() => onModify?.(item)}
            />
            <Button
              type="clear"
              size="sm"
              icon={<Icon type="material" iconProps={{ name: 'delete', size: 18 }} />}
              onPress={() => onDelete?.(item)}
            />
          </>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default MediaListItem;
