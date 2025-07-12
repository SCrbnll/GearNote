import AlertModal from "@/components/AlertModal";
import { initDatabase, insertUser } from "@/utils/database";
import { restoreDatabaseFromJSON } from "@/utils/databaseBackup";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const [username, setUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setmodalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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

        setmodalTitle("Restauración exitosa");
        setModalMessage("Tus datos han sido recuperados.");
      } else {
        setmodalTitle("Cancelado");
        setModalMessage("La restauración fue cancelada.");
      }
    } catch (err) {
      console.error("Error al restaurar:", err);
      setmodalTitle("Error");
      setModalMessage("No se pudo restaurar el archivo.");
    } finally {
      setModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalTitle === "Restauración exitosa") {
      router.replace("/(tabs)/home");
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      setmodalTitle("Error");
      setModalMessage("Por favor, ingresa un nombre de usuario.");
      setModalVisible(true);
      return;
    }
    try {
      await initDatabase();
      await insertUser(username);
      router.replace("/(tabs)/home");
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setmodalTitle("Error");
      setModalMessage("No se pudo registrar el usuario.");
      setModalVisible(true);
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
              source={require("@/assets/images/gearnote-icon.png")}
              className="w-32 h-32 mb-6"
              resizeMode="contain"
            />

            <Text className="text-white text-2xl font-bold mb-2">
              ¡Bienvenido a Gearnote!
            </Text>
            <Text className="text-secondary text-center mb-8">
              Elige una opción para continuar
            </Text>

            <TouchableOpacity
              className="bg-blue-600 w-full rounded-xl py-4 items-center mb-4"
              onPress={handlePickFile}
            >
              <Text className="text-white font-bold text-base">
                Restaurar datos (Iniciar sesión)
              </Text>
            </TouchableOpacity>

            <View className="w-full mb-4">
              <Text className="text-primary font-semibold mb-2">
                Nombre de usuario
              </Text>
              <TextInput
                className="bg-white text-black rounded-xl px-4 py-3"
                placeholder="Tu nombre..."
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <TouchableOpacity
              className="bg-green-700 w-full rounded-xl py-4 items-center"
              onPress={handleRegister}
            >
              <Text className="text-white font-bold text-base">
                Crear cuenta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AlertModal
        visible={modalVisible}
        title={modalTitle}
        description={modalMessage}
        onCancel={handleModalClose}
      />
    </>
  );
}
