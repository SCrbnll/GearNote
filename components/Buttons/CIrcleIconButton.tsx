import { ReactNode } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

interface CircleIconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  bgColor?: string;
  style?: ViewStyle;
}

export default function CircleIconButton({
  icon,
  onPress,
  bgColor = "#0F0F0F",
  style,
}: CircleIconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 rounded-full items-center justify-center"
      style={[{ backgroundColor: bgColor }, style]}
    >
      {icon}
    </TouchableOpacity>
  );
}
