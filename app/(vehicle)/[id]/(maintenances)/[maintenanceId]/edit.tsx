import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";

import CustomButton from "@/components/Buttons/CustomButton";
import AppHeader from "@/components/Header/AppHeader";
import FormInput from "@/components/Inputs/FormInput";
import AlertModal from "@/components/Modals/AlertModal";
import DropdownModal from "@/components/Modals/DropdownModal";
import { INPUT_FIELDS_MAINTENANCE } from "@/constants/global";
import { Maintenance, Vehicle } from "@/types/type-db";
import {
    getAllVehicles,
    getMaintenanceById,
    updateMaintenance,
} from "@/utils/database";
import { Ionicons } from "@expo/vector-icons";

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
