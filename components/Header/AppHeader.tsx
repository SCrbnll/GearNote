import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import CircleIconButton from "../Buttons/CircleIconButton";

type HeaderType =
  | "home"
  | "backOptions"
  | "cancelTitle"
  | "transparentBackOptions";

interface HeaderProps {
  type: HeaderType;
  title?: string;
  onBack?: () => void;
  onCancel?: () => void;
  onRightPress?: () => void;
  rightIcon?: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
}

export default function AppHeader({
  type,
  title,
  onBack,
  onCancel,
  onRightPress,
  rightIcon,
  backgroundColor,
  style,
}: HeaderProps) {
  const bgColors = {
    home: "#1A3A66",
    backOptions: "#0B223D",
    cancelTitle: "#0B223D",
    transparentBackOptions: "transparent",
  };

  const bgColor = backgroundColor ?? bgColors[type];

  return (
    <View
      className="flex-row items-center justify-between px-4 py-3"
      style={[{ backgroundColor: bgColor }, style]}
    >
      {type === "home" && (
        <>
          <Text className="text-white font-bold text-xl p-2">{title}</Text>
          <TouchableOpacity onPress={onRightPress}>
            {rightIcon}
          </TouchableOpacity>
        </>
      )}

      {(type === "backOptions" || type === "transparentBackOptions") && (
        <>
          <CircleIconButton
            onPress={onBack}
            icon={<Ionicons name="arrow-back" size={20} color="#B0B0B0" />}
          />

          <Text className="text-white font-bold text-xl flex-1 pl-8">
            {title}
          </Text>
          {rightIcon ? 
          <CircleIconButton
              onPress={onRightPress}
              icon={ <Ionicons name="ellipsis-vertical" size={20} color="#B0B0B0" />}
            />
          :
          <View style={{ width: 20 }} />
          }
        </>
      )}

      {type === "cancelTitle" && (
        <>
          <CircleIconButton
            onPress={onCancel}
            icon={<Ionicons name="close" size={20} color="#B0B0B0" />}
            />
          <Text className="text-white font-bold text-xl flex-1 pl-8">{title}</Text>
          <View style={{ width: 24 }} />
        </>
      )}
    </View>
  );
}
