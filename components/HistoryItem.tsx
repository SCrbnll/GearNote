import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function HistoryItem({ item }: { item: { id: string; title: string } }) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between bg-ui-header rounded-xl px-4 py-3 mb-3">
      <View className="flex-row items-center space-x-3">
        <MaterialIcons name="build" size={20} color="#FE9525" />
        <Text className="text-success font-medium ml-2">{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#FE9525" />
    </TouchableOpacity>
  );
}