import {useEffect, useState} from 'react';
import type {
  MediaItem,
  MediaItemWithOwner,
  UserWithNoPassword,
  Like,
  Comment,
} from '../types/DBTypes';
import type {
  LoginResponse,
  UserResponse,
  MessageResponse,
  UploadResponse,
  MediaResponse,
  AvailableResponse,
} from '../types/MessageTypes';
import type {Credentials, RegisterCredentials} from '../types/LocalTypes';
import {fetchData} from '../functions';

const useFile = () => {
  const postFile = async (
    file: File,
    token: string,
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      process.env.EXPO_PUBLIC_UPLOAD_API + '/upload',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
        },
        body: formData,
      },
    );

    const json = await response.json();
    if (!response.ok) {
      throw new Error(
        (json as {message?: string}).message || `Error ${response.status}`,
      );
    }
    return json as UploadResponse;
  };

  return {postFile};
};

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  useEffect(() => {
    let ignore = false;

    const getMedia = async () => {
      try {
        const mediaItems = await fetchData<MediaItem[]>(
          process.env.EXPO_PUBLIC_MEDIA_API + '/media',
        );

        const mediaWithOwner = await Promise.all<MediaItemWithOwner>(
          mediaItems.map(async (item) => {
            const user = await fetchData<UserWithNoPassword>(
              process.env.EXPO_PUBLIC_AUTH_API + '/users/' + item.user_id,
            );
            return {...item, username: user.username};
          }),
        );

        if (!ignore) {
          setMediaArray(mediaWithOwner);
        }
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    getMedia();

    return () => {
      ignore = true;
    };
  }, []);

  const postMedia = async (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string,
  ): Promise<MediaResponse> => {
    const mediaData = {
      filename: file.data.filename,
      filesize: file.data.filesize,
      media_type: file.data.media_type,
      title: inputs.title,
      description: inputs.description || null,
    };

    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(mediaData),
    };

    const result = await fetchData<MediaResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/media',
      fetchOptions,
    );
    return result;
  };

  return {mediaArray, postMedia};
};

const useAuthentication = () => {
  const postLogin = async (
    credentials: Credentials,
  ): Promise<LoginResponse> => {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    const loginResult = await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
      fetchOptions,
    );
    return loginResult;
  };

  return {postLogin};
};

const useUser = () => {
  const getUserByToken = async (token: string): Promise<UserResponse> => {
    const fetchOptions: RequestInit = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const userResult = await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
      fetchOptions,
    );
    return userResult;
  };

  const getUsernameAvailable = async (
    username: string,
  ): Promise<{available: boolean; message?: string}> => {
    try {
      const result = await fetchData<AvailableResponse>(
        process.env.EXPO_PUBLIC_AUTH_API +
          '/users/username/' +
          encodeURIComponent(username),
      );
      return {available: result.available ?? false};
    } catch (e) {
      return {available: false, message: (e as Error).message};
    }
  };

  const getEmailAvailable = async (
    email: string,
  ): Promise<{available: boolean; message?: string}> => {
    try {
      const result = await fetchData<AvailableResponse>(
        process.env.EXPO_PUBLIC_AUTH_API +
          '/users/email/' +
          encodeURIComponent(email),
      );
      return {available: result.available ?? false};
    } catch (e) {
      return {available: false, message: (e as Error).message};
    }
  };

  const postRegister = async (
    credentials: RegisterCredentials,
  ): Promise<MessageResponse> => {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    };
    const registerResult = await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      fetchOptions,
    );
    return registerResult;
  };

  const putUser = async (
    token: string,
    data: {username?: string; email?: string; password?: string},
  ): Promise<UserResponse> => {
    const fetchOptions: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    };
    return fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users',
      fetchOptions,
    );
  };

  return {
    getUserByToken,
    getUsernameAvailable,
    getEmailAvailable,
    postRegister,
    putUser,
  };
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    await fetchData<{message: string; like_id?: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({media_id}),
      },
    );
  };

  const deleteLike = async (like_id: number, token: string) => {
    await fetchData<{message: string}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/' + like_id,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );
  };

  const getCountByMediaId = async (media_id: number) => {
    const result = await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/count/' + media_id,
    );
    return result.count;
  };

  const getUserLike = async (
    media_id: number,
    token: string,
  ): Promise<Like | null> => {
    try {
      const like = await fetchData<Like>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/likes/bymedia/user/' + media_id,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      return like;
    } catch {
      return null;
    }
  };

  return {postLike, deleteLike, getCountByMediaId, getUserLike};
};

type CommentWithUsername = Partial<Comment & {username: string}>;

const useComment = () => {
  const postComment = async (
    comment_text: string,
    media_id: number,
    token: string,
  ) => {
    await fetchData<{message: string; comment_id?: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({comment_text, media_id}),
      },
    );
  };

  const getCommentsByMediaId = async (
    media_id: number,
  ): Promise<CommentWithUsername[]> => {
    const comments = await fetchData<Comment[]>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments/bymedia/' + media_id,
    );
    const commentsWithUsername = await Promise.all<CommentWithUsername>(
      comments.map(async (comment) => {
        const user = await fetchData<UserWithNoPassword>(
          process.env.EXPO_PUBLIC_AUTH_API + '/users/' + comment.user_id,
        );
        return {...comment, username: user.username};
      }),
    );
    return commentsWithUsername;
  };

  return {postComment, getCommentsByMediaId};
};

export {useMedia, useFile, useAuthentication, useUser, useLike, useComment};
