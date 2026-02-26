import {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text as RNText,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Text, Card, Button, Input} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {TabParamList} from '../../navigators/Navigator';
import {useFile, useMedia} from '../../hooks/apiHooks';
import {useUpdateContext} from '../../hooks/ContextHooks';

type Props = BottomTabScreenProps<TabParamList, 'Upload'>;

type FormValues = {
  title: string;
  description: string;
};

const Upload = ({navigation}: Props) => {
  const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(
    null,
  );

  const {postExpoFile, uploadLoading} = useFile();
  const {postMedia} = useMedia();
  const {setUpdate} = useUpdateContext();

  const initValues: FormValues = {title: '', description: ''};

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm<FormValues>({
    defaultValues: initValues,
    mode: 'onChange',
  });

  const resetForm = () => {
    setImage(null);
    reset(initValues);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetForm();
    });
    return unsubscribe;
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      quality: 0.6,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result);
    }
  };

  const doUpload = async (inputs: FormValues) => {
    if (!image) {
      Alert.alert('Error', 'Please select an image or video first.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'You must be logged in to upload.');
      return;
    }

    try {
      const imageUri = image.assets[0].uri;
      const fileResult = await postExpoFile(imageUri, token);

      if (!fileResult) {
        Alert.alert('Error', 'Upload failed. No response from server.');
        return;
      }

      await postMedia(fileResult, inputs, token);
      setUpdate((update) => !update);
      resetForm();
      Alert.alert('Success', 'File uploaded successfully.');
      navigation.navigate('Home');
    } catch (err) {
      console.error('Upload error:', err);
      const message = err instanceof Error ? err.message : 'Upload failed.';
      Alert.alert('Error', message);
    }
  };

  const canSubmit = isValid && !!image && !uploadLoading;

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 16, paddingBottom: 32}}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <Card.Title>Upload media</Card.Title>
        <Card.Divider />

        <TouchableOpacity onPress={pickImage} activeOpacity={0.9}>
          {image?.assets[0].uri ? (
            <Image
              source={{uri: image.assets[0].uri}}
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                backgroundColor: '#374151',
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: 200,
                borderRadius: 8,
                backgroundColor: '#374151',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <RNText style={{color: '#9ca3af', fontSize: 16}}>
                Tap to select image
              </RNText>
            </View>
          )}
        </TouchableOpacity>

        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'Title is required'},
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Title"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.title?.message}
              containerStyle={{marginTop: 16}}
            />
          )}
          name="title"
        />

        <Controller
          control={control}
          rules={{
            validate: (value) =>
              !value ||
              value.length >= 5 ||
              'Description must be at least 5 characters',
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              placeholder="Description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.description?.message}
              multiline
            />
          )}
          name="description"
        />

        {uploadLoading && (
          <View style={{marginVertical: 16, alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#6366f1" />
            <RNText style={{marginTop: 8, color: '#9ca3af'}}>
              Uploading...
            </RNText>
          </View>
        )}

        <Button
          title="Upload"
          onPress={handleSubmit(doUpload, (err) => {
            console.log('Validation errors:', err);
            if (Object.keys(err).length > 0) {
              console.log(
                'Validation',
                Object.values(err)
                  .map((e) => e?.message)
                  .filter(Boolean)
                  .join('\n') || 'Please fill the form correctly.',
              );
            }
          })}
          disabled={!canSubmit}
          loading={uploadLoading}
          containerStyle={{marginTop: 8}}
        />

        <Button
          title="Reset"
          type="outline"
          onPress={resetForm}
          disabled={uploadLoading}
          containerStyle={{marginTop: 8}}
        />
      </Card>
    </ScrollView>
  );
};

export default Upload;
