import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import CircleIconButton from "@/components/Buttons/CircleIconButton";
import CustomButton from "@/components/Buttons/CustomButton";
import AppHeader from "@/components/Header/AppHeader";
import FormInput from "@/components/Inputs/FormInput";
import TouchableInput from "@/components/Inputs/TouchableInput";
import AlertModal from "@/components/Modals/AlertModal";
import DropdownModal from "@/components/Modals/DropdownModal";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";

import {
  DEFAULT_VEHICLE_IMAGE,
  ECO_LABEL_OPTIONS,
  FUEL_OPTIONS,
  INPUT_FIELDS_VEHICLE,
} from "@/constants/global";
import { Vehicle } from "@/types/type-db";
import { getVehicleById, updateVehicle } from "@/utils/database";
import { valueObjectMap } from "@/utils/valueObjects/vehicle";

export default function EditVehicleScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Vehicle, string>>>(
    {}
  );

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState<
    { label: string; value: string | number }[]
  >([]);
  const [dropdownField, setDropdownField] = useState<keyof Vehicle | null>(
    null
  );
  const [dropdownHeader, setDropdownHeader] = useState("");

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
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVehicle();
  }, [id]);

  const updateField = (field: keyof Vehicle, value: string) => {
    if (!vehicleData) return;

    setVehicleData((prev) => ({
      ...prev!,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setModalMessage("Permiso para acceder a la galería denegado.");
      setModalVisible(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setVehicleData((prev) => ({ ...prev!, image_uri: selectedImageUri }));
    }
  };

  const openDropdown = (field: keyof Vehicle) => {
    if (field === "fuel") {
      setDropdownHeader("Combustible");
      setDropdownOptions(
        FUEL_OPTIONS.map((opt) => ({ label: opt, value: opt }))
      );
    } else if (field === "eco_label") {
      setDropdownHeader("Distintivo Medioambiental");
      setDropdownOptions(
        ECO_LABEL_OPTIONS.map((opt) => ({ label: opt, value: opt }))
      );
    }
    setDropdownField(field);
    setDropdownVisible(true);
  };

  const handleSelect = (value: string) => {
    if (dropdownField) {
      updateField(dropdownField, value); 
      setDropdownVisible(false);
    }
  };

  const handleSave = async () => {
    if (!vehicleData) return;

    const requiredFields: (keyof Vehicle)[] = [
      "name",
      "brand",
      "model",
      "year",
      "km_total",
      "engine",
      "plate",
    ];

    const fieldsToValidate = Object.keys(valueObjectMap) as (keyof Vehicle)[];
    const newErrors: typeof errors = {};
    const finalData: Partial<Vehicle> = {};

    for (const field of fieldsToValidate) {
      const rawValue = vehicleData[field];

      const isOptional =
        !requiredFields.includes(field) &&
        (rawValue === "" || rawValue === null || rawValue === undefined);

      if (isOptional) continue;

      try {
        const valueToValidate =
          typeof rawValue === "string"
            ? field === "plate"
              ? rawValue.toUpperCase()
              : rawValue.trim()
            : rawValue !== undefined && rawValue !== null
              ? String(rawValue)
              : "";

        const parser = valueObjectMap[field];
        if (parser) {
          const parsed = parser(valueToValidate);
          finalData[field] = parsed;
        }
      } catch (error: any) {
        newErrors[field] = error.message || "Valor inválido";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalMessage("Corrige los errores antes de guardar.");
      setModalVisible(true);
      return;
    }

    try {
      await updateVehicle({ ...vehicleData, ...finalData });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      setModalMessage("Error al actualizar el vehículo.");
      setModalVisible(true);
    }
  };

  if (loading || !vehicleData) {
    return <View className="flex-1 justify-center items-center" />;
  }

  return (
    <>
      <AppHeader
        type="backOptions"
        title="Editar vehículo"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1 px-6 pt-4">
          <View className="relative mb-6 rounded-xl overflow-hidden">
            <Image
              source={
                vehicleData.image_uri
                  ? { uri: vehicleData.image_uri }
                  : DEFAULT_VEHICLE_IMAGE
              }
              className="w-full h-48 rounded-xl"
              resizeMode="cover"
            />
            <View className="absolute bottom-2 left-2">
              <CircleIconButton
                icon={<Ionicons name="camera" size={18} color="white" />}
                onPress={pickImage}
              />
            </View>
          </View>

          {INPUT_FIELDS_VEHICLE.map(
            ({ label, field, placeholder, icon, keyboardType, multiline }) => {
              if (field === "fuel" || field === "eco_label") {
                const selectedIndex = Number(vehicleData[field]) || 0;
                const selectedLabel =
                  field === "fuel"
                    ? (FUEL_OPTIONS[selectedIndex] ?? "")
                    : (ECO_LABEL_OPTIONS[selectedIndex] ?? "");

                return (
                  <TouchableInput
                    key={field}
                    label={label}
                    icon={icon}
                    placeholder={placeholder}
                    value={vehicleData[field] ?? ""}
                    error={errors[field]}
                    onPress={() => openDropdown(field as keyof Vehicle)}
                  />
                );
              }

              return (
                <FormInput
                  key={field}
                  label={label}
                  icon={icon}
                  placeholder={placeholder}
                  keyboardType={keyboardType}
                  multiline={multiline}
                  value={String(vehicleData[field] ?? "")}
                  error={errors[field]}
                  onChangeText={(text) =>
                    updateField(field as keyof Vehicle, text)
                  }
                />
              );
            }
          )}

          <CustomButton
            text="Guardar cambios"
            type="success"
            icon={<Ionicons name="save" size={24} color="white" />}
            onPress={handleSave}
          />

          <View className="h-16" />
        </ScrollView>
      </KeyboardAvoidingView>

      <DropdownModal
        header={dropdownHeader}
        visible={dropdownVisible}
        options={dropdownOptions}
        selectedValue={Number(vehicleData[dropdownField ?? "fuel"]) || 0}
        onSelect={handleSelect}
        onCancel={() => setDropdownVisible(false)}
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
          loadingText="Aplicando cambios..."
          successText="Vehículo editado con éxito"
          successIcon={
            <Ionicons name="checkmark-circle" size={90} color="#4CAF50" />
          }
          duration={3000}
        />
      )}
    </>
  );
}
