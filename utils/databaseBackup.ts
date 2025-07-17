import { BackupData } from "@/types/type-db";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import db, { initDatabase } from "./database";

async function getTableColumns(tableName: string): Promise<string[]> {
  const result = await db.getAllAsync(`PRAGMA table_info(${tableName})`);
  return result.map((col: any) => col.name);
}

function fillMissingFields<T extends Record<string, any>>(
  data: T,
  columns: string[]
): T {
  const filled: any = {};
  for (const col of columns) {
    filled[col] = data[col] ?? (typeof data[col] === "number" ? 0 : "");
  }
  return filled;
}

export async function exportDatabaseToJSON(): Promise<void> {
  try {
    const tables = ["user", "vehicles", "maintenances"];
    const fullData: any = {};

    for (const table of tables) {
      const rows = await db.getAllAsync(`SELECT * FROM ${table}`);
      fullData[table] = rows;
    }

    fullData.exportedAt = new Date().toISOString();

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

    const tableConfigs = [
      { name: "user", data: data.users },
      { name: "vehicles", data: data.vehicles },
      { name: "maintenances", data: data.maintenances },
    ];

    for (const { name, data: rows } of tableConfigs) {
      const columns = await getTableColumns(name);
      const placeholders = columns.map(() => "?").join(", ");
      const insertSQL = `INSERT INTO ${name} (${columns.join(", ")}) VALUES (${placeholders})`;

      for (const row of rows) {
        const filledRow = fillMissingFields(row, columns);

       if (name === "vehicles" && "image_uri" in filledRow && typeof filledRow.image_uri === "string") {
        filledRow.image_uri = await getValidImageUri(filledRow.image_uri);
      }

        const values = columns.map((col) => (filledRow as any)[col]);
        await db.runAsync(insertSQL, values);
      }
    }

    return true;
  } catch (error) {
    console.error("Error al restaurar datos:", error);
    throw error;
  }
}

export async function getValidImageUri(imageUri: string): Promise<string> {
  const fileInfo = await FileSystem.getInfoAsync(imageUri);

  if (fileInfo.exists) {
    return imageUri;
  } else {
    return "";
  }
}
