import { APP_ICON, SCRBNLL_WEB, VERSION_APP } from "@/constants/global";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
export default function AppFooter() {
  const handlePortfolioRedirect = () => {
    Linking.openURL(SCRBNLL_WEB);
  };

  return (
    <View className="flex-row items-center justify-between px-5 py-4 gap-4">
      <View className="flex-row items-center gap-2">
        <Image
          source={APP_ICON} 
          resizeMode="cover"
          style={{ width: 35, height: 35 }}
        />
        <View>
            <Text className="text-sm text-primary">App creada por</Text>
            <TouchableOpacity onPress={handlePortfolioRedirect}>
            <Text className="text-sm font-bold text-success underline">SCrbnll</Text>
            </TouchableOpacity>
        </View>
      </View>

      <Text className="text-xs text-secondary">v{VERSION_APP}</Text>
    </View>
  );
}
