import ConfirmationModal from "@/components/ConfirmationModal";
import HistoryItem from "@/components/HistoryItem";
import VehicleInfoCard from "@/components/VehicleInfoCard";
import { HISTORY } from "@/constants/history";
import { VEHICLES } from "@/constants/vehicles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";

export default function VehicleInfoScreen() {
  const { id } = useLocalSearchParams();
  const vehicle = VEHICLES.find((v) => v.id === id);

  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "redirect" | null>(
    null
  );

  if (!vehicle) {
    return (
      <View className="flex-1 bg-ui-body justify-center items-center">
        <Text className="text-white">Vehículo no encontrado</Text>
      </View>
    );
  }

  const handleRedirect = () => {
    setModalType("redirect");
    setShowConfirm(true);
  };

  const handleDelete = () => {
    setModalType("delete");
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (modalType === "redirect") {
      Linking.openURL(vehicle.technical_sheet);
    } else if (modalType === "delete") {
      console.log("Vehículo eliminado");
    }

    setShowConfirm(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: vehicle.name,
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />

      <View className="flex-1 bg-ui-body px-6 py-5 space-y-6">
        <View>
          <Text className="text-primary text-2xl font-bold">
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text className="text-error text-sm mt-1">Año {vehicle.year}</Text>
        </View>

        <VehicleInfoCard vehicle={vehicle} />

        <TouchableOpacity
          className="flex-row items-center justify-between bg-ui-header rounded-xl px-4 py-3 mb-3"
          onPress={handleRedirect}
        >
          <View className="flex-row items-center space-x-3">
            <MaterialIcons name="document-scanner" size={20} color="#FE9525" />
            <Text className="text-success font-medium ml-2">
              Visualizar ficha técnica
            </Text>
          </View>
          <Ionicons name="link-outline" size={20} color="#FE9525" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-error text-base mb-2">
            Últimos mantenimientos
          </Text>

          <FlatList
            data={HISTORY.filter((item) => item.vehicle_id === vehicle.id)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HistoryItem item={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View className="flex-row justify-between mt-6 space-x-3 gap-6">
          <TouchableOpacity
            className="flex-1 flex-row bg-ui-header rounded-xl py-3 items-center justify-center"
            onPress={() => console.log("Editar vehículo")}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color="#FE9525"
              style={{ marginRight: 10 }}
            />
            <Text className="text-primary font-medium">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row bg-red-700 rounded-xl py-3 items-center justify-center"
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#FE9525"
              style={{ marginRight: 10 }}
            />
            <Text className="text-white font-medium">Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmationModal
        visible={showConfirm}
        title={
          modalType === "redirect"
            ? "¿Desea abrir la ficha técnica?\nSerá redirijido a una URL externa."
            : "¿Desea eliminar este vehículo?"
        }
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
