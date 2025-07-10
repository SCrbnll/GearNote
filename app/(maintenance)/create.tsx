import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import AlertModal from "@/components/AlertModal";
import DropdownModal from "@/components/DropdownModal";
import { VEHICLES } from "@/constants/vehicles";

type Maintenance = {
  vehicle_id: string;
  title: string;
  description: string;
  date: string;
};

export default function CreateMaintenanceScreen() {
  const router = useRouter();

  const [maintenanceData, setMaintenanceData] = useState<Maintenance>({
    vehicle_id: "",
    title: "",
    description: "",
    date: "",
  });

  const [showVehicleModal, setShowVehicleModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const selectedVehicle = VEHICLES.find((v) => v.id === maintenanceData.vehicle_id);

  const handleSave = () => {
    const requiredFields: (keyof Maintenance)[] = ["title", "date", "vehicle_id"];
    const missing = requiredFields.filter((field) => !maintenanceData[field]?.trim());

    if (missing.length > 0) {
      setModalMessage(`Faltan campos obligatorios: ${missing.join(", ")}`);
      setModalVisible(true);
      return;
    }

    console.log("Mantenimiento creado:", maintenanceData);
    router.back();
  };

    const updateField = (field: keyof Maintenance, value: string) => {
    setMaintenanceData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nuevo mantenimiento",
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

          <Text className="text-primary font-bold text-lg mb-2">Vehículo *</Text>
          <TouchableOpacity
            onPress={() => setShowVehicleModal(true)}
            className="bg-ui-header rounded-xl p-4 mb-6 flex-row items-center justify-between"
          >
            {selectedVehicle ? (
              <View className="flex-row items-center space-x-3">
                <MaterialCommunityIcons name="car" size={24} color="#FE9525" />
                <View className="ml-4">
                  <Text className="text-white font-semibold">{selectedVehicle.name}</Text>
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
            <Text className="text-primary font-semibold mb-1">Título *</Text>
            <TextInput
              className="bg-ui-header rounded-xl px-4 py-3 text-white"
              value={maintenanceData.title}
              onChangeText={(text) => setMaintenanceData((prev) => ({ ...prev, title: text }))}
              placeholder="Ej: Cambio de frenos"
              placeholderTextColor="#ccc"
            />
          </View>

          <View className="mb-4">
            <Text className="text-primary font-semibold mb-1">Fecha *</Text>
            <TextInput
              className="bg-ui-header rounded-xl px-4 py-3 text-white"
              value={maintenanceData.date}
              onChangeText={(text) => updateField("date", text)}
              placeholder="DD-MM-YYYY"
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />
          </View>

          <View className="mb-6">
            <Text className="text-primary font-semibold mb-1">Descripción</Text>
            <TextInput
              value={maintenanceData.description}
              onChangeText={(text) =>
                setMaintenanceData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Escribe una descripción detallada..."
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
            <Text className="text-white font-bold text-base">Crear mantenimiento</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <DropdownModal
        visible={showVehicleModal}
        selectedValue={maintenanceData.vehicle_id}
        onSelect={(value) => {
          setMaintenanceData((prev) => ({ ...prev, vehicle_id: value }));
          setShowVehicleModal(false);
        }}
        onCancel={() => setShowVehicleModal(false)}
        options={VEHICLES.map((v) => ({
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
