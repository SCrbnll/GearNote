import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  onCancel: () => void
};

export default function AlertModal({
  visible,
  title,
  description,
  onCancel
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-ui-header w-full rounded-xl p-6 space-y-4">
          <Text className="text-primary font-bold text-lg p-2">{title}</Text>
          {description && <Text className="text-secondary p-2">{description}</Text>}

          <View className="flex-row justify-end mt-2">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-error font-semibold">Cerrar</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );
}
