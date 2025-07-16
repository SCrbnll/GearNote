import { ReactNode } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

interface CircleIconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  bgColor?: string;
  size?: number;
  style?: ViewStyle;
}

export default function CircleIconButton({
  icon,
  onPress,
  bgColor = "#0F0F0F",
  size = 35,
  style,
}: CircleIconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-full items-center justify-center"
      style={[{ backgroundColor: bgColor, width: size, height: size }, style]}
    >
      {icon}
    </TouchableOpacity>
  );
}

