import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import CustomButton from "@/components/Buttons/CustomButton";
import AppHeader from "@/components/Header/AppHeader";
import FormInput from "@/components/Inputs/FormInput";
import AlertModal from "@/components/Modals/AlertModal";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";
import { INPUT_FIELDS_MAINTENANCE } from "@/constants/global";
import { Maintenance } from "@/types/type-db";
import { insertMaintenance } from "@/utils/database";
import { valueObjectMap } from "@/utils/valueObjects/maintenance";

export default function CreateMaintenanceScreen() {
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
  const [errors, setErrors] = useState<
    Partial<Record<keyof Maintenance, string>>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (field: keyof Maintenance, value: string) => {
    setMaintenanceData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSave = async () => {
    const requiredFields: (keyof Maintenance)[] = [
      "title",
      "date",
      "vehicle_id",
    ];

    const newErrors: typeof errors = {};
    const finalData: Partial<Maintenance> = {};

    for (const field of requiredFields) {
      try {
        const rawValue = maintenanceData[field];

        const parser = valueObjectMap[field];
        if (parser) {
          const parsed = parser(rawValue);
          finalData[field] = parsed;
        }
      } catch (error: any) {
        newErrors[field] = error.message || "Valor inválido";
      }
    }

    if (maintenanceData.description) {
      try {
        const parser = valueObjectMap.description;
        if (parser) {
          finalData.description = parser(maintenanceData.description);
        }
      } catch (error: any) {
        newErrors.description = error.message || "Valor inválido";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalMessage("Corrige los errores antes de guardar.");
      setModalVisible(true);
      return;
    }

    try {
      await insertMaintenance(finalData as Maintenance);
      setShowSuccess(true);
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
                error={errors[field]}
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

          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={modalVisible}
        title="Aviso"
        description={modalMessage}
        onCancel={() => setModalVisible(false)}
      />

      {showSuccess && (
        <SuccessOverlay
          onFinish={() => router.back()}
          loadingText="Añadiendo mantenimiento..."
          successText="Mantenimiento añadido con éxito"
          successIcon={
            <Ionicons name="checkmark-circle" size={90} color="#4CAF50" />
          }
          duration={3000}
        />
      )}
    </>
  );
}
