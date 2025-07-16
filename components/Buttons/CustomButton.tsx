import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";

type ButtonType = "primary" | "success" | "info" | "error";

interface Props {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
  style?: ViewStyle;
  type?: ButtonType;
  size?: "sm" | "md" | "lg";
}

const backgroundColors: Record<ButtonType, string> = {
  primary: "bg-blue-700",
  success: "bg-green-700",
  info: "bg-ui-header",
  error: "bg-red-700",
};

const sizeHeights: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-10",
  md: "h-14",
  lg: "h-16",
};

export default function CustomButton({
  icon,
  text,
  onPress,
  style,
  type = "success",
  size = "md",
}: Props) {
  const bgColor = backgroundColors[type];
  const heightClass = sizeHeights[size];

  return (
    <TouchableOpacity
      className={`${bgColor} ${heightClass} w-full rounded-xl items-center flex-row justify-center gap-2`}
      onPress={onPress}
      style={style}
    >
      {icon}
      <Text className="text-white font-bold text-base">{text}</Text>
    </TouchableOpacity>
  );
}

