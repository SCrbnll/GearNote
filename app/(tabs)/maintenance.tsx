import DropdownModal from "@/components/DropdownModal";
import HistoryItem from "@/components/HistoryItem";
import { Maintenance, Vehicle } from "@/types/type-db";
import { getAllMaintenances, getAllVehicles } from "@/utils/database";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function MaintenanceScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchMaintenances = async () => {
        try {
          const data = await getAllMaintenances();
          setMaintenances(data);
        } catch (err) {
          console.error("Error al obtener mantenimientos:", err);
        }
      };

      const fetchVehicles = async () => {
        try {
          const data = await getAllVehicles();
          setVehicles(data);
        } catch (err) {
          console.error("Error al obtener vehículos:", err);
        }
      };

      fetchMaintenances();
      fetchVehicles();
    }, [])
  );

  const vehicleOptions = [
    { label: "Todos los vehículos", value: 0 },
    ...vehicles.map((v) => ({
      label: `${v.name} (${v.plate})`,
      value: v.id!,
    })),
  ];

  const filteredHistory = selectedVehicleId
    ? maintenances.filter((m) => m.vehicle_id === selectedVehicleId )
    : maintenances;

  return (
    <View className="flex-1 bg-ui-body px-6 pt-6">
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-primary text-lg font-bold">MANTENIMIENTOS</Text>
          <Link href="/(maintenance)/create" asChild>
            <TouchableOpacity className="bg-primary px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="add-circle-outline" size={20} color="black" />
              <Text className="text-black font-semibold mr-2">Crear</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-ui-header py-3 px-4 rounded-xl mb-2 flex-row justify-between items-center"
        >
          <Text className="text-white font-medium">
            {vehicleOptions.find((v) => v.value == selectedVehicleId!)?.label || "Todos los vehículos"}
          </Text>
          <Ionicons name="chevron-down-outline" size={20} color="#FE9525" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <HistoryItem
              item={item}
              description={
                vehicles.find((v) => v.id === item.vehicle_id)?.name || "Sin descripción"
              }
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Ionicons name="clipboard-outline" size={40} color="#FE9525" />
            <Text className="text-primary text-sm mt-2 text-center">
              No hay mantenimientos registrados
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <DropdownModal
        visible={modalVisible}
        selectedValue={selectedVehicleId!}
        options={vehicleOptions}
        onSelect={(value) => {
          setSelectedVehicleId(value);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
}
