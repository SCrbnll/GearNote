import { Ionicons } from "@expo/vector-icons";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const handleGitHubRedirect = () => {
    Linking.openURL("https://samuelcg.com");
  };

  const handleViewData = () => {
    console.log("Ver mis datos");
  };

  const handleImportData = () => {
    console.log("Cargar datos desde archivo");
  };

  const handleExportData = () => {
    console.log("Exportar datos a archivo");
  };

  return (
    <View className="flex-1 bg-ui-body px-6 pt-5 justify-between">
      {/* Contenido principal */}
      <View>
        {/* Perfil */}
        <View className="items-center mb-6">
          <Image
            source={require("./../../assets/images/user_pfp.png")}
            className="w-24 h-24 rounded-full mb-3 bg-gray-300"
            resizeMode="cover"
          />
          <Text className="text-xl font-bold text-primary">SCrbnll</Text>
        </View>

        {/* Botones */}
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
            <Text className="text-primary font-medium">Ver mis datos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row bg-green-700 rounded-xl py-4 px-5 items-center justify-center"
            onPress={handleImportData}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text className="text-white font-medium">Cargar datos</Text>
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
        </View>
      </View>

      <View className="items-center pb-6 justify-center">
        <TouchableOpacity onPress={handleGitHubRedirect} className="items-center">
          <Text className="text-sm text-primary">App creada por</Text>
          <Text className="text-base font-bold text-success underline">
            Samuel Carbonell
          </Text>
        </TouchableOpacity>
        <Text className="text-xs text-secondary mt-1">v1.0</Text>
      </View>
    </View>
  );
}
