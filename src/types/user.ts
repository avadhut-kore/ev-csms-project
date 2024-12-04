export interface User {
    id: number;
    fullName: string;
    mobileNumber: string;

    email: string;
    roles: string;
}

enum UserRole {
    ADMIN,
    TENANT_MANAGER,
    CHARGING_STATION_MANAGER,
    USER
}

export interface CreateManager {
    fullName: string;
    mobileNumber: string;
    email: string;
    password: string;
    entityId: number;
}