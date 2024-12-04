export interface Connector {
    id: number;
    name: string;
    description: string;

    chargerId: number;
    connectorTypeId: number;
}