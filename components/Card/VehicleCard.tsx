import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

type VehicleCardProps = {
  id: string;
  name: string;
  brand: string;
  model?: string;
  engine?: string;
  imageUri?: string | null;
};

export default function VehicleCard({
  id,
  name,
  brand,
  model,
  engine,
  imageUri,
}: VehicleCardProps) {
  const defaultImage = require("@/assets/images/vehicle_banner.jpg")

  const showImage = imageUri && imageUri.trim() !== "";

  return (
    <Link href={{ pathname: "/(vehicle)/[id]", params: { id } }} asChild>
      <TouchableOpacity
        className="bg-ui-card px-4 py-3 rounded-2xl flex-row items-center justify-between mb-3"
        activeOpacity={0.8}
      >
        <Image
          source={showImage ? { uri: imageUri } : defaultImage}
          className="rounded-xl mr-3"
          style={{ width: 80, height: 70, marginRight: 10 }}
          resizeMode="cover"
        />

        <View className="flex-1">
          {name ? (
            <>
              <Text className="text-primary font-semibold text-base">{name}</Text>
              <Text className="text-secondary text-sm">{brand} {model}</Text>
              <Text className="text-secondary text-sm">{engine}</Text>
            </>
          ) : (
            <>
              <Text className="text-primary font-semibold text-base">{brand} {model}</Text>
              <Text className="text-secondary text-sm">{engine}</Text>
            </>
          )}
        </View>

        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </Link>
  );
}
