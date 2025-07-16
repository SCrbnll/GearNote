export class VehicleKilometers {
  private value: number;
  constructor(value: number) {
    if (value < 0) {
      throw new Error("Los kilómetros no pueden ser negativos.");
    }
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}