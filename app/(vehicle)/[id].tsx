import ConfirmationModal from "@/components/ConfirmationModal";
import HistoryItem from "@/components/HistoryItem";
import NotesModal from "@/components/NotesModal";
import VehicleInfoCard from "@/components/VehicleInfoCard";
import { MAINTENANCE_HISTORY } from "@/constants/maintenance_history";
import { VEHICLES } from "@/constants/vehicles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";

export default function VehicleInfoScreen() {
  const { id } = useLocalSearchParams();
  const vehicle = VEHICLES.find((v) => v.id === id);

  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"delete" | "redirect" | null>(
    null
  );

  const [notesVisible, setNotesVisible] = useState(false);
  const [notes, setNotes] = useState(vehicle?.additional_info || "");

  if (!vehicle) {
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

  const confirmAction = () => {
    if (modalType === "redirect") {
      Linking.openURL(vehicle.technical_sheet);
    } else if (modalType === "delete") {
      console.log("Vehículo eliminado");
    }
    setShowConfirm(false);
  };

  const handleSaveNotes = () => {
    console.log("Notas guardadas:", notes);
    setNotesVisible(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: vehicle.name,
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />

      <View className="flex-1 px-6 pt-5 pb-3">
        <View>
          <Text className="text-primary text-2xl font-bold">
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text className="text-error text-sm mt-1">Año {vehicle.year}</Text>
        </View>

        <VehicleInfoCard vehicle={vehicle} />

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

        <View className="flex-1">
          <Text className="text-error text-base mb-2">
            Últimos mantenimientos
          </Text>
          <FlatList
            data={MAINTENANCE_HISTORY.filter(
              (item) => item.vehicle_id === vehicle.id
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HistoryItem item={item} />}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Ionicons name="car-outline" size={40} color="#FE9525" />
                <Text className="text-primary text-sm mt-2 text-center">
                  No hay mantenimientos registrados
                </Text>
              </View>
            }
          />
        </View>

        <View className="flex-row justify-between mt-6 space-x-3 gap-2">
          <Link
            href={{ pathname: "/edit/[id]", params: { id: vehicle.id } }}
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
        notes={notes}
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
