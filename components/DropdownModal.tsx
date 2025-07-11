import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Option = {
  label: string;
  value: any;
};

type Props = {
  visible: boolean;
  options: Option[];
  onSelect: (value: number) => void;
  onCancel: () => void;
  selectedValue: number;
};

export default function DropdownModal({
  visible,
  options,
  onSelect,
  onCancel,
  selectedValue,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-ui-header w-full rounded-xl p-4">
          <Text className="text-primary font-bold text-lg mb-4">
            Seleccionar vehículo
          </Text>

          <ScrollView className="max-h-[300px]">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => onSelect(opt.value)}
                className={`py-3 px-4 rounded-lg ${
                  opt.value === selectedValue ? "bg-ui-body" : ""
                }`}
              >
                <Text className={`font-semobild ${opt.value === selectedValue ? "text-success" : "text-secondary"}`}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="mt-2 flex-row justify-end">
            <TouchableOpacity onPress={onCancel} className="flex-row items-center">
              <Text className="text-error font-semibold ml-1">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
