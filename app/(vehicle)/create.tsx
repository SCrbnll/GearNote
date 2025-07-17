import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import AlertModal from "@/components/Modals/AlertModal";
import DropdownModal from "@/components/Modals/DropdownModal";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";

import TouchableInput from "@/components/Inputs/TouchableInput";
import {
  DEFAULT_VEHICLE_IMAGE,
  ECO_LABEL_OPTIONS,
  FUEL_OPTIONS,
  INPUT_FIELDS_VEHICLE,
} from "@/constants/global";
import { Vehicle } from "@/types/type-db";
import { insertVehicle } from "@/utils/database";
import { valueObjectMap } from "@/utils/valueObjects/vehicle";

export default function CreateVehicleScreen() {
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
    additional_info: "",
    image_uri: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
  const [dropdownHeader, setDropdownHeader] = useState<string>("");

  const updateField = (field: keyof Vehicle, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setVehicleData((prev) => ({ ...prev, image_uri: selectedImageUri }));
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

  const handleSelect = (value: string | number) => {
  if (dropdownField) {
    updateField(dropdownField, String(value));
    setDropdownVisible(false);
  }
};

  const handleSave = async () => {
    const requiredFields: (keyof Vehicle)[] = [
      "name",
      "brand",
      "model",
      "year",
      "km_total",
      "fuel",
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
      await insertVehicle(finalData as Vehicle);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error al guardar vehículo:", err);
      setModalMessage("Ocurrió un error al guardar el vehículo.");
      setModalVisible(true);
    }
  };

  return (
    <>
      <AppHeader
        type="backOptions"
        title="Agregar vehículo"
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
                  value={String(vehicleData[field] ?? "")}
                  multiline={multiline}
                  error={errors[field]}
                  onChangeText={(text) =>
                    updateField(field as keyof Vehicle, text)
                  }
                />
              );
            }
          )}

          <CustomButton
            text="Agregar vehículo"
            type="success"
            icon={<Ionicons name="add-circle" size={24} color="white" />}
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
          loadingText="Añadiendo vehículo..."
          successText="Vehículo añadido con éxito"
          successIcon={
            <Ionicons name="checkmark-circle" size={90} color="#4CAF50" />
          }
          duration={3000}
        />
      )}
    </>
  );
}
