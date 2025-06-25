import { VEHICLES } from "@/constants/vehicles";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function VehicleInfoScreen() {
  const { id } = useLocalSearchParams();
  const vehicle = VEHICLES.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <View className="flex-1 bg-ui-body justify-center items-center">
        <Text className="text-white">Vehículo no encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: vehicle.name,
          headerShown: true,
          headerStyle: { 
            backgroundColor: "#1A3A66",
          },
          headerTintColor: "#FE9525",
        }}
      />

      <View className="flex-1 bg-ui-body p-5">
        <Text className="text-primary text-2xl font-bold mb-2">
          {vehicle.name}
        </Text>
        <Text className="text-secondary text-lg">
          Matrícula: {vehicle.plate}
        </Text>
      </View>
    </>
  );
}
