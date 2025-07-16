import React from "react";
import { ScrollView, Text, View } from "react-native";

interface InfoCardScrollProps {
  label: string;
  icon?: React.ReactNode;
  content: string;
  backgroundColor?: string;
  textColor?: string;
  height?: number;
}

export default function InfoCardScroll({
  label,
  icon,
  content,
  backgroundColor = "#1A3A66",
  textColor = "white",
  height = 128,
}: InfoCardScrollProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        {icon}
        <Text className="text-primary font-semibold ml-2">{label}</Text>
      </View>

      <View
        className={`rounded-xl px-4 py-3`}
        style={{ backgroundColor, height }}
      >
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ color: textColor }}>{content}</Text>
        </ScrollView>
      </View>
    </View>
  );
}
