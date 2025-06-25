import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-4">Iniciar Sesión</Text>
      <Button title="Ir a Registro" onPress={() => router.push('/(auth)/register')} />
      <Button title="Entrar a Home" onPress={() => router.replace('/(tabs)/home')} />
    </View>
  );
}
