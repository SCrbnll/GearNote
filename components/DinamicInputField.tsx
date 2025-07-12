import { Text, TextInput, View } from "react-native";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "numeric" | "url";
  multiline?: boolean;
  numberOfLines?: number;
}

export default function DynamicInputField({
  label,
  value,
  onChange,
  placeholder,
  icon,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
}: Props) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center gap-2 mb-1">
        {icon}
        <Text className="text-primary font-semibold">{label}</Text>
      </View>
      <TextInput
        className={`bg-ui-header rounded-xl px-4 py-3 text-white ${
          multiline ? "min-h-[150px] text-left" : ""
        }`}
        placeholder={placeholder}
        placeholderTextColor="#bbb"
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}
