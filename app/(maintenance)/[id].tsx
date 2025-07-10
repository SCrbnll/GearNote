import ConfirmationModal from "@/components/ConfirmationModal";
import { MAINTENANCE_HISTORY } from "@/constants/maintenance_history";
import { VEHICLES } from "@/constants/vehicles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const maintenance = MAINTENANCE_HISTORY.find((m) => m.id === id);
  const vehicle = VEHICLES.find((v) => v.id === maintenance?.vehicle_id);

  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | null>(null);

  if (!maintenance || !vehicle) {
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
    router.back();
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

        <Text className="text-primary font-bold text-lg mb-2">Vehículo</Text>
        <Link href={{ pathname: "/(vehicle)/[id]", params: { id: vehicle.id } }} asChild>
          <TouchableOpacity className="bg-ui-header rounded-xl p-4 mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <MaterialCommunityIcons name="car" size={24} color="#FE9525" />
              <View className="ml-4">
                <Text className="text-primary font-semibold">{vehicle.name}</Text>
                <Text className="text-secondary text-sm">
                  {vehicle.brand} {vehicle.model}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FE9525" />
          </TouchableOpacity>
        </Link>

        <Text className="text-primary font-bold text-lg mb-2">Detalles</Text>
        <View className="bg-ui-header rounded-xl p-4 mb-6">
          <Text className="text-success font-semibold mb-1">{maintenance.title}</Text>
          <Text className="text-white">{maintenance.description || "Sin descripción."}</Text>
        </View>

        <Text className="text-primary font-bold text-lg mb-2">Fecha</Text>
        <View className="bg-ui-header rounded-xl p-4 mb-8">
          <Text className="text-white">{maintenance.date}</Text>
        </View>

        <View className="flex-row justify-between gap-4 mt-auto">
          <Link
            href={{
              pathname: "/edit/[id]",
              params: { id: maintenance.id },
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
