import AppFooter from "@/components/AppFooter";
import CustomButton from "@/components/Buttons/CustomButton";
import AppHeader from "@/components/Header/AppHeader";
import ConfirmationModal from "@/components/Modals/ConfirmationModal";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";
import { DEFAULT_PFP } from "@/constants/global";
import { clearDatabase, getUserName } from "@/utils/database";
import { exportDatabaseToJSON } from "@/utils/databaseBackup";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string>();
  const [showConfirm, setShowConfirm] = useState(false);
  const [modalType, setModalType] = useState<"export" | "delete" | null>(null);
  const [showSuccess, setShowSuccess] = useState(false); 

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

  const handleExportData = () => {
    setModalType("export");
    setShowConfirm(true);
  };

  const handleDeleteData = () => {
    setModalType("delete");
    setShowConfirm(true);
  };

  const confirmAction = async () => {
    if (modalType === "export") {
      await exportDatabaseToJSON();
    } else if (modalType === "delete") {
      try {
        await clearDatabase();
        setShowSuccess(true); 
      } catch (err) {
        console.error("Error al eliminar datos:", err);
      }
    }
    setShowConfirm(false);
  };

  return (
    <>
      <View className="flex-1 bg-ui-body justify-between">
        <View>
          <AppHeader
            type="backOptions"
            title="Ajustes"
            onBack={() => router.back()}
          />

          <View className="px-5 mt-4 mb-6 flex-col items-center justify-center">
            <Image
              source={DEFAULT_PFP}
              className="w-24 h-24"
              resizeMode="cover"
            />
            <Text className="text-xl font-bold text-primary mt-2">
              {username}
            </Text>
          </View>

          <View className="px-5 gap-4">
            <CustomButton
              text="Descargar datos"
              icon={<Ionicons name="cloud-download-outline" size={20} color="#fff" />}
              type="primary"
              onPress={handleExportData}
            />
            <CustomButton
              text="Borrar datos"
              icon={<Ionicons name="trash-outline" size={20} color="#fff" />}
              type="error"
              onPress={handleDeleteData}
            />
          </View>
        </View>

        <AppFooter />
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

      {showSuccess && (
        <SuccessOverlay
          onFinish={() => router.replace("/(auth)/login")}
          loadingText="Eliminando datos..."
          successText="Datos eliminados con éxito"
          successIcon={
            <Ionicons name="trash-bin-sharp" size={90} color="#b50202" />
          }
          duration={3000}
        />
      )}
    </>
  );
}
