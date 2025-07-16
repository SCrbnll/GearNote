export class VehiclePlate {
  private value: string;
  constructor(value: string) {
    const pattern = /^[0-9]{4}[A-Z]{3}$/i;
    if (!value || !pattern.test(value.trim())) {
      throw new Error("La matrícula debe tener formato válido (ej: 1234ABC).");
    }
    this.value = value.trim().toUpperCase();
  }
  getValue() {
    return this.value;
  }
}
