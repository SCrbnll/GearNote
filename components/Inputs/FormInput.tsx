import React from "react";
import {
  KeyboardTypeOptions,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  editable?: boolean;
  backgroundColor?: string;
  error?: string;
}

export default function FormInput({
  label,
  icon,
  error,
  keyboardType = "default",
  multiline = false,
  editable = true,
  backgroundColor = "white",
  ...rest
}: FormInputProps) {
  const textColor = backgroundColor !== "white" ? "white" : "black";
  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        {icon}
        <Text className="text-primary font-semibold ml-2">{label}</Text>
      </View>
      <TextInput
        className={`rounded-xl px-4 py-3 border ${
          error ? "border-red-500" : "border-gray-200"
        } ${multiline ? "h-32" : ""} text-${textColor}`}
        style={{ backgroundColor }}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
        selectTextOnFocus={editable}
        scrollEnabled={multiline}
        {...rest}
      />
      {error && <Text className="text-red-500 mt-1 text-sm">{error}</Text>}
    </View>
  );
}
