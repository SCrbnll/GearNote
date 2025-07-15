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
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";
import { DEFAULT_VEHICLE_IMAGE, INPUT_FIELDS } from "@/constants/global";
import { Vehicle } from "@/types/type-db";
import { insertVehicle } from "@/utils/database";

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
    image_uri: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);


  const updateField = (field: keyof Vehicle, value: string) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]:
        field === "year" || field === "km_total" ? Number(value) || 0 : value,
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setVehicleData((prev) => ({ ...prev, image_uri: selectedImageUri }));
    }
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
      (field) => !vehicleData[field] || vehicleData[field] === 0
    );

    if (missing.length > 0) {
      setModalMessage(`Faltan campos obligatorios: ${missing.join(", ")}`);
      setModalVisible(true);
      return;
    }

    try {
      await insertVehicle(vehicleData);
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

          {INPUT_FIELDS.map(
            ({ label, field, placeholder, icon, keyboardType, multiline }) => (
              <FormInput
                key={field}
                label={label}
                icon={icon}
                placeholder={placeholder}
                keyboardType={keyboardType}
                value={String(vehicleData[field] ?? "")}
                multiline={multiline}
                onChangeText={(text) =>
                  updateField(field as keyof Vehicle, text)
                }
              />
            )
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
          successIcon={<Ionicons name="checkmark-circle" size={90} color="#4CAF50" />}
          duration={3000}
        />
      )}
    </>
  );
}
