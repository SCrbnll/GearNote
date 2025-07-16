import CustomButton from "@/components/Buttons/CustomButton";
import VehicleInfoCard from "@/components/Card/VehicleInfoCard";
import AppHeader from "@/components/Header/AppHeader";
import FormInput from "@/components/Inputs/FormInput";
import { OptionsMenu } from "@/components/Menu/OptionsMenu";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";
import { DEFAULT_VEHICLE_IMAGE } from "@/constants/global";
import { Vehicle } from "@/types/type-db";
import { deleteVehicleAndMaintenancesById, getVehicleById } from "@/utils/database";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Linking, ScrollView, Text, View } from "react-native";

export default function VehicleInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<Vehicle>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "redirect" | null>(null);  
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const options = [
  {
    label: "Editar",
    icon: <Ionicons name="create-outline" size={18} color="#FFFFFF" />,
    onPress: () => handleEdit(),
  },
  {
    label: "Eliminar",
    icon: <MaterialIcons name="delete-outline" size={18} color="#FFFFFF" />,
    onPress: () => handleDelete(),
  },
];

  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const fetchVehicle = async () => {
      try {
        const [vehicle] = await Promise.all([
          getVehicleById(Number(id)),
          new Promise((resolve) => setTimeout(resolve, 1000)), 
        ]);

        if (isActive && vehicle) {
          setVehicleData(vehicle);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error al obtener vehículo:", err);
        setIsLoading(false);
      }
    };

    fetchVehicle();

    return () => {
      isActive = false;
    };
  }, [id])
);

  
  if (isLoading) {
    return (
      <View className="flex-1 bg-ui-body justify-center items-center">
        <ActivityIndicator size="large" color="#FE9525" />
      </View>
    );
  }
  
  const handleRedirect = () => {
    setModalType("redirect"); 
    setShowConfirm(true);
  };
  
  const handleMaintenances = () => {
    router.push(`/(vehicle)/${vehicleData!.id}/(maintenances)`);
  };
  
  const handleDelete = () => {
    setModalType("delete");
    setShowConfirm(true);
  };

  const handleEdit = () => {
    setOptionsVisible(false);
    router.push(`/(vehicle)/${vehicleData!.id}/edit`);
  };
  
  const confirmAction = async () => {
    if (modalType === "redirect") {
      Linking.openURL(vehicleData!.technical_sheet!);
    } else if (modalType === "delete") {
      try {
        await deleteVehicleAndMaintenancesById(vehicleData!.id!);
        setShowSuccess(true); 
    } catch (err) {
      console.error("Error al eliminar vehículo:", err);
      }
    }
    setShowConfirm(false);
  };

  return (
    <>
      <AppHeader
        type="transparentBackOptions"
        rightIcon={
          <Ionicons name="ellipsis-vertical" size={20} color="#B0B0B0" />
        }
        onBack={() => router.back()}
        onRightPress={() => setOptionsVisible(v => !v)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      />

      {optionsVisible && (
        <OptionsMenu
          options={options}
          style={{ top: 50, right: 10 }}
          onClose={() => setOptionsVisible(false)}
        />
      )}

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
            <Image
          source={
            vehicleData!.image_uri && vehicleData!.image_uri.trim() !== ""
              ? { uri: vehicleData!.image_uri }
              : DEFAULT_VEHICLE_IMAGE
          }
          style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />

        <View className="px-6 pt-5">
          <Text className="text-primary text-2xl font-bold">
            {vehicleData!.brand} {vehicleData!.model} ({vehicleData!.name})
          </Text>
          <Text className="text-error text-sm mt-1 mb-2">
            Año {vehicleData!.year}
          </Text>

          <VehicleInfoCard vehicle={vehicleData} />
          <View className="mb-3 gap-2">
            {vehicleData!.technical_sheet && (
              <CustomButton
                icon={
                  <MaterialIcons
                    name="document-scanner"
                    size={20}
                    color="#FE9525"
                  />
                }
                onPress={handleRedirect}
                text="Visualizar ficha técnica"
                type="info"
                size="sm"
              />
            )}

            <CustomButton
              icon={
                <MaterialCommunityIcons
                  name="wrench"
                  size={20}
                  color="#FE9525"
                />
              }
              onPress={handleMaintenances}
              text="Ver mantenimientos"
              type="info"
              size="sm"
            />
          </View>
          <View className="mb-6">
          <FormInput
              icon={
                <Ionicons name="document-sharp" size={18} color="#FE9525" />
              }
            label="Información adicional"
              value={vehicleData!.additional_info || "Sin información adicional ingresada."}
            multiline
              editable={false}
              backgroundColor="#1A3A66"
          />
          </View>
        </View>
        </ScrollView>

      <ConfirmationModal
        visible={showConfirm}
        title={
          modalType === "redirect"
            ? "¿Desea abrir la ficha técnica?\nSerá redirigido a una URL externa."
            : "¿Desea eliminar este vehículo?"
        }
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
      />

      {showSuccess && (
        <SuccessOverlay
          onFinish={() => router.back()}
          loadingText="Eliminando vehículo..."
          successText="Vehículo eliminado con éxito"
          successIcon={<Ionicons name="trash-bin-sharp" size={90} color="#b50202" />}
          duration={3000}
        />
      )}
    </>
  );
}
