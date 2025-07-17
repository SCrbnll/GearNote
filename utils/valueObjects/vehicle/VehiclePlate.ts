export class VehiclePlate {
  private value: string;

  constructor(value: string) {
    if (!value) {
      throw new Error("La matrícula no puede estar vacía.");
    }

    const trimmed = value.trim().toUpperCase();

    const modernPattern = /^[0-9]{4}[A-Z]{3}$/;                 // 1234ABC
    const oldPattern = /^[A-Z]{1,2}\s?[0-9]{4}\s?[A-Z]{1,2}$/; // B 1234 CD o BI1234CD
    const mopedPattern = /^[A-Z]{1,2}-?[0-9]{1,4}$/;           // C-1234, M-23, PM-999

    const isValid =
      modernPattern.test(trimmed) ||
      oldPattern.test(trimmed) ||
      mopedPattern.test(trimmed);

    if (!isValid) {
      throw new Error("La matrícula no tiene un formato válido.");
    }

    this.value = trimmed.replace(/\s+/g, ""); // opcional: quitar espacios
  }

  getValue() {
    return this.value;
  }
}
