import ConfirmationModal from "@/components/ConfirmationModal";
import { MAINTENANCE_HISTORY } from "@/constants/maintenance_history";
import { VEHICLES } from "@/constants/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const maintenance = MAINTENANCE_HISTORY.find((m) => m.id === id);
  const vechile = VEHICLES.find((v) => v.id === maintenance!.vehicle_id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | null>(null);

  if (!maintenance) {
    return (
      <View className="flex-1 bg-ui-body justify-center items-center px-6">
        <Text className="text-white">Mantenimiento no encontrado</Text>
      </View>
    );
  }

  const handleDelete = () => {
    setModalType("delete");
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (modalType === "delete") {
      console.log("Mantenimiento eliminado");
    }
    setShowConfirm(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Detalle mantenimiento",
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />

      <View className="flex-1 bg-ui-body px-6 pt-5 pb-3">
        <View className="mb-6 gap-2">
          <Text className="text-primary text-xl font-bold mb-2">
            {maintenance.title}
          </Text>

          <Text className="text-white font-medium mb-4">
            Vehículo: <Text className="text-success">{vechile?.name}</Text>
          </Text>

          <Text className="text-white text-base mb-4">
            Descripción: <Text className="text-success">{maintenance.description}</Text>
          </Text>

          <Text className="text-white font-medium">
            Fecha: <Text className="text-success">{maintenance.date}</Text>
          </Text>
        </View>

        <View className="flex-row justify-between mt-auto gap-4">
          <Link
            href={{
              pathname: "/edit/[id]",
              params: { id: maintenance.vehicle_id },
            }}
            asChild
          >
            <TouchableOpacity className="flex-1 flex-row bg-ui-header rounded-xl py-3 items-center justify-center">
              <Ionicons
                name="create-outline"
                size={20}
                color="#FE9525"
                style={{ marginRight: 10 }}
              />
              <Text className="text-primary font-medium">Editar</Text>
            </TouchableOpacity>
          </Link>

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
        title={"¿Desea eliminar este mantenimiento?"}
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
