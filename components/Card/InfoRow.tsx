import { Text, View } from "react-native";

export default function InfoRow({
  label,
  value,
  icon,
  bg = "bg-background-secondary",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg?: string;
}) {
  return (
    <View className="flex-row items-center justify-between mb-3 border-b-2 border-ui-header">
      <View className="flex-row items-center space-x-2">
        {icon}
        <Text className="text-secondary font-semibold ml-2">{label}</Text>
      </View>
      <View className={`${bg} px-3 py-1 rounded-full`}>
        <Text className="text-success font-semibold text-sm">{value}</Text>
      </View>
    </View>
  );
}