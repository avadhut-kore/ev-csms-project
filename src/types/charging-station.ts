import { Amenity } from "./amenity";



export interface OperationalTiming {
  openTime: string;
  closeTime: string;
}

export interface DayData {
  day: string;
  isOpen: boolean;
  operationalTiming: OperationalTiming;
}


export interface ChargingStation {
  id: number;
  name: string;
  description: string;
  address: string;
  pincode: string;
  latitude: number;
  longitude: number;
  tenantId: number;
  open: boolean;
  isOpen24x7: boolean;
  operationalHours: DayData[] | null
  amenity: Amenity;
}