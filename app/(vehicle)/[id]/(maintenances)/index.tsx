import MaintenanceCard from "@/components/Card/MaintenanceCard";
import AppHeader from "@/components/Header/AppHeader";
import { Maintenance, Vehicle } from "@/types/type-db";
import { getMaintenancesByVehicleId, getVehicleById } from "@/utils/database";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function MaintenanceScreen() {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const parseDateDMY = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchMaintenances = async () => {
        try {
          const data = await getMaintenancesByVehicleId(Number(id));
          const sortedData = data.sort((a, b) => {
            return (
              parseDateDMY(b.date).getTime() - parseDateDMY(a.date).getTime()
            );
          });
          setMaintenances(sortedData);
        } catch (err) {
          console.error("Error al obtener mantenimientos:", err);
        }
      };

      const fetchVehicle = async () => {
        try {
          const [vehicle] = await Promise.all([
            getVehicleById(Number(id)),
            new Promise((resolve) => setTimeout(resolve, 500)),
          ]);

          if (isActive && vehicle) {
            setVehicle(vehicle);
            setIsLoading(false);
          }
        } catch (err) {
          console.error("Error al obtener vehículo:", err);
          setIsLoading(false);
        }
      };

      fetchMaintenances();
      fetchVehicle();
    }, [])
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-ui-body justify-center items-center">
        <ActivityIndicator size="large" color="#FE9525" />
      </View>
    );
  }

  const displayDate = (dateStr: string): string => {
    return dateStr.replace(/-/g, "/");
  };

  return (
    <>
      <AppHeader
        type="backOptions"
        title={vehicle?.name ? `Mantenimientos ${vehicle.name}` : `Mantenimientos ${vehicle?.brand} ${vehicle?.model}`}
        rightIcon={<Ionicons name="add" size={20} color="#B0B0B0" />}
        onBack={() => router.back()}
        onRightPress={() =>
          router.push(`/(vehicle)/${id}/(maintenances)/create`)
        }
      />
      <View className="flex-1 bg-ui-body px-6 pt-6">
        <FlatList
          data={maintenances}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MaintenanceCard
              item={{ ...item, date: displayDate(item.date) }}
              onDeleted={(idToRemove) => {
                setMaintenances((prev) =>
                  prev.filter((m) => m.id !== idToRemove)
                );
              }}
            />
          )}
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Ionicons name="clipboard-outline" size={40} color="#FE9525" />
              <Text className="text-primary text-sm mt-2 text-center">
                No hay mantenimientos registrados
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}
