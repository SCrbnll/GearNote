import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  onPress: () => void;
};

export default function TouchableInput({
  label,
  value,
  placeholder,
  icon,
  error,
  onPress,
}: Props) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        {icon}
        <Text className="text-primary font-semibold ml-2">{label}</Text>
      </View>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={`flex-row items-center border rounded-xl px-4 py-3 bg-white ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <Text className={`${value ? "text-black" : "text-gray-400"}`}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 mt-1 text-sm">{error}</Text>}
    </View>
  );
}
