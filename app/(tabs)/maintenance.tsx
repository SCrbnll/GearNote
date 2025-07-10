import DropdownModal from "@/components/DropdownModal";
import HistoryItem from "@/components/HistoryItem";
import { MAINTENANCE_HISTORY } from "@/constants/maintenance_history";
import { VEHICLES } from "@/constants/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function MaintenanceScreen() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);

  const vehicleOptions = [
    { label: "Todos los vehículos", value: "" },
    ...VEHICLES.map((v) => ({
      label: `${v.name} (${v.plate})`,
      value: v.id,
    })),
  ];

  const filteredHistory = selectedVehicleId
    ? MAINTENANCE_HISTORY.filter((m) => m.vehicle_id === selectedVehicleId)
    : MAINTENANCE_HISTORY;

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
            {vehicleOptions.find((v) => v.value === selectedVehicleId)?.label ||
              "Seleccionar vehículo"}
          </Text>
          <Ionicons name="chevron-down-outline" size={20} color="#FE9525" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <HistoryItem
              item={item}
              description={VEHICLES.find((v) => v.id === item.vehicle_id)?.name}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="mt-10 items-center">
            <Ionicons name="car-outline" size={40} color="#FE9525" />
            <Text className="text-primary text-sm mt-2 text-center">
              No hay mantenimientos registrados
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <DropdownModal
        visible={modalVisible}
        selectedValue={selectedVehicleId}
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
