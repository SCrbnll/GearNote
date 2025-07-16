export class VehicleTechnicalSheet {
  private value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (trimmed && !/^https?:\/\/.+/i.test(trimmed)) {
      throw new Error("La URL de la ficha técnica no es válida.");
    }
    this.value = trimmed;
  }

  getValue() {
    return this.value;
  }
}
