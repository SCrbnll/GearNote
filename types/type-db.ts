export interface User {
  id?: number;
  name: string;
}

export interface Vehicle {
  id?: number; 
  name: string; 
  brand: string; 
  model: string;
  year: number; 
  color?: string;
  km_total: number;
  engine: string;
  plate: string;
  technical_sheet?: string;
  additional_info?: string;
  image_uri?: string; 
}

export interface Maintenance {
  id?: number;
  vehicle_id: number;
  date: string; 
  title: string;
  description?: string;
}


export type BackupData = {
  users: UserDB[];
  vehicles: VehicleDB[];
  maintenances: MaintenanceDB[];
  exportedAt?: string;
};

type UserDB = { id: number; name: string };
type VehicleDB = {
  id: number;
  name: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  km_total: number;
  engine: string;
  plate: string;
  technical_sheet: string;
  additional_info: string;
  image_uri: string;
};
type MaintenanceDB = {
  id: number;
  title: string;
  description: string;
  date: string;
  vehicle_id: number;
};