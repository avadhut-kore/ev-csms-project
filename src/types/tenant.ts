export interface Tenant {
    id: number;
    name: string;
    description: string;
    headOfficeAddress: string;
}

export interface TenantDetails {
    id: number;
    name: string;
    description: string;
    headOfficeAddress: string;
    noOfChargingStations: number;
    noOfChargers: number;
}