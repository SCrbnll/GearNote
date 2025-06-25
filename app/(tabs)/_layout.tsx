import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* SafeAreaView para respetar notch y status bar */}
      <SafeAreaView edges={['top']} className="bg-ui-header">
        <View className="flex-row items-center px-4 py-3">
          <Image
            source={require("../../assets/images/gearnote-icon.png")}
            style={{ width: 40, height: 40, marginRight: 8 }}
            resizeMode="contain"
          />
          <Text className="text-lg font-bold text-primary">GearNote</Text>
        </View>
      </SafeAreaView>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#FE9525",
          tabBarInactiveTintColor: "#d1d5db",
          tabBarStyle: { backgroundColor: "#1A3A66" },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="vehicles"
          options={{
            title: "Vehículos",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="car-sport" size={size} color={color} />
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
