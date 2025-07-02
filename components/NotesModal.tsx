import React from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type NotesModalProps = {
  visible: boolean;
  notes: string;
  onChangeNotes: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  title?: string;
};

export default function NotesModal({
  visible,
  notes,
  onChangeNotes,
  onSave,
  onCancel,
  title = "Notas adicionales",
}: NotesModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-center p-5">
        <View className="bg-[#1A3A66] rounded-2xl p-5 max-h-[80%]">
          <Text className="text-white text-lg font-bold mb-3">{title}</Text>

          <TextInput
            value={notes}
            onChangeText={onChangeNotes}
            placeholder="Escribe tus notas aquí..."
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={6}
            className="bg-[#0A162F] text-white rounded-lg p-3 min-h-[150px] text-left"
            textAlignVertical="top"
          />

          <View className="flex-row justify-end space-x-6 mt-4 gap-4">
            <TouchableOpacity onPress={onCancel}>
              <Text className="text-error font-semibold text-base">Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSave}>
              <Text className="text-success font-semibold text-base">Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
