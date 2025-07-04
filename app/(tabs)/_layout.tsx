import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <SafeAreaView edges={["top"]} className="bg-ui-header">
        <Header />
      </SafeAreaView>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#FE9525",
          tabBarInactiveTintColor: "#d1d5db",
          tabBarStyle: {
            backgroundColor: "#1A3A66",
            height: 60 + insets.bottom, 
            paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
            paddingTop: 6,
            borderTopWidth: 0, 
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Vehículos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="car-sport" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="maintenance"
          options={{
            title: "Mantenimientos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="file-tray-full" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Ajustes",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
