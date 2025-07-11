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
import { Vehicle } from "@/types/type-db";
import { getVehicleById, updateVehicle } from "@/utils/database";

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams();
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

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicle = await getVehicleById(Number(id));
        if (vehicle) {
          setVehicleData(vehicle);
        } else {
          setModalMessage("Vehículo no encontrado.");
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error al cargar vehículo:", error);
        setModalMessage("Error al cargar el vehículo.");
        setModalVisible(true);
      }
    };

    if (id) fetchVehicle();
  }, [id]);

  const updateField = (field: keyof Vehicle, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]:
        field === "year" || field === "km_total" ? Number(value) || 0 : value,
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
      await updateVehicle(vehicleData);
      router.back();
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      setModalMessage("Error al actualizar el vehículo.");
      setModalVisible(true);
    }
  };

  const fields: {
    label: string;
    field: keyof Vehicle;
    keyboardType?: "default" | "numeric" | "url";
  }[] = [
    { label: "Nombre *", field: "name" },
    { label: "Marca *", field: "brand" },
    { label: "Modelo *", field: "model" },
    { label: "Año *", field: "year", keyboardType: "numeric" },
    { label: "Color", field: "color" },
    {
      label: "Kilómetros totales *",
      field: "km_total",
      keyboardType: "numeric",
    },
    { label: "Motor *", field: "engine" },
    { label: "Matrícula *", field: "plate" },
    {
      label: "Ficha técnica (URL)",
      field: "technical_sheet",
      keyboardType: "url",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar vehículo",
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
          {fields.map(({ label, field, keyboardType }) => (
            <View key={field} className="mb-4">
              <Text className="text-primary font-semibold mb-1">{label}</Text>
              <TextInput
                className="bg-ui-header rounded-xl px-4 py-3 text-white"
                keyboardType={keyboardType}
                value={String(vehicleData[field] ?? "")}
                onChangeText={(text) => updateField(field, text)}
              />
            </View>
          ))}

          <View className="mb-6">
            <Text className="text-primary font-semibold mb-1">
              Información adicional
            </Text>
            <TextInput
              className="bg-ui-header rounded-xl px-4 py-3 text-white h-32 text-start"
              multiline
              textAlignVertical="top"
              value={vehicleData.additional_info}
              onChangeText={(text) => updateField("additional_info", text)}
            />
          </View>

          <TouchableOpacity
            className="bg-green-700 rounded-xl py-4 items-center mb-10"
            onPress={handleSave}
          >
            <Text className="text-white font-bold text-base">
              Guardar cambios
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
