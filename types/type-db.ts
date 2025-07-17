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
  additional_info?: string;
  image_uri?: string;
  fuel?: string;
  itv?: string;
  eco_label?: string; 
}

export interface Maintenance {
  id?: number;
  vehicle_id: number;
  date: string; 
  title: string;
  description?: string;
}


export type BackupData = {
  user: UserDB[];
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
  additional_info: string;
  image_uri: string;
  fuel: string;
  itv: string;
  eco_label: string;
};
type MaintenanceDB = {
  id: number;
  title: string;
  description: string;
  date: string;
  vehicle_id: number;
};