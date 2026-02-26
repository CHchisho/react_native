import {useReducer, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Button} from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import type {MediaItemWithOwner, Like} from '../../types/DBTypes';
import {useLike} from '../../hooks/apiHooks';
import {useUserContext} from '../../hooks/ContextHooks';

const TOKEN_KEY = 'token';

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction =
  | {type: 'setLikeCount'; count: number}
  | {type: 'like'; like: Like | null};

function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case 'setLikeCount':
      return {...state, count: action.count};
    case 'like':
      return {...state, userLike: action.like};
    default:
      return state;
  }
}

type LikesProps = {
  item: MediaItemWithOwner | null;
};

const Likes = ({item}: LikesProps) => {
  const {user} = useUserContext();
  const [state, dispatch] = useReducer(likeReducer, {count: 0, userLike: null});
  const {postLike, deleteLike, getCountByMediaId, getUserLike} = useLike();

  const loadLikes = async () => {
    if (!item) return;
    try {
      const count = await getCountByMediaId(item.media_id);
      dispatch({type: 'setLikeCount', count});
    } catch {
      dispatch({type: 'setLikeCount', count: 0});
    }
  };

  const loadUserLike = async () => {
    if (!item) return;
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!token) {
        dispatch({type: 'like', like: null});
        return;
      }
      const userLike = await getUserLike(item.media_id, token);
      dispatch({type: 'like', like: userLike});
    } catch {
      dispatch({type: 'like', like: null});
    }
  };

  useEffect(() => {
    loadLikes();
    loadUserLike();
  }, [item?.media_id]);

  const handleLike = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!item || !token) return;
      if (state.userLike) {
        await deleteLike(state.userLike.like_id, token);
      } else {
        await postLike(item.media_id, token);
      }
      await loadUserLike();
      await loadLikes();
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  if (!item) return null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 12,
      }}
    >
      <Text style={{color: '#9ca3af'}}>Likes: {state.count}</Text>
      {user && (
        <Button
          type="clear"
          title={state.userLike ? 'Unlike' : 'Like'}
          onPress={handleLike}
          titleStyle={{fontSize: 14}}
        />
      )}
    </View>
  );
};

export default Likes;
