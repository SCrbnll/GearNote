export interface User {
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
}


export interface Maintenance {
  id?: number;
  vehicle_id: number;
  date: string; 
  title: string;
  description?: string;
}