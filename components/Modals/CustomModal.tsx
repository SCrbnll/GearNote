import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  data: any;
};

export default function CustomModal({ visible, onClose, title, data }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-ui-header w-full max-h-[80%] rounded-xl p-6 space-y-4">
          <Text className="text-primary font-bold text-lg">{title}</Text>

          {data.length === 0 ? (
            <Text className="text-secondary">Sin datos disponibles.</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
              renderItem={({ item }) => (
                <View className="bg-white rounded-lg p-3 mb-3">
                  {Object.entries(item).map(([key, value]) => (
                    <Text key={key} className="text-xs text-black mb-1">
                      <Text className="font-semibold">{key}:</Text> {String(value)}
                    </Text>
                  ))}
                </View>
              )}
            />
          )}

          <View className="flex-row justify-end">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-error font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
