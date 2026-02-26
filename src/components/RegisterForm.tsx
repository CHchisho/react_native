import { useForm, Controller } from 'react-hook-form';
import { Card, Input, Button } from '@rneui/themed';
import { useUser } from '../../hooks/apiHooks';
import type { RegisterCredentials } from '../../types/LocalTypes';

type RegisterFormValues = RegisterCredentials & { confirmPassword: string };

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const MIN_PASSWORD_LENGTH = 5;

const RegisterForm = () => {
  const { postRegister, getUsernameAvailable, getEmailAvailable } = useUser();
  const initValues: RegisterFormValues = {
    username: '',
    password: '',
    email: '',
    confirmPassword: '',
  };
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: initValues,
    mode: 'onBlur',
  });

  const doRegister = async (inputs: RegisterFormValues) => {
    const { confirmPassword: _, ...apiData } = inputs;
    try {
      await postRegister(apiData as RegisterCredentials);
      console.log('Registration successful');
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'is required' },
          validate: async (value) => {
            try {
              const { available } = await getUsernameAvailable(value);
              return available ? true : 'Username taken';
            } catch (error) {
              console.log((error as Error).message);
              return 'Username check failed';
            }
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'is required' },
          pattern: {
            value: EMAIL_REGEX,
            message: 'not a valid email',
          },
          validate: async (value) => {
            try {
              const { available } = await getEmailAvailable(value);
              return available ? true : 'Email already in use';
            } catch (error) {
              console.log((error as Error).message);
              return 'Email check failed';
            }
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
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
        name="email"
      />

      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'is required' },
          minLength: {
            value: MIN_PASSWORD_LENGTH,
            message: `min ${MIN_PASSWORD_LENGTH} characters`,
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
          />
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: { value: true, message: 'is required' },
          validate: (value) =>
            value === getValues('password') ? true : 'Passwords must match',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Confirm password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.confirmPassword?.message}
          />
        )}
        name="confirmPassword"
      />
      <Button title="Register" onPress={handleSubmit(doRegister)} />
    </Card>
  );
};

export default RegisterForm;
