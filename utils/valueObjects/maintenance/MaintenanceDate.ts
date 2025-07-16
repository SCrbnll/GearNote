export class MaintenanceDate {
  private value: string;
  private static readonly DATE_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  constructor(value: string) {
    if (!MaintenanceDate.DATE_REGEX.test(value)) {
      throw new Error("La fecha debe tener formato DD/MM/YYYY.");
    }
    const [_, day, month, year] = value.match(MaintenanceDate.DATE_REGEX)!;

    const date = new Date(`${year}-${month}-${day}`);

    if (
      date.getDate() !== Number(day) ||
      date.getMonth() + 1 !== Number(month) ||
      date.getFullYear() !== Number(year)
    ) {
      throw new Error("La fecha no es válida.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date > today) {
      throw new Error("La fecha no puede ser superior a la fecha actual.");
    }

    this.value = value;
  }

  getValue() {
    return this.value;
  }
}
