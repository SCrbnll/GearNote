import { deleteMaintenanceById } from "@/utils/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { LayoutAnimation, Text, TouchableOpacity, View } from "react-native";
import CircleIconButton from "../Buttons/CircleIconButton";
import { OptionsMenu } from "../Menu/OptionsMenu";
import ConfirmationModal from "../Modals/ConfirmationModal";
import SuccessOverlay from "../Overlay/SuccessOverlay";

type Props = {
  item: {
    id?: number;
    title: string;
    date: string;
    description?: string;
  };
  onDeleted?: (id: number) => void;
};

export default function MaintenanceCard({ item, onDeleted }: Props) {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const maxLength = 40;
  const title =
    item.title.length > maxLength
      ? `${item.title.slice(0, maxLength - 3)}...`
      : item.title;

  const options = [
    {
      label: "Editar",
      icon: <Ionicons name="create-outline" size={18} color="#FFFFFF" />,
      onPress: () => handleEdit(),
    },
    {
      label: "Eliminar",
      icon: <MaterialIcons name="delete-outline" size={18} color="#FFFFFF" />,
      onPress: () => handleDelete(),
    },
  ];

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const handleEdit = () => {
    setOptionsVisible(false);
    router.push(`/(vehicle)/${id}/(maintenances)/${item.id}/edit`);
  };

  const confirmAction = async () => {
    await deleteMaintenanceById(item.id!);
    setShowConfirm(false);
    setShowSuccess(true);
  };

  return (
    <>
      {optionsVisible && (
        <OptionsMenu
          options={options}
          style={{ top: 120, right: 20 }}
          onClose={() => setOptionsVisible(false)}
        />
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        className="bg-ui-header rounded-xl px-4 py-3 mb-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3 gap-4">
            <MaterialIcons name="build" size={20} color="#B0B0B0" />
            <View className="flex-col">
              <Text className="text-white">{title}</Text>
              <Text className="text-error text-sm">{item.date}</Text>
            </View>
          </View>
          <Ionicons
            name={expanded ? "chevron-down" : "chevron-forward"}
            size={20}
            color="#FE9525"
          />
        </View>

        {expanded && (
          <View className="mt-3 pl-1 pr-1 flex-row justify-between">
            <View>
              <Text className="text-primary font-semibold mb-1">
                Descripción
              </Text>
              {item.description && item.description.trim() !== "" ? (
                <Text className="text-white text-sm mb-2">
                  {item.description}
                </Text>
              ) : (
                <Text className="text-white text-sm mb-2">Sin descripción</Text>
              )}
            </View>
            <CircleIconButton
              size={25}
              style={{ position: "absolute", right: 8, bottom: 8 }}
              icon={
                <Ionicons name="ellipsis-vertical" size={14} color="#B0B0B0" />
              }
              onPress={() => setOptionsVisible((v) => !v)}
            />
          </View>
        )}
      </TouchableOpacity>

      <ConfirmationModal
        visible={showConfirm}
        title="¿Desea eliminar este mantenimiento?"
        onConfirm={confirmAction}
        onCancel={() => setShowConfirm(false)}
      />

      {showSuccess && (
        <SuccessOverlay
          onFinish={() => {
            setShowSuccess(false);
            if (item.id && onDeleted) {
              onDeleted(item.id);
            }
          }}
          loadingText="Eliminando mantenimiento..."
          successText="Mantenimiento eliminado con éxito"
          successIcon={
            <Ionicons name="trash-bin-sharp" size={90} color="#b50202" />
          }
          duration={2000}
        />
      )}
    </>
  );
}
