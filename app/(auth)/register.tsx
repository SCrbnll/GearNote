import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function RegisterScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-4">Crear Cuenta</Text>
      <Button title="Ir a Login" onPress={() => router.push('/(auth)/login')} />
      <Button title="Entrar a Home" onPress={() => router.replace('/(tabs)/home')} />
    </View>
  );
}
