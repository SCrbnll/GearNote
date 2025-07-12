import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AlertModal from "@/components/AlertModal";
import DynamicInputField from "@/components/DinamicInputField";
import DropdownModal from "@/components/DropdownModal";
import { Maintenance, Vehicle } from "@/types/type-db";
import { getAllVehicles, insertMaintenance } from "@/utils/database";

export default function EditMaintenanceScreen() {
  const router = useRouter();
  const [maintenanceData, setMaintenanceData] = useState<Maintenance>({
    vehicle_id: -1,
    title: "",
    description: "",
    date: "",
  });
  const [vehiclesData, setVehiclesData] = useState<Vehicle[]>([]);

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchVehicle = async () => {
        try {
          const vehicles = await getAllVehicles();
          setVehiclesData(vehicles);
        } catch (err) {
          console.error("Error al obtener los vehículos:", err);
        }
      };

      fetchVehicle();
    }, [])
  );

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
      await insertMaintenance(maintenanceData);
      router.back();
    } catch (err) {
      console.error("Error al guardar el mantenimiento:", err);
      setModalMessage("Ocurrió un error al guardar el mantenimiento.");
      setModalVisible(true);
    }
  };

  const selectedVehicle = vehiclesData?.find(
    (v) => v.id === maintenanceData.vehicle_id
  );

  const vehicleOptions = [
    { label: "Seleccionar vehículo", value: 0 },
    ...vehiclesData.map((v) => ({
      label: `${v.name} (${v.brand} ${v.model})`,
      value: v.id!,
    })),
  ];

  const fields: {
    label: string;
    field: keyof Maintenance;
    placeholder?: string;
    icon?: React.ReactNode;
    keyboardType?: "default" | "numeric" | "url";
    multiline?: boolean;
    numberOfLines?: number;
  }[] = [
    {
      label: "Fecha *",
      field: "date",
      placeholder: "YYYY-MM-DD",
      keyboardType: "numeric",
      icon: <Ionicons name="calendar" size={18} color="#FE9525" />,
    },
    {
      label: "Título *",
      field: "title",
      placeholder: "Ej: Cambio de aceite",
      icon: <MaterialCommunityIcons name="tools" size={18} color="#FE9525" />,
    },
    {
      label: "Descripción",
      field: "description",
      placeholder: "Describe el mantenimiento...",
      multiline: true,
      numberOfLines: 6,
      icon: <Ionicons name="document-text" size={18} color="#FE9525" />,
    },
  ];

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
          <View className="flex-row items-center gap-2 mb-1">
            <FontAwesome5 name="car" solid size={18} color="#FE9525" />
            <Text className="text-primary font-bold text-lg">
              Vehículo *
            </Text>
          </View>
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
            {fields.map(
              ({
                label,
                field,
                placeholder,
                icon,
                keyboardType,
                multiline,
                numberOfLines,
              }) => (
                <DynamicInputField
                  key={field}
                  label={label}
                  placeholder={placeholder}
                  icon={icon}
                  value={String(maintenanceData[field] ?? "")}
                  onChange={(text) => updateField(field, text)}
                  keyboardType={keyboardType}
                  multiline={multiline}
                  numberOfLines={numberOfLines}
                />
              )
            )}
          </View>

          <TouchableOpacity
            className="bg-green-700 rounded-xl py-4 items-center justify-center mb-10 flex-row gap-2"
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text className="text-white font-bold text-base">
              Crear matenimiento
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
        options={vehicleOptions}
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
