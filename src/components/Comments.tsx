import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Text, Input, Button} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useComment} from '../../hooks/apiHooks';
import {useUserContext} from '../../hooks/ContextHooks';

type CommentWithUsername = {
  comment_id: number;
  media_id: number;
  user_id: number;
  comment_text: string;
  created_at: Date | string;
  username?: string;
};

type CommentsProps = {
  mediaId: number;
};

const Comments = ({mediaId}: CommentsProps) => {
  const {user} = useUserContext();
  const {postComment, getCommentsByMediaId} = useComment();
  const [comments, setComments] = useState<CommentWithUsername[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const list = await getCommentsByMediaId(mediaId);
      setComments(list as CommentWithUsername[]);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [mediaId]);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      await postComment(commentText.trim(), mediaId, token);
      setCommentText('');
      await fetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{marginTop: 24}}>
      <Text h4 style={{marginBottom: 12}}>
        Comments
      </Text>
      {user && (
        <View style={{marginBottom: 16}}>
          <Input
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            containerStyle={{paddingHorizontal: 0}}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={loading}
            containerStyle={{marginTop: 8}}
          />
        </View>
      )}
      {comments.map((comment) => (
        <View
          key={comment.comment_id}
          style={{
            backgroundColor: '#374151',
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{color: '#e63946', fontWeight: '600'}}>
            {comment.username ?? 'User'}:{' '}
          </Text>
          <Text style={{color: '#e5e7eb'}}>{comment.comment_text}</Text>
          {comment.created_at && (
            <Text style={{fontSize: 12, color: '#9ca3af', marginTop: 4}}>
              {new Date(comment.created_at).toLocaleString()}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
};

export default Comments;
