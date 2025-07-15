import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
}

export default function FormInput({ label, icon, ...rest }: FormInputProps) {
  return (
    <View>
      <View className="flex-row items-center mb-2">
        {icon}
        <Text className="text-primary font-semibold ml-2">{label}</Text>
      </View>
      <TextInput
        className="bg-white text-black rounded-xl px-4 py-3"
        placeholderTextColor="#999"
        {...rest}
      />
    </View>
  );
}
