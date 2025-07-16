import { VehicleAdditionalInfo } from "./VehicleAdditionalInfo";
import { VehicleBrand } from "./VehicleBrand";
import { VehicleColor } from "./VehicleColor";
import { VehicleEngine } from "./VehicleEngine";
import { VehicleKilometers } from "./VehicleKilometers";
import { VehicleModel } from "./VehicleModel";
import { VehicleName } from "./VehicleName";
import { VehiclePlate } from "./VehiclePlate";
import { VehicleTechnicalSheet } from "./VehicleTechnicalSheet";
import { VehicleYear } from "./VehicleYear";

export {
  VehicleAdditionalInfo, VehicleBrand, VehicleColor, VehicleEngine, VehicleKilometers, VehicleModel, VehicleName, VehiclePlate,
  VehicleTechnicalSheet, VehicleYear
};

    import type { Vehicle } from "@/types/type-db";

type FieldKey = keyof Vehicle;

export const valueObjectMap: Partial<Record<FieldKey, (value: any) => any>> = {
  name: (v) => new VehicleName(v).getValue(),
  year: (v) => new VehicleYear(Number(v)).getValue(),
  brand: (v) => new VehicleBrand(v).getValue(),
  model: (v) => new VehicleModel(v).getValue(),
  color: (v) => new VehicleColor(v).getValue(),
  km_total: (v) => new VehicleKilometers(Number(v)).getValue(),
  engine: (v) => new VehicleEngine(v).getValue(),
  plate: (v) => new VehiclePlate(v).getValue(),
  technical_sheet: (v) => new VehicleTechnicalSheet(v).getValue(),
  additional_info: (v) => new VehicleAdditionalInfo(v).getValue(),
  image_uri: (v) => new VehicleAdditionalInfo(v).getValue(),
};