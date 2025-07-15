import AppHeader from "@/components/Header/AppHeader";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import { DEFAULT_PFP, SCRBNLL_WEB, VERSION_APP } from "@/constants/global";
import { clearDatabase, getUserName } from "@/utils/database";
import { exportDatabaseToJSON } from "@/utils/databaseBackup";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"export" | "delete" | null>(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const data = await getUserName();
        setUsername(data?.name ?? "User");
      } catch (err) {
        console.error("Error al obtener los datos del usuario:", err);
      }
    };
  
    fetchUserName();
  }, []);
  

  const handlePortfolioRedirect = () => {
    Linking.openURL(SCRBNLL_WEB);
  };

  const handleViewData = () => {
    router.push("/(debug)/view-db");
  };

  const handleExportData = () => {
    setModalType("export");
    setShowConfirm(true);
  };

  const handleDeleteData = async () => {
    setModalType("delete");
    setShowConfirm(true);
  };

  const confirmAction = async () => {
      if (modalType === "export") {
        await exportDatabaseToJSON();
      } else if (modalType === "delete") {
        try{
          await clearDatabase();
          router.replace("/(auth)/login");

        } catch (err) {
          console.error("Error al eliminar datos:", err);
        }
      }
      setShowConfirm(false);
    };

  return (
    <>
    <View className="flex-1 bg-ui-body">
      <AppHeader
              type="backOptions"
              title="Ajustes"
              onBack={() => router.back()}
            />
      <View className="p-5">
        <View className="items-center mb-6">
          <Image
            source={DEFAULT_PFP}
            className="w-24 h-24 mb-3"
            resizeMode="cover"
          />
          <Text className="text-xl font-bold text-primary">{username}</Text>
        </View>

        <View className="space-y-3 mb-6 gap-3">
          <TouchableOpacity
            className="flex-row bg-ui-header rounded-xl py-4 px-5 items-center justify-center"
            onPress={handleViewData}
          >
            <Ionicons
              name="server-outline"
              size={20}
              color="#FE9525"
              style={{ marginRight: 10 }}
            />
            <Text className="text-primary font-medium">Ver base de datos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row bg-blue-600 rounded-xl py-4 px-5 items-center justify-center"
            onPress={handleExportData}
          >
            <Ionicons
              name="cloud-download-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text className="text-white font-medium">Descargar datos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row bg-red-600 rounded-xl py-4 px-5 items-center justify-center"
            onPress={handleDeleteData}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text className="text-white font-medium">Borrar datos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center pb-6 justify-center">
        <TouchableOpacity onPress={handlePortfolioRedirect} className="items-center">
          <Text className="text-sm text-primary">App creada por</Text>
          <Text className="text-base font-bold text-success underline">
            Samuel Carbonell
          </Text>
        </TouchableOpacity>
        <Text className="text-xs text-secondary mt-1">v{VERSION_APP}</Text>
      </View>
    </View>
    <ConfirmationModal
            visible={showConfirm}
            title={
              modalType === "export"
                ? "¿Desea descargar los datos locales?"
                : "¿Desea eliminar sus datos locales?"
            }
            onConfirm={confirmAction}
            onCancel={() => setShowConfirm(false)}
          />
    </>
  );
}
