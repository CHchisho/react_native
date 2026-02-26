import {ScrollView, Alert} from 'react-native';
import {Card, Button, Input} from '@rneui/themed';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../navigators/Navigator';
import {useMedia} from '../../hooks/apiHooks';
import {useUpdateContext} from '../../hooks/ContextHooks';

type Props = NativeStackScreenProps<RootStackParamList, 'Modify'>;

type FormValues = {
  title: string;
  description: string;
};

const Modify = ({route, navigation}: Props) => {
  const {item} = route.params;
  const {putMedia} = useMedia();
  const {setUpdate} = useUpdateContext();

  const initValues: FormValues = {
    title: item.title,
    description: item.description ?? '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors, isValid, isDirty},
  } = useForm<FormValues>({
    defaultValues: initValues,
    mode: 'onChange',
  });

  const doSubmit = async (inputs: FormValues) => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'You must be logged in to modify.');
      return;
    }

    try {
      await putMedia(item.media_id, inputs, token);
      setUpdate((update) => !update);
      Alert.alert('Success', 'Media updated successfully.');
      navigation.goBack();
    } catch (err) {
      console.error('Modify error:', err);
      const message = err instanceof Error ? err.message : 'Update failed.';
      Alert.alert('Error', message);
    }
  };

  const canSubmit = isValid && isDirty;

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: 16, paddingBottom: 32}}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <Card.Title>Modify media</Card.Title>
        <Card.Divider />

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

        <Button
          title="Save"
          onPress={handleSubmit(doSubmit, (err) => {
            if (Object.keys(err).length > 0) {
              Alert.alert(
                'Validation',
                Object.values(err)
                  .map((e) => e?.message)
                  .filter(Boolean)
                  .join('\n') || 'Please fill the form correctly.',
              );
            }
          })}
          disabled={!canSubmit}
          containerStyle={{marginTop: 8}}
        />

        <Button
          title="Cancel"
          type="outline"
          onPress={() => navigation.goBack()}
          containerStyle={{marginTop: 8}}
        />
      </Card>
    </ScrollView>
  );
};

export default Modify;
