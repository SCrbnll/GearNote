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

import DynamicInputField from "@/components/DinamicInputField";
import AlertModal from "@/components/Modals/AlertModal";
import { Vehicle } from "@/types/type-db";
import { insertVehicle } from "@/utils/database";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function EditVehicleScreen() {
  const router = useRouter();

  const [vehicleData, setVehicleData] = useState<Vehicle>({
    name: "",
    brand: "",
    model: "",
    year: 0,
    color: "",
    km_total: 0,
    engine: "",
    plate: "",
    technical_sheet: "",
    additional_info: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const updateField = (field: keyof Vehicle, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]:
        field === "year" || field === "km_total" || field === "image_uri" ? Number(value) || 0 : value,
    }));
  };

  const handleSave = async () => {
    const requiredFields: (keyof Vehicle)[] = [
      "name",
      "brand",
      "model",
      "year",
      "km_total",
      "engine",
      "plate",
    ];

    const missing = requiredFields.filter(
      (field) =>
        vehicleData[field] === "" ||
        vehicleData[field] === 0 ||
        vehicleData[field] === null
    );

    if (missing.length > 0) {
      setModalMessage(`Faltan campos obligatorios: ${missing.join(", ")}`);
      setModalVisible(true);
      return;
    }

    try {
      await insertVehicle(vehicleData);
      router.back();
    } catch (err) {
      console.error("Error al guardar vehículo:", err);
      setModalMessage("Ocurrió un error al guardar el vehículo.");
      setModalVisible(true);
    }
  };

  const fields: {
    label: string;
    field: keyof Vehicle;
    placeholder?: string;
    icon?: React.ReactNode;
    keyboardType?: "default" | "numeric" | "url";
  }[] = [
    {
      label: "Nombre (Mote) *",
      field: "name",
      placeholder: "Ej: Mi coche",
      icon: <FontAwesome5 name="id-badge" solid size={18} color="#FE9525" />,
    },
    {
      label: "Marca *",
      field: "brand",
      placeholder: "Ej: Honda",
      icon: <MaterialCommunityIcons name="tools" size={18} color="#FE9525" />,
    },
    {
      label: "Modelo *",
      field: "model",
      placeholder: "Ej: Civic",
      icon: <FontAwesome5 name="car" solid size={18} color="#FE9525" />,
    },
    {
      label: "Año *",
      field: "year",
      keyboardType: "numeric",
      icon: <Ionicons name="calendar" solid size={18} color="#FE9525" />,
    },
    {
      label: "Color",
      field: "color",
      placeholder: "Ej: Negro",
      icon: <Ionicons name="color-palette" solid size={18} color="#FE9525" />,
    },
    {
      label: "Kilómetros totales *",
      field: "km_total",
      placeholder: "0",
      icon: <MaterialIcons name="speed" solid size={18} color="#FE9525" />,
      keyboardType: "numeric",
    },
    {
      label: "Motor *",
      field: "engine",
      placeholder: "Ej: 1.6",
      icon: <FontAwesome5 name="oil-can" solid size={18} color="#FE9525" />,
    },
    {
      label: "Matrícula *",
      field: "plate",
      placeholder: "Ej: 1234ABC",
      icon: <FontAwesome5 name="tag" solid size={18} color="#FE9525" />,
    },
    {
      label: "Ficha técnica (URL)",
      field: "technical_sheet",
      placeholder: "Ej: https://example.com/ficha_tecnica.pdf",
      icon: (
        <MaterialIcons name="description" solid size={18} color="#FE9525" />
      ),
      keyboardType: "url",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Nuevo vehículo",
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />

      <KeyboardAvoidingView
        className="flex-1 pt-5 pb-3"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1 px-6 pt-4">
          {fields.map(({ label, field, placeholder, icon, keyboardType }) => (
            <DynamicInputField
              key={field}
              label={label}
              placeholder={placeholder}
              icon={icon}
              keyboardType={keyboardType}
              value={String(vehicleData[field] ?? "")}
              onChange={(text) => updateField(field, text)}
            />
          ))}

          <View className="mb-6">
            <View className="flex-row gap-2">
              <Ionicons name="document-sharp" size={18} color="#FE9525" />
              <Text className="text-primary font-semibold mb-1">
                Información adicional
              </Text>
            </View>
            <TextInput
              className="bg-ui-header rounded-xl px-4 py-3 text-white h-32 text-start"
              multiline
              textAlignVertical="top"
              value={vehicleData.additional_info}
              onChangeText={(text) => updateField("additional_info", text)}
            />
          </View>

          <TouchableOpacity
            className="bg-green-700 rounded-xl py-4 items-center justify-center mb-10 flex-row gap-2"
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text className="text-white font-bold text-base">
              Crear vehículo
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={modalVisible}
        title="Aviso"
        description={modalMessage}
        onCancel={() => setModalVisible(false)}
      />
    </>
  );
}
