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
import { MAINTENANCE_HISTORY } from "@/constants/maintenance_history";

type Maintenance = {
  id?: string;
  vehicle_id: string;
  title: string;
  description: string;
  date: string;
};

export default function EditMaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [maintenanceData, setMaintenanceData] = useState<Maintenance>({
    vehicle_id: "",
    title: "",
    description: "",
    date: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (id) {
      const maintenance = MAINTENANCE_HISTORY.find((m) => m.id === String(id));
      if (maintenance) {
        setMaintenanceData(maintenance);
      } else {
        setModalMessage("Mantenimiento no encontrado.");
        setModalVisible(true);
      }
    }
  }, [id]);

  const updateField = (field: keyof Maintenance, value: string) => {
    setMaintenanceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const requiredFields: (keyof Maintenance)[] = ["title", "date"];

    const missing = requiredFields.filter(
      (field) => !maintenanceData[field]?.trim()
    );

    if (missing.length > 0) {
      setModalMessage(
        `Faltan campos obligatorios: ${missing.join(", ")}`
      );
      setModalVisible(true);
      return;
    }

    console.log("Mantenimiento actualizado:", maintenanceData);
    router.back();
  };

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

      <AlertModal
        visible={modalVisible}
        title="Error"
        description={modalMessage}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
}
