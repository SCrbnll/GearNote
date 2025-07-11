import ConfirmationModal from "@/components/ConfirmationModal";
import { Maintenance, Vehicle } from "@/types/type-db";
import {
  deleteMaintenanceById,
  getMaintenanceById,
  getVehicleById,
} from "@/utils/database";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Link,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<Vehicle>();
  const [maintenanceData, setMaintenanceData] = useState<Maintenance>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const maintenance = await getMaintenanceById(Number(id));
          setMaintenanceData(maintenance);

          const vehicle = await getVehicleById(maintenance.vehicle_id);
          setVehicleData(vehicle!);
        } catch (err) {
          console.error("Error al obtener los datos:", err);
        }
      };

      fetchData();
    }, [id])
  );

  if (!maintenanceData) {
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

  const confirmAction = async () => {
    if (modalType === "delete") {
      try {
        await deleteMaintenanceById(Number(id));
        router.back();
      } catch (err) {
        console.error("Error al eliminar mantenimiento:", err);
      }
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
        <Text className="text-primary font-bold text-lg mb-2">Vehículo</Text>

        <TouchableOpacity
          className="bg-ui-header rounded-xl p-4 mb-6 flex-row items-center justify-between"
          onPress={() => router.push(`/(vehicle)/${vehicleData?.id}`)}
        >
          <View className="flex-row items-center space-x-3">
            <MaterialCommunityIcons name="car" size={24} color="#FE9525" />
            <View className="ml-4">
              <Text className="text-primary font-semibold">
                {vehicleData?.name}
              </Text>
              <Text className="text-secondary text-sm">
                {vehicleData?.brand} {vehicleData?.model}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FE9525" />
        </TouchableOpacity>

        <Text className="text-primary font-bold text-lg mb-2">Detalles</Text>
        <View className="bg-ui-header rounded-xl p-4 mb-6">
          <Text className="text-success text-lg font-semibold mb-1">
            {maintenanceData.title}
          </Text>
          <Text className="text-white">
            {maintenanceData.description || "Sin descripción."}
          </Text>
        </View>

        <Text className="text-primary font-bold text-lg mb-2">Fecha</Text>
        <View className="bg-ui-header rounded-xl p-4 mb-8">
          <Text className="text-white">{maintenanceData.date}</Text>
        </View>

        <View className="flex-row justify-between gap-4 mt-auto">
          <Link
            href={{
              pathname: "/edit/[id]",
              params: { id: String(maintenanceData.id) },
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
