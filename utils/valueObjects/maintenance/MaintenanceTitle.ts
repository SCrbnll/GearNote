export class MaintenanceTitle {
  private value: string;
  constructor(value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error("El título debe tener al menos 3 caracteres.");
    }
    this.value = value.trim();
  }
  getValue() {
    return this.value;
  }
}