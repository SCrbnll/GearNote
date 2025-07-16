import { Maintenance } from "@/types/type-db";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import React from "react";
import { KeyboardTypeOptions } from "react-native";

export const DEFAULT_VEHICLE_IMAGE = require("@/assets/images/vehicle_banner.jpg");
export const DEFAULT_PFP = require("@/assets/images/user_pfp.png");
export const APP_ICON = require("@/assets/images/gearnote-icon.png");
export const SCRBNLL_WEB = "https://samuelcg.com";
export const VERSION_APP = "2.0.1";
export const DB_NAME = "gearnote.db";
export const DB_PATH = FileSystem.documentDirectory + DB_NAME

export interface Vehicle {
  name: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  km_total: number;
  engine: string;
  plate: string;
  technical_sheet: string;
  additional_info: string;
  image_uri: string;
}

export const INPUT_FIELDS_VEHICLE: {
  label: string;
  field: keyof Vehicle;
  placeholder?: string;
  icon: React.ReactNode;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}[] = [
  {
    label: "Nombre (Mote) *",
    field: "name",
    placeholder: "Ej: Mi coche",
    icon: <FontAwesome5 name="id-badge" solid size={18} color="#FE9525" />,
  },
  {
    label: "Marca *",
    field: "brand",
    placeholder: "Ej: Honda",
    icon: <MaterialCommunityIcons name="tools" size={18} color="#FE9525" />,
  },
  {
    label: "Modelo *",
    field: "model",
    placeholder: "Ej: Civic",
    icon: <FontAwesome5 name="car" solid size={18} color="#FE9525" />,
  },
  {
    label: "Año *",
    field: "year",
    keyboardType: "numeric",
    icon: <Ionicons name="calendar" size={18} color="#FE9525" />,
  },
  {
    label: "Color",
    field: "color",
    placeholder: "Ej: Negro",
    icon: <Ionicons name="color-palette" size={18} color="#FE9525" />,
  },
  {
    label: "Kilómetros totales *",
    field: "km_total",
    placeholder: "0",
    keyboardType: "numeric",
    icon: <MaterialIcons name="speed" size={18} color="#FE9525" />,
  },
  {
    label: "Motor *",
    field: "engine",
    placeholder: "Ej: 1.6",
    icon: <FontAwesome5 name="oil-can" solid size={18} color="#FE9525" />,
  },
  {
    label: "Matrícula *",
    field: "plate",
    placeholder: "Ej: 1234ABC",
    icon: <FontAwesome5 name="tag" solid size={18} color="#FE9525" />,
  },
  {
    label: "Ficha técnica (URL)",
    field: "technical_sheet",
    placeholder: "https://ejemplo.com/ficha.pdf",
    keyboardType: "url",
    icon: <MaterialIcons name="description" size={18} color="#FE9525" />,
  },
  {
    label: "Información adicional",
    field: "additional_info",
    multiline: true,
    icon: <Ionicons name="document-sharp" size={18} color="#FE9525" />,
  },
];

export const INPUT_FIELDS_MAINTENANCE: {
  label: string;
  field: keyof Maintenance;
  placeholder?: string;
  icon?: React.ReactNode;
  keyboardType?: "default" | "numeric" | "url";
  multiline?: boolean;
  numberOfLines?: number;
}[] = [
  {
    label: "Fecha *",
    field: "date",
    placeholder: "Ej: 01/01/2001",
    keyboardType: "numeric",
    icon: <Ionicons name="calendar" size={18} color="#FE9525" />,
  },
  {
    label: "Título *",
    field: "title",
    placeholder: "Ej: Cambio de aceite",
    icon: <MaterialCommunityIcons name="tools" size={18} color="#FE9525" />,
  },
  {
    label: "Descripción",
    field: "description",
    placeholder: "Describe el mantenimiento...",
    multiline: true,
    numberOfLines: 6,
    icon: <Ionicons name="document-text" size={18} color="#FE9525" />,
  },
];
