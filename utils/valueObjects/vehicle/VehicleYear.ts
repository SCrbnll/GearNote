export class VehicleYear {
  private value: number;
  constructor(value: number) {
    const currentYear = new Date().getFullYear();
    if (value < 1900 || value > currentYear + 1) {
      throw new Error(`El año debe estar entre 1900 y ${currentYear + 1}`);
    }
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}