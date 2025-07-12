import { BackupData } from "@/types/type-db";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import db, { initDatabase } from "./database";

export async function exportDatabaseToJSON(): Promise<void> {
  try {
    const users = await db.getAllAsync("SELECT * FROM user");
    const vehicles = await db.getAllAsync("SELECT * FROM vehicles");
    const maintenances = await db.getAllAsync("SELECT * FROM maintenances");

    const fullData = {
      users,
      vehicles,
      maintenances,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(fullData, null, 2); 

    const fileUri = FileSystem.documentDirectory + "gearnote-backup.json";

    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Exportar datos de GearNote",
      });
    } else {
      console.warn("Compartir no está disponible en este dispositivo.");
    }
  } catch (error) {
    console.error("Error exportando base de datos:", error);
    throw error;
  }
}

export async function restoreDatabaseFromJSON(data: BackupData) {
  try {
    await initDatabase();

    for (const user of data.users) {
      await db.runAsync(
        `INSERT INTO user (id, name) VALUES (?, ?)`,
        [user.id, user.name]
      );
    }

    for (const vehicle of data.vehicles) {
      await db.runAsync(
        `INSERT INTO vehicles 
        (id, name, brand, model, year, color, km_total, engine, plate, technical_sheet, additional_info)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.id,
          vehicle.name,
          vehicle.brand,
          vehicle.model,
          vehicle.year,
          vehicle.color,
          vehicle.km_total,
          vehicle.engine,
          vehicle.plate,
          vehicle.technical_sheet,
          vehicle.additional_info,
        ]
      );
    }

    for (const maintenance of data.maintenances) {
      await db.runAsync(
        `INSERT INTO maintenances (id, title, description, date, vehicle_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          maintenance.id,
          maintenance.title,
          maintenance.description,
          maintenance.date,
          maintenance.vehicle_id,
        ]
      );
    }

    return true;
  } catch (error) {
    console.error("Error al restaurar datos:", error);
    throw error;
  }
}

