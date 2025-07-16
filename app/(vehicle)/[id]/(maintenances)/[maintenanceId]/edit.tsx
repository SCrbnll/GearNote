import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import CustomButton from "@/components/Buttons/CustomButton";
import AppHeader from "@/components/Header/AppHeader";
import FormInput from "@/components/Inputs/FormInput";
import AlertModal from "@/components/Modals/AlertModal";
import DropdownModal from "@/components/Modals/DropdownModal";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";

import { INPUT_FIELDS_MAINTENANCE } from "@/constants/global";
import { Maintenance, Vehicle } from "@/types/type-db";
import {
  getAllVehicles,
  getMaintenanceById,
  updateMaintenance,
} from "@/utils/database";
import { valueObjectMap } from "@/utils/valueObjects/maintenance";

export default function EditMaintenanceScreen() {
  const { id, maintenanceId } = useLocalSearchParams();
  const router = useRouter();

  const [maintenanceData, setMaintenanceData] = useState<Maintenance>({
    vehicle_id: Number(id),
    title: "",
    description: "",
    date: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Maintenance, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vehicleList = await getAllVehicles();
        setVehicles(vehicleList);

        if (maintenanceId) {
          const maintenance = await getMaintenanceById(Number(maintenanceId));
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
    const requiredFields: (keyof Maintenance)[] = ["title", "date", "vehicle_id"];
    const newErrors: typeof errors = {};
    const finalData: Partial<Maintenance> = { id: Number(maintenanceId) };

    for (const field of requiredFields) {
      try {
        const rawValue = maintenanceData[field];
        const parser = valueObjectMap[field];
        if (parser) {
          finalData[field] = parser(rawValue);
        }
      } catch (err: any) {
        newErrors[field] = err.message || "Valor inválido";
      }
    }

    if (maintenanceData.description) {
      try {
        const parser = valueObjectMap.description;
        if (parser) {
          finalData.description = parser(maintenanceData.description);
        }
      } catch (err: any) {
        newErrors.description = err.message || "Valor inválido";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalMessage("Corrige los errores antes de guardar.");
      setModalVisible(true);
      return;
    }

    try {
      await updateMaintenance(finalData as Maintenance);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
      setModalMessage("Error al actualizar el mantenimiento.");
      setModalVisible(true);
    }
  };

  const selectedVehicle = vehicles.find(
    (v) => v.id === maintenanceData.vehicle_id
  );

  return (
    <>
      <AppHeader
        type="backOptions"
        title="Editar mantenimiento"
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
            text="Guardar cambios"
            onPress={handleSave}
            type="success"
            icon={<Ionicons name="save" size={24} color="white" />}
          />

          <View className="h-16" />
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
        title="Aviso"
        description={modalMessage}
        onCancel={() => setModalVisible(false)}
      />

      {showSuccess && (
        <SuccessOverlay
          onFinish={() => router.back()}
          loadingText="Guardando cambios..."
          successText="Mantenimiento actualizado"
          successIcon={
            <Ionicons name="checkmark-circle" size={90} color="#4CAF50" />
          }
          duration={3000}
        />
      )}
    </>
  );
}
