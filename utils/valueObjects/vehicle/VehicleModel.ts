export class VehicleModel {
  private value: string;
  constructor(value: string) {
    if (!value || value.trim().length < 1) {
      throw new Error("El modelo es obligatorio.");
    }
    this.value = value.trim();
  }
  getValue() {
    return this.value;
  }
}