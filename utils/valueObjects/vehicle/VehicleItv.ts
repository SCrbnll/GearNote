export class VehicleItv {
  private value: string;
  private static readonly DATE_REGEX = /^(0[1-9]|1[0-2])\/\d{4}$/;

  constructor(value: string) {
    const trimmed = value.trim();

    if (!VehicleItv.DATE_REGEX.test(trimmed)) {
      throw new Error("La fecha ITV debe tener formato MM/YYYY.");
    }

    const [monthStr, yearStr] = trimmed.split("/");
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const MIN_YEAR = 2000;
    const MAX_FUTURE_YEARS = 4;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (year < MIN_YEAR) {
      throw new Error(`El año ITV no puede ser anterior a ${MIN_YEAR}.`);
    }

    const maxYear = currentYear + MAX_FUTURE_YEARS;
    const maxMonth = currentMonth;

    if (
      year > maxYear ||
      (year === maxYear && month > maxMonth)
    ) {
      throw new Error(`La fecha ITV no puede ser mayor a ${maxMonth.toString().padStart(2, '0')}/${maxYear}.`);
    }

    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }
}
