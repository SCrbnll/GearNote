export class VehicleColor {
  private value: string;
  constructor(value: string) {
    this.value = value.trim();
  }
  getValue() {
    return this.value;
  }
}