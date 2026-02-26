import {useForm, Controller} from 'react-hook-form';
import {Card, Input, Button} from '@rneui/themed';
import {useUserContext} from '../../hooks/ContextHooks';
import {useUser} from '../../hooks/apiHooks';

type ProfileUpdateFormValues = {
  username: string;
  email: string;
  password: string;
};

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

type ProfileUpdateFormProps = {
  onSuccess: () => void;
};

const ProfileUpdateForm = ({onSuccess}: ProfileUpdateFormProps) => {
  const {user, handleUpdateProfile} = useUserContext();
  const {getUsernameAvailable, getEmailAvailable} = useUser();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ProfileUpdateFormValues>({
    defaultValues: {
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
    },
    mode: 'onBlur',
  });

  const doUpdate = async (inputs: ProfileUpdateFormValues) => {
    if (!handleUpdateProfile) return;
    const data: {username?: string; email?: string; password?: string} = {};
    if (inputs.username.trim()) data.username = inputs.username.trim();
    if (inputs.email.trim()) data.email = inputs.email.trim();
    if (inputs.password.trim()) data.password = inputs.password;
    try {
      await handleUpdateProfile(data);
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card containerStyle={{marginBottom: 16}}>
      <Card.Title>Update profile</Card.Title>
      <Card.Divider />
      <Controller
        control={control}
        name="username"
        rules={{
          required: {value: true, message: 'is required'},
          validate: async (value) => {
            if (value === user?.username) return true;
            try {
              const {available} = await getUsernameAvailable(value);
              return available ? true : 'Username taken';
            } catch {
              return 'Username check failed';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{
          required: {value: true, message: 'is required'},
          pattern: {value: EMAIL_REGEX, message: 'not a valid email'},
          validate: async (value) => {
            if (value === user?.email) return true;
            try {
              const {available} = await getEmailAvailable(value);
              return available ? true : 'Email already in use';
            } catch {
              return 'Email check failed';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            keyboardType="email-address"
            errorMessage={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{}}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="New password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
      />
      <Button title="Save" onPress={handleSubmit(doUpdate)} />
    </Card>
  );
};

export default ProfileUpdateForm;
