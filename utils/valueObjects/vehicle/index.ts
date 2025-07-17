import { VehicleAdditionalInfo } from "./VehicleAdditionalInfo";
import { VehicleBrand } from "./VehicleBrand";
import { VehicleColor } from "./VehicleColor";
import { VehicleEcoLabel } from "./VehicleEcoLabel";
import { VehicleEngine } from "./VehicleEngine";
import { VehicleFuel } from "./VehicleFuel";
import { VehicleItv } from "./VehicleItv";
import { VehicleKilometers } from "./VehicleKilometers";
import { VehicleModel } from "./VehicleModel";
import { VehicleName } from "./VehicleName";
import { VehiclePlate } from "./VehiclePlate";
import { VehicleYear } from "./VehicleYear";

export {
  VehicleAdditionalInfo, VehicleBrand, VehicleColor, VehicleEcoLabel, VehicleEngine, VehicleFuel, VehicleItv, VehicleKilometers, VehicleModel, VehicleName, VehiclePlate,
  VehicleYear
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
  additional_info: (v) => new VehicleAdditionalInfo(v).getValue(),
  image_uri: (v) => new VehicleAdditionalInfo(v).getValue(),
  itv: (v) => new VehicleItv(v).getValue(),
  fuel: (v) => new VehicleFuel(v).getValue(),
  eco_label: (v) => new VehicleEcoLabel(v).getValue(),
};