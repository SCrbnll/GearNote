export class VehicleImageUri {
  private value: string;
  constructor(value: string) {
    if (value && !value.startsWith("file://") && !value.startsWith("http")) {
      throw new Error("La imagen debe ser una URI válida.");
    }
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}