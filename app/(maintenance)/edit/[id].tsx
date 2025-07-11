import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AlertModal from "@/components/AlertModal";
import DropdownModal from "@/components/DropdownModal";
import { Maintenance, Vehicle } from "@/types/type-db";
import {
  getAllVehicles,
  getMaintenanceById,
  updateMaintenance,
} from "@/utils/database";

export default function EditMaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [maintenanceData, setMaintenanceData] = useState<Maintenance>({
    vehicle_id: 0,
    title: "",
    description: "",
    date: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleList = await getAllVehicles();
        setVehicles(vehicleList);

        if (id) {
          const maintenance = await getMaintenanceById(Number(id));
          if (maintenance) {
            setMaintenanceData(maintenance);
          } else {
            setModalMessage("Mantenimiento no encontrado.");
            setModalVisible(true);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setModalMessage("Error al cargar datos desde la base de datos.");
        setModalVisible(true);
      }
    };

    fetchData();
  }, [id]);

  const updateField = (field: keyof Maintenance, value: any) => {
    setMaintenanceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const requiredFields: (keyof Maintenance)[] = [
      "title",
      "date",
      "vehicle_id",
    ];
    const missing = requiredFields.filter((field) => !maintenanceData[field]);

    if (missing.length > 0) {
      setModalMessage(`Faltan campos obligatorios: ${missing.join(", ")}`);
      setModalVisible(true);
      return;
    }

    try {
      await updateMaintenance(maintenanceData);
      router.back();
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      setModalMessage("Error al actualizar el vehículo.");
      setModalVisible(true);
    }
  };

  const selectedVehicle = vehicles.find(
    (v) => v.id === maintenanceData.vehicle_id
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: id ? "Editar mantenimiento" : "Nuevo mantenimiento",
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1 px-6 pt-4">
          <Text className="text-primary font-bold text-lg mb-2">
            Vehículo *
          </Text>
          <TouchableOpacity
            onPress={() => setShowVehicleModal(true)}
            className="bg-ui-header rounded-xl p-4 mb-6 flex-row items-center justify-between"
          >
            {selectedVehicle ? (
              <View className="flex-row items-center space-x-3">
                <MaterialCommunityIcons name="car" size={24} color="#FE9525" />
                <View className="ml-4">
                  <Text className="text-white font-semibold">
                    {selectedVehicle.name}
                  </Text>
                  <Text className="text-secondary text-sm">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="text-secondary">Selecciona un vehículo</Text>
            )}
            <Ionicons name="chevron-down" size={20} color="#FE9525" />
          </TouchableOpacity>

          <View className="mb-4">
            <Text className="text-primary font-semibold mb-1">Fecha *</Text>
            <TextInput
              className="bg-ui-header rounded-xl px-4 py-3 text-white"
              value={maintenanceData.date}
              onChangeText={(text) => updateField("date", text)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-4">
            <Text className="text-primary font-semibold mb-1">Título *</Text>
            <TextInput
              className="bg-ui-header rounded-xl px-4 py-3 text-white"
              value={maintenanceData.title}
              onChangeText={(text) => updateField("title", text)}
              placeholder="Ej: Cambio de aceite"
              placeholderTextColor="#ccc"
            />
          </View>

          <View className="mb-6">
            <Text className="text-primary font-semibold mb-1">Descripción</Text>
            <TextInput
              value={maintenanceData.description}
              onChangeText={(text) => updateField("description", text)}
              placeholder="Escribe una descripción..."
              placeholderTextColor="#ccc"
              multiline
              numberOfLines={6}
              className="bg-ui-header text-white rounded-xl p-3 min-h-[150px] text-left"
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            className="bg-green-700 rounded-xl py-4 items-center mb-10"
            onPress={handleSave}
          >
            <Text className="text-white font-bold text-base">
              {id ? "Guardar cambios" : "Crear mantenimiento"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DropdownModal
        visible={showVehicleModal}
        selectedValue={maintenanceData.vehicle_id}
        onSelect={(value) => {
          updateField("vehicle_id", value);
          setShowVehicleModal(false);
        }}
        onCancel={() => setShowVehicleModal(false)}
        options={vehicles.map((v) => ({
          label: `${v.name} (${v.brand} ${v.model})`,
          value: v.id,
        }))}
      />

      <AlertModal
        visible={modalVisible}
        title="Error"
        description={modalMessage}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
}
