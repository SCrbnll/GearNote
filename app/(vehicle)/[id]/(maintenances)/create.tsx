import {
    Ionicons
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";

import CustomButton from "@/components/Buttons/CustomButton";
import AppHeader from "@/components/Header/AppHeader";
import FormInput from "@/components/Inputs/FormInput";
import AlertModal from "@/components/Modals/AlertModal";
import { INPUT_FIELDS_MAINTENANCE } from "@/constants/global";
import { Maintenance } from "@/types/type-db";
import { insertMaintenance } from "@/utils/database";

export default function EditMaintenanceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [maintenanceData, setMaintenanceData] = useState<Maintenance>({
    vehicle_id: Number(id),
    title: "",
    description: "",
    date: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");


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

  return (
    <>
      <AppHeader
            type="backOptions" 
            title="Agregar mantenimiento"       
            onBack={() => router.back()}
        />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1 px-6 pt-4">
          {INPUT_FIELDS_MAINTENANCE.map(
            ({ label, field, placeholder, icon, keyboardType, multiline }) => (
                <FormInput
                    key={field}
                    label={label}
                    icon={icon}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    value={String(maintenanceData[field] ?? "")}
                    multiline={multiline}
                    onChangeText={(text) =>
                    updateField(field as keyof Maintenance, text)
                    }
                />
            )
        )}

          <CustomButton
            text="Agregar mantenimiento"
            onPress={handleSave}
            type="success"
            icon={<Ionicons name="add-circle" size={24} color="white" />}
          />
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
