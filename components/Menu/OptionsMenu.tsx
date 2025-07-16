import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Option = {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode; 
};

type OptionsMenuProps = {
  options: Option[];
  style?: object;
  onClose?: () => void;
};

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
  options,
  style,
  onClose,
}) => {
  const handlePress = (callback: () => void) => {
    callback();
    if (onClose) onClose();
  };

  return (
    <View style={[styles.container, style]}>
      {options.map((option, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => handlePress(option.onPress)}
          style={[styles.option, i !== options.length - 1 && styles.optionBorder]}
        >
          <View style={styles.optionContent}>
            {option.icon && <View style={styles.iconWrapper}>{option.icon}</View>}
            <Text style={styles.optionText}>{option.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#1A3A66",
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 20,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomColor: "#8E8E8E",
    borderBottomWidth: 1,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 10,
  },
  optionText: {
    color: "#FE9525",
    fontWeight: "600",
  },
});
