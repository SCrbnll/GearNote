import { FUEL_OPTIONS } from "@/constants/global";

export class VehicleFuel {
  private value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();
    const match = FUEL_OPTIONS.find(
      f => f.toLowerCase() === normalized
    );

    if (!match) {
      throw new Error("Debe seleccionar un tipo de combustible.");
    }

    this.value = match;
  }

  getValue(): string {
    return this.value;
  }
}
