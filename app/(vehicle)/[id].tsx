import HistoryItem from "@/components/HistoryItem";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import NotesModal from "@/components/Modals/NotesModal";
import VehicleInfoCard from "@/components/VehicleInfoCard";
import { Maintenance, Vehicle } from "@/types/type-db";
import { deleteVehicleAndMaintenancesById, getMaintenancesByVehicleId, getVehicleById, updateVehicleNotes } from "@/utils/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";

export default function VehicleInfoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<Vehicle>()
  const [maintenances, setMaintenances] = useState<Maintenance[]>()
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "redirect" | null>(null);
  const [notesVisible, setNotesVisible] = useState(false);
  const [notes, setNotes] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      const fetchVehicle = async () => {
        try {
          const vehicle = await getVehicleById(Number(id));
          setVehicleData(vehicle!);
          setNotes(vehicle?.additional_info);
        } catch (err) {
          console.error("Error al obtener vehículo:", err);
        }
      };
      const fetchMaintenances = async () => {
              try {
                const data = await getMaintenancesByVehicleId(Number(id));
                setMaintenances(data);
              } catch (err) {
                console.error("Error al obtener mantenimientos:", err);
              }
            };

      fetchVehicle();
      fetchMaintenances();
    }, [id])
  );

  if (!vehicleData) {
    return (
      <View className="flex-1 bg-ui-body justify-center items-center">
        <Text className="text-white">Vehículo no encontrado</Text>
      </View>
    );
  }

  const handleRedirect = () => {
    setModalType("redirect");
    setShowConfirm(true);
  };

  const handleDelete = () => {
    setModalType("delete");
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (modalType === "redirect") {
      Linking.openURL(vehicleData.technical_sheet!);
    } else if (modalType === "delete") {
      try{
        await deleteVehicleAndMaintenancesById(vehicleData.id!);
        router.back()
      } catch (err) {
        console.error("Error al eliminar vehículo:", err);
      }
    }
    setShowConfirm(false);
  };

  const handleSaveNotes = () => {
    try {
      updateVehicleNotes(vehicleData.id!, notes!);
      setNotesVisible(false);
    } catch (err) {
      console.error("Error al guardar notas:", err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: vehicleData.name,
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />

      <View className="flex-1 px-6 pt-5 pb-3">
        <View>
          <Text className="text-primary text-2xl font-bold">
            {vehicleData.brand} {vehicleData.model}
          </Text>
          <Text className="text-error text-sm mt-1">Año {vehicleData.year}</Text>
        </View>

        <VehicleInfoCard vehicle={vehicleData} />

        {vehicleData.technical_sheet ? (
          <TouchableOpacity
            className="flex-row items-center justify-between bg-ui-header rounded-xl px-4 py-3 mb-3"
            onPress={handleRedirect}
          >
            <View className="flex-row items-center space-x-3">
              <MaterialIcons name="document-scanner" size={20} color="#FE9525" />
              <Text className="text-success font-medium ml-2">
                Visualizar ficha técnica
              </Text>
            </View>
            <Ionicons name="link-outline" size={20} color="#FE9525" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-row items-center justify-between bg-ui-header rounded-xl px-4 py-3 mb-3"
          >
            <View className="flex-row items-center space-x-3">
              <MaterialIcons name="document-scanner" size={20} color="#FE9525" />
              <Text className="text-success font-medium ml-2">
                Sin ficha técnica
              </Text>
            </View>
            <Ionicons name="link-outline" size={20} color="#FE9525" />
          </TouchableOpacity>
        )}

        <View className="flex-1">
          <Text className="text-error text-base mb-2">
            Últimos mantenimientos
          </Text>
          <FlatList
            data={maintenances}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <HistoryItem item={item} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Ionicons name="clipboard-outline" size={40} color="#FE9525" />
                <Text className="text-primary text-sm mt-2 text-center">
                  No hay mantenimientos registrados
                </Text>
              </View>
            }
          />
        </View>

        <View className="flex-row justify-between mt-6 space-x-3 gap-2">
          <Link
            href={{ pathname: "/edit/[id]", params: { id: String(vehicleData.id) } }}
            asChild
          >
            <TouchableOpacity className="flex-1 flex-row bg-ui-header rounded-xl py-3 items-center justify-center">
              <Ionicons
                name="create-outline"
                size={20}
                color="#FE9525"
                style={{ marginRight: 10 }}
              />
              <Text className="text-primary font-medium">Editar</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            className="flex-1 flex-row bg-ui-header rounded-xl py-3 items-center justify-center"
            onPress={() => setNotesVisible(true)}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color="#FE9525"
              style={{ marginRight: 10 }}
            />
            <Text className="text-primary font-medium">Notas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 flex-row bg-red-700 rounded-xl py-3 items-center justify-center"
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#FE9525"
              style={{ marginRight: 10 }}
            />
            <Text className="text-white font-medium">Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NotesModal
        visible={notesVisible}
        notes={notes!}
        onChangeNotes={setNotes}
        onSave={handleSaveNotes}
        onCancel={() => setNotesVisible(false)}
      />

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
    </>
  );
}
