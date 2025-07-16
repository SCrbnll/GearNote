export class VehicleName {
  private value: string;
  constructor(value: string) {
    if (!value || value.trim().length < 2) {
      throw new Error("El nombre debe tener al menos 2 caracteres.");
    }
    this.value = value.trim();
  }
  getValue() {
    return this.value;
  }
}