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
}

export default function FormInput({
  label,
  icon,
  keyboardType = "default",
  multiline = false,
  editable = true,
  backgroundColor = "white", 
  ...rest
}: FormInputProps) {
  return (
    <View>
      <View className="flex-row items-center mb-2">
        {icon}
        <Text className="text-primary font-semibold ml-2">{label}</Text>
      </View>
      <TextInput
        className={`text-white rounded-xl px-4 py-3 ${
          multiline ? "h-32" : ""
        }`}
        style={{ backgroundColor }}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        editable={editable}
        selectTextOnFocus={editable}
        {...rest}
      />
    </View>
  );
}
