export class VehicleKilometers {
  private value: number;

  constructor(value: number) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Los kilómetros deben ser un número válido.");
    }

    if (value < 0) {
      throw new Error("Los kilómetros no pueden ser negativos.");
    }

    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
