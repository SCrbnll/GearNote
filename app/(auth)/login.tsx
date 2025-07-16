import CustomButton from "@/components/Buttons/CustomButton";
import FormInput from "@/components/Inputs/FormInput";
import SuccessOverlay from "@/components/Overlay/SuccessOverlay";
import { APP_ICON } from "@/constants/global";
import { initDatabase, insertUser } from "@/utils/database";
import { restoreDatabaseFromJSON } from "@/utils/databaseBackup";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Stack, router } from "expo-router";
import { JSX, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function AuthScreen() {
  const [username, setUsername] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [icon, setIcon] = useState<JSX.Element | null>(null);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const fileUri = result.assets[0].uri;
        const content = await FileSystem.readAsStringAsync(fileUri);
        const jsonData = JSON.parse(content);

        await restoreDatabaseFromJSON(jsonData);

        setLoadingText("Restaurando datos...");
        setSuccessText("Datos restaurados con éxito");
        setIcon(<Ionicons name="cloud-upload" size={90} color="#16a34a" />);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Error al restaurar:", err);
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) return;

    try {
      await initDatabase();
      await insertUser(username);

      setLoadingText("Creando cuenta...");
      setSuccessText("Cuenta creada con éxito");
      setIcon(<Ionicons name="person-add" size={90} color="#16a34a" />);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error al registrar usuario:", err);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <KeyboardAvoidingView
        className="flex-1 bg-ui-header"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center items-center px-6 pt-10">
            <Image
              source={APP_ICON}
              className="w-32 h-32 mb-6"
              resizeMode="contain"
            />
            <View className="items-center gap-1">
              <Text className="text-white text-2xl font-bold">
                ¡Bienvenido a Gearnote!
              </Text>
              <Text className="text-secondary text-center mb-8">
                Elige una opción para continuar
              </Text>
            </View>

            <CustomButton
              icon={<Ionicons name="cloud-upload" size={16} color="white" />}
              text="Restaurar datos (Iniciar sesión)"
              onPress={handlePickFile}
              type="primary"
            />

            <View className="w-full mb-4 mt-4">
              <FormInput
                label="Nombre de usuario"
                icon={<Ionicons name="person" size={16} color="#FE9525" />}
                placeholder="Tu nombre..."
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <CustomButton
              icon={<Ionicons name="person-add" size={16} color="#FFFFFF" />}
              text="Crear cuenta"
              onPress={handleRegister}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ Overlay de éxito compartido */}
      {showSuccess && (
        <SuccessOverlay
          loadingText={loadingText}
          successText={successText}
          successIcon={icon}
          duration={3000}
          onFinish={() => router.replace("/(tabs)/home")}
        />
      )}
    </>
  );
}
