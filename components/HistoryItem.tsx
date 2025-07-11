import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  item: {
    id?: number;
    title: string;
  };
  description?: string;
};

export default function HistoryItem({ item, description }: Props) {
  const maxLength = 40;
  const title = item.title.length > maxLength ? `${item.title.slice(0, maxLength - 3)}...` : item.title;
  const router = useRouter();

  return (
      <TouchableOpacity className="flex-row items-center justify-between bg-ui-header rounded-xl px-4 py-3 mb-3" onPress={() => router.push(`/(maintenance)/${item.id}`)}>
        <View className="flex-row items-center space-x-3">
          <MaterialIcons name="build" size={20} color="#FE9525" />
          {description ? (
            <View className="flex-col ml-4">
              <Text className="text-success font-medium">{title}</Text>
              <Text className="text-secondary text-sm">{description}</Text>
            </View>
          ) : (
            <Text className="text-success font-medium ml-4">{title}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#FE9525" />
      </TouchableOpacity>
  );
}

