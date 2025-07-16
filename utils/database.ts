import { Maintenance, User, Vehicle } from "@/types/type-db";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("gearnote2.db");

// 🟢 Inicialización de la BD
export async function initDatabase() {
  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        brand TEXT,
        model TEXT,
        year INTEGER,
        color TEXT,
        km_total INTEGER,
        engine TEXT,
        plate TEXT,
        technical_sheet TEXT,
        additional_info TEXT,
        image_uri TEXT
      );

      CREATE TABLE IF NOT EXISTS maintenances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        date TEXT,
        vehicle_id INTEGER,
        FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
      );
    `);
}

// 🟢 Insertar datos
export async function insertUser(name: string) {
  const statement = await db.prepareAsync(
    "INSERT INTO user (name) VALUES ($name)"
  );
  try {
    await statement.executeAsync({ $name: name });
  } finally {
    await statement.finalizeAsync();
  }
}

export async function insertVehicle(vehicle: Vehicle) {
  const statement = await db.prepareAsync(`
      INSERT INTO vehicles (
        name, brand, model, year, color, km_total, engine, plate, technical_sheet, additional_info, image_uri
      ) VALUES (
        $name, $brand, $model, $year, $color, $km_total, $engine, $plate, $technical_sheet, $additional_info, $image_uri
      )
    `);

  try {
    await statement.executeAsync({
      $name: vehicle.name.trim(),
      $brand: vehicle.brand.trim(),
      $model: vehicle.model.trim(),
      $year: String(vehicle.year),
      $color: vehicle.color ? vehicle.color.trim() : "",
      $km_total: vehicle.km_total,
      $engine: vehicle.engine.trim(),
      $plate: vehicle.plate.trim(),
      $technical_sheet: vehicle.technical_sheet ? vehicle.technical_sheet.trim() : "",
      $additional_info: vehicle.additional_info ? vehicle.additional_info.trim() : "",
      $image_uri: vehicle.image_uri ? vehicle.image_uri.trim() : "",
    });
  } finally {
    await statement.finalizeAsync();
  }
}

export async function insertMaintenance(maintenance: Maintenance) {
  const statement = await db.prepareAsync(`
      INSERT INTO maintenances (
        title, description, date, vehicle_id
      ) VALUES (
        $title, $description, $date, $vehicle_id
      )`);
  try {
    await statement.executeAsync({
      $title: maintenance.title,
      $description: maintenance.description ?? null,
      $date: maintenance.date,
      $vehicle_id: maintenance.vehicle_id,
    });
  } finally {
    await statement.finalizeAsync();
  }
}

// 🟡 Modificar datos
export async function updateVehicle(vehicle: Vehicle) {
  const statement = await db.prepareAsync(`
      UPDATE vehicles SET
        name = $name,
        brand = $brand,
        model = $model,
        year = $year,
        color = $color,
        km_total = $km_total,
        engine = $engine,
        plate = $plate,
        technical_sheet = $technical_sheet,
        additional_info = $additional_info,
        image_uri = $image_uri
      WHERE id = $id
    `);
  try {
    await statement.executeAsync({
      $id: vehicle.id ?? null,
      $name: vehicle.name.trim(),
      $brand: vehicle.brand.trim(),
      $model: vehicle.model.trim(),
      $year: String(vehicle.year),
      $color: vehicle.color ? vehicle.color.trim() : "",
      $km_total: vehicle.km_total,
      $engine: vehicle.engine.trim(),
      $plate: vehicle.plate.trim(),
      $technical_sheet: vehicle.technical_sheet ? vehicle.technical_sheet.trim() : "",
      $additional_info: vehicle.additional_info ? vehicle.additional_info.trim() : "",
      $image_uri: vehicle.image_uri ? vehicle.image_uri.trim() : "",
    });
  } finally {
    await statement.finalizeAsync();
  }
}

export async function updateVehicleNotes(vehicleId: number, notes: string) {
  const statement = await db.prepareAsync(`
      UPDATE vehicles SET
        additional_info = $notes
      WHERE id = $id
    `);
  try {
    await statement.executeAsync({
      $id: vehicleId,
      $notes: notes,
    });
  } finally {
    await statement.finalizeAsync();
  }
}

export async function updateMaintenance(maintenance: Maintenance) {
  const statement = await db.prepareAsync(`
      UPDATE maintenances SET
        title = $title,
        description = $description,
        date = $date,
        vehicle_id = $vehicle_id
      WHERE id = $id
    `);
  try {
    await statement.executeAsync({
      $id: maintenance.id ?? null,
      $title: maintenance.title,
      $description: maintenance.description ?? null,
      $date: maintenance.date,
      $vehicle_id: maintenance.vehicle_id,
    });
  } finally {
    await statement.finalizeAsync();
  }
}

// 🟣 Obtener datos
export async function getUserName(): Promise<User | null> {
  const result = await db.getFirstAsync("SELECT * FROM user");
  return result as User | null;
}
export async function getAllVehicles(): Promise<Vehicle[]> {
  const result = await db.getAllAsync("SELECT * FROM vehicles");
  return result as Vehicle[];
}

export async function getAllMaintenances(): Promise<Maintenance[]> {
  const result = await db.getAllAsync("SELECT * FROM maintenances");
  return result as Maintenance[];
}

export async function getVehicleById(id: number): Promise<Vehicle | null> {
  const statement = await db.prepareAsync(`
      SELECT * FROM vehicles WHERE id = $id
    `);
  try {
    const result = await statement.executeAsync({ $id: id });
    return (await result.getFirstAsync()) as Vehicle | null;
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getMaintenancesByVehicleId(
  vehicleId: number
): Promise<Maintenance[]> {
  const statement = await db.prepareAsync(`
      SELECT * FROM maintenances WHERE vehicle_id = $vehicle_id
    `);
  try {
    const result = await statement.executeAsync({ $vehicle_id: vehicleId });
    return (await result.getAllAsync()) as Maintenance[];
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getMaintenanceById(id: number): Promise<Maintenance> {
  const statement = await db.prepareAsync(`
      SELECT * FROM maintenances WHERE id = $id
    `);
  try {
    const result = await statement.executeAsync({ $id: id });
    return (await result.getFirstAsync()) as Maintenance;
  } finally {
    await statement.finalizeAsync();
  }
}

// 🔴 Eliminar datos
export async function deleteVehicleById(id: number) {
  const statement = await db.prepareAsync(
    "DELETE FROM vehicles WHERE id = $id"
  );
  try {
    await statement.executeAsync({ $id: id });
  } finally {
    await statement.finalizeAsync();
  }
}

export async function deleteMaintenanceById(id: number) {
  await db.execAsync(`DELETE FROM maintenances WHERE id = ${id}`);
}

export async function deleteVehicleAndMaintenancesById(id: number) {
  try {
    const maintenances = await getMaintenancesByVehicleId(id);
    for (const maintenance of maintenances) {
      await deleteMaintenanceById(maintenance.id!);
    }
    await deleteVehicleById(id);
  } catch (error) {
    console.error("❌ Error al eliminar vehículo y mantenimientos:", error);
  }
}


export async function clearDatabase() {
  try {
    await db.execAsync(`
      DELETE FROM maintenances;
      DELETE FROM vehicles;
      DELETE FROM user;
      `);
  } catch (error) {
    console.error("Error al limpiar la base de datos:", error);
  }
}

// ⚪ Verificación
export async function checkUserTableExists(): Promise<boolean> {
  const result = await db.getFirstAsync(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='user'
  `);
  return !!result;
}

export async function hasAnyUserWithTimeout(timeoutMs = 3000): Promise<boolean> {
  try {
    const result = await Promise.race([
      db.getFirstAsync(`SELECT COUNT(*) as count FROM user`),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout alcanzado")), timeoutMs)
      )
    ]);
    return !!(result && (result as any).count > 0);
  } catch (error: any) {
    console.warn("Error comprobando usuario o timeout:", error.message);
    return false;
  }
}


export default db;