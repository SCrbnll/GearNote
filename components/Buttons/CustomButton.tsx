import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";

type ButtonType = "primary" | "success" | "info" | "error";

interface Props {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  type?: ButtonType;
}

const backgroundColors: Record<ButtonType, string> = {
    primary: "bg-blue-700",
  success: "bg-green-700",
  info: "bg-ui-header",
  error: "bg-red-700",
};

export default function CustomButton({
  icon,
  text,
  onPress,
  style,
  type = "success",
}: Props) {
  const bgColor = backgroundColors[type];

  return (
    <TouchableOpacity
      className={`${bgColor} w-full rounded-xl py-4 items-center flex-row justify-center gap-2`}
      onPress={onPress}
      style={style}
    >
      {icon}
      <Text className="text-white font-bold text-base">{text}</Text>
    </TouchableOpacity>
  );
}
