import type { Maintenance } from "@/types/type-db";
import { MaintenanceDate } from "./MaintenanceDate";
import { MaintenanceDescription } from "./MaintenanceDescription";
import { MaintenanceTitle } from "./MaintenanceTitle";
import { MaintenanceVehicleId } from "./MaintenanceVehicleId";

export {
  MaintenanceDate, MaintenanceDescription, MaintenanceTitle, MaintenanceVehicleId
};

type FieldKey = keyof Maintenance;

export const valueObjectMap: Partial<Record<FieldKey, (value: any) => any>> = {
  date: (v) => new MaintenanceDate(v).getValue(),
  title: (v) => new MaintenanceTitle(v).getValue(),
  description: (v) => new MaintenanceDescription(v).getValue(),
  vehicle_id: (v) => new MaintenanceVehicleId(Number(v)).getValue(),
};