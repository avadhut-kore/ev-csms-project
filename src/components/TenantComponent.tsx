import { useEffect, useState } from "react";
import api from '@/lib/axios';
import styles from "../styles/TenantComponent.module.css";
import { Tenant, TenantDetails } from "@/types/tenant";

interface TenantComponentProps {
    tenantId: number;
}

const TenantComponent: React.FC<TenantComponentProps> = ({ tenantId }) => {

    const initialTenant: TenantDetails = {
        id: tenantId,
        name: "",
        description: "",
        headOfficeAddress: "",
        noOfChargingStations: 0,
        noOfChargers: 0,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [tenant, setTenant] = useState<TenantDetails>(initialTenant);
    const [editTenant, setEditTenant] = useState<Tenant>(initialTenant);

    const apiUrl = '/tenants';

    useEffect(() => {
        fetchTenantDetails();
    }, [tenantId]);

    const fetchTenantDetails = async () => {
        try {
            const response = await api.get(`${apiUrl}/${tenantId}`);
            setTenant(response.data);
        } catch (error: any) {
            console.error('Error fetching tenant details:', error);
        }
    };

    const handleEditClick = () => {
        setEditTenant(tenant);
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            if (editTenant) {
                await api.put(`${apiUrl}/${tenantId}`, editTenant);
                setTenant({ ...tenant, ...editTenant });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating tenant:', error);
        }
    };

    const handleCancelClick = () => {
        setEditTenant(tenant);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditTenant({
            ...editTenant,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className={styles.container}>
            {!isEditing ? (
                <div className={styles.details}>
                    <h1>{tenant.name}</h1>
                    <p>{tenant.description}</p>
                    <p>{tenant.headOfficeAddress}</p>
                    <p>No. of Charging Stations: {tenant.noOfChargingStations}</p>
                    <p>No. of Chargers: {tenant.noOfChargers}</p>
                    <button onClick={handleEditClick} className={styles.button}>
                        Edit
                    </button>
                </div>
            ) : (
                <div className={styles.form}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={editTenant.name}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Description:
                        <input
                            type="text"
                            name="description"
                            value={editTenant.description}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <label>
                        Head Office Address:
                        <input
                            type="text"
                            name="headOfficeAddress"
                            value={editTenant.headOfficeAddress}
                            onChange={handleChange}
                            className={styles.inputText}
                        />
                    </label>
                    <button onClick={handleSaveClick} className={styles.button}>
                        Save
                    </button>
                    <button onClick={handleCancelClick} className={styles.button}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default TenantComponent;
