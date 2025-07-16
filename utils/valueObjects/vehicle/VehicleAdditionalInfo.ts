export class VehicleAdditionalInfo {
  private value: string;
  constructor(value: string) {
    this.value = value.trim();
  }
  getValue() {
    return this.value;
  }
}