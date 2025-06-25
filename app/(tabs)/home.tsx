import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-ui-body p-5">
        <Text className="text-primary text-lg font-bold">Título importante</Text>
        <Text className="text-secondary mt-2">Texto menos destacado</Text>
        <View className="border-b border-separator my-4" />
        <Text className="text-error">Error o alerta</Text>
        <Text className="text-success">Mensaje de éxito</Text>
    </View>

  );
}
