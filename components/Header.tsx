import { Image, Text, View } from "react-native";

export default function Header() {
  return (
    <View className="flex-row items-center px-4 py-3">
      <Image
        source={require("../assets/images/gearnote-icon.png")}
        style={{ width: 40, height: 40, marginRight: 8 }}
        resizeMode="contain"
      />
      <Text className="text-lg font-bold text-primary">GearNote</Text>
    </View>
  );
}
