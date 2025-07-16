export class MaintenanceVehicleId {
  private value: number;
  constructor(value: number) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("El ID del vehículo debe ser un número válido.");
    }
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}