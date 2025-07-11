import CustomModal from "@/components/CustomModal";
import db from "@/utils/database";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ViewDatabaseScreen() {
  const [data, setData] = useState<{
    users: unknown[];
    vehicles: unknown[];
    maintenances: unknown[];
  }>({
    users: [],
    vehicles: [],
    maintenances: [],
  });

  const [activeModal, setActiveModal] = useState<"users" | "vehicles" | "maintenances" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await db.getAllAsync("SELECT * FROM user");
        const vehicles = await db.getAllAsync("SELECT * FROM vehicles");
        const maintenances = await db.getAllAsync("SELECT * FROM maintenances");
        setData({ users, vehicles, maintenances });
      } catch (err) {
        console.error("Error al leer BD:", err);
      }
    };

    fetchData();
  }, []);

  const renderButton = (label: string, type: "users" | "vehicles" | "maintenances") => (
    <TouchableOpacity
      key={type}
      className="bg-ui-header py-3 px-5 rounded-xl mb-4"
      onPress={() => setActiveModal(type)}
    >
      <Text className="text-white font-semibold text-center">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Base de datos local",
          headerShown: true,
          headerStyle: { backgroundColor: "#1A3A66" },
          headerTintColor: "#FE9525",
        }}
      />
      <View className="flex-1 bg-ui-body px-6 pt-5 pb-3 justify-center">
        {renderButton("👤 Usuarios", "users")}
        {renderButton("🚗 Vehículos", "vehicles")}
        {renderButton("🛠️ Mantenimientos", "maintenances")}

        <CustomModal
          visible={activeModal === "users"}
          onClose={() => setActiveModal(null)}
          title="Usuarios"
          data={data.users}
        />
        <CustomModal
          visible={activeModal === "vehicles"}
          onClose={() => setActiveModal(null)}
          title="Vehículos"
          data={data.vehicles}
        />
        <CustomModal
          visible={activeModal === "maintenances"}
          onClose={() => setActiveModal(null)}
          title="Mantenimientos"
          data={data.maintenances}
        />
      </View>
    </>
  );
}
