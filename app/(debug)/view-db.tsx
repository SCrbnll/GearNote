import db from "@/utils/database";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

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

  const renderTable = (title: string, rows: unknown[]) => (
    <View className="mb-6">
      <Text className="text-xl font-bold mb-2">{title}</Text>
      {rows.length === 0 ? (
        <Text className="text-secondary">Sin datos</Text>
      ) : (
        rows.map((row, i) => (
          <View key={i} className="bg-gray-100 rounded-xl p-3 mb-2">
            {Object.entries(row as Record<string, unknown>).map(([key, value]) => (
              <Text key={key} className="text-xs">
                <Text className="font-semibold">{key}:</Text> {String(value)}
              </Text>
            ))}
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {renderTable("Usuarios", data.users)}
      {renderTable("Vehículos", data.vehicles)}
      {renderTable("Mantenimientos", data.maintenances)}
    </ScrollView>
  );
}

