import { ECO_LABEL_OPTIONS } from "@/constants/global";

export class VehicleEcoLabel {
  private value: string;

  constructor(value: string) {
    const normalized = value.trim().toUpperCase();

    const match = ECO_LABEL_OPTIONS.find(label =>
      label.toUpperCase() === normalized
    );

    if (!match) {
      throw new Error("Debe seleccionar un distintito ambiental.");
    }

    this.value = match;
  }

  getValue(): string {
    return this.value;
  }
}
