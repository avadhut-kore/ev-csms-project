import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import styles from '../styles/ChargerConnectorsComponent.module.css';
import { Connector } from '@/types/connector';
import { ConnectorType } from '@/types/connector-type';

interface ChargerConnectorsComponentProps {
    chargerId: number; // chargerId is passed as a prop
}

const ChargerConnectorsComponent: React.FC<ChargerConnectorsComponentProps> = ({ chargerId }) => {
    const [connectors, setConnectors] = useState<Connector[]>([]);
    const [connectorTypes, setConnectorTypes] = useState<ConnectorType[]>([]);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [newRow, setNewRow] = useState<Connector>({ id: 0, name: '', description: '', chargerId: chargerId, connectorTypeId: 0 });
    const [error, setError] = useState<string | null>(null); // State to hold error messages
    const [loading, setLoading] = useState<boolean>(false); // State to track loading state

    // Fetch data from the API (READ operation)
    useEffect(() => {
        setLoading(true); // Set loading state to true
        fetchConnectors();
        fetchConnectorTypes();
        setLoading(false);
    }, []);

    const fetchConnectors = async () => {
        try {
            const response = await api.get(`/chargers/${chargerId}/connectors`);
            setConnectors(response.data);
        } catch (error) {
            console.error('Error fetching connectors:', error);
        }
    };

    const fetchConnectorTypes = async () => {
        try {
            const response = await api.get('/connector-types');
            setConnectorTypes(response.data);
        } catch (error) {
            console.error('Error fetching connector types:', error);
        }
    };

    // Handle adding a new row
    const handleAddRow = () => {
        if (!newRow.name || !newRow.description || !newRow.connectorTypeId) {
            setError('All fields are required to add a new connector.');
            return;
        }

        setLoading(true);
        api.post('/connectors', newRow)
            .then(response => {
                setConnectors([...connectors, response.data]);
                setNewRow({ id: 0, name: '', description: '', chargerId: chargerId, connectorTypeId: 0 });
                setError(null);
            })
            .catch(error => setError('Error adding row. Please try again.'))
            .finally(() => setLoading(false));
    };

    // Handle saving an edited row
    const handleSaveRow = (rowId: number) => {
        const updatedRow = connectors.find(row => row.id === rowId);
        if (updatedRow) {
            setLoading(true);
            api.put(`/connectors/${rowId}`, updatedRow)
                .then(response => {
                    setConnectors(connectors.map(row => (row.id === rowId ? response.data : row)));
                    setEditingRowId(null);
                    setError(null);
                })
                .catch(error => setError('Error saving changes. Please try again.'))
                .finally(() => setLoading(false));
        }
    };

    // Handle deleting a row
    const handleDeleteRow = (rowId: number) => {
        setLoading(true);
        api.delete(`/connectors/${rowId}`)
            .then(() => {
                setConnectors(connectors.filter(row => row.id !== rowId));
                setError(null);
            })
            .catch(error => setError('Error deleting row. Please try again.'))
            .finally(() => setLoading(false));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, rowId: number) => {
        const { name, value } = e.target;
        setConnectors(connectors.map(row => row.id === rowId ? { ...row, [name]: value } : row));
    };

    const handleNewRowChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewRow({ ...newRow, [name]: value });
    };

    return (
        <div className={styles.container}>
            {loading && <p>Loading...</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Connector Name</th>
                        <th>Description</th>
                        <th>Connector Type Id</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {connectors.map((row) => (
                        <tr key={row.id}>
                            <td>
                                {editingRowId === row.id ? (
                                    <input
                                        name="name"
                                        value={row.name}
                                        onChange={(e) => handleInputChange(e, row.id)}
                                        className={styles.input}
                                    />
                                ) : (
                                    row.name
                                )}
                            </td>
                            <td>
                                {editingRowId === row.id ? (
                                    <input
                                        name="description"
                                        value={row.description}
                                        onChange={(e) => handleInputChange(e, row.id)}
                                        className={styles.input}
                                    />
                                ) : (
                                    row.description
                                )}
                            </td>
                            <td>
                                {editingRowId === row.id ? (
                                    <select
                                        name="connectorTypeId"
                                        value={row.connectorTypeId}
                                        onChange={(e) => handleInputChange(e, row.id)}
                                        className={styles.input}
                                    >
                                        <option value="0">Select Connector Type</option>
                                        {connectorTypes.map((connectorType) => (
                                            <option key={connectorType.id} value={connectorType.id}>
                                                {connectorType.name}
                                            </option>
                                        ))}
                                    </select>

                                ) : (
                                    connectorTypes.find((connectorType) => connectorType.id === row.connectorTypeId)?.name
                                )}
                            </td>
                            <td>
                                <div className={styles.actionButtons}>
                                    {editingRowId === row.id ? (
                                        <button onClick={() => handleSaveRow(row.id)} className={styles.saveButton}>Save</button>
                                    ) : (
                                        <button onClick={() => setEditingRowId(row.id)} className={styles.editButton}>Edit</button>
                                    )}
                                    <button onClick={() => handleDeleteRow(row.id)} className={styles.deleteButton}>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>
                            <input
                                name="name"
                                value={newRow.name}
                                onChange={handleNewRowChange}
                                className={styles.input}
                            />
                        </td>
                        <td>
                            <input
                                name="description"
                                value={newRow.description}
                                onChange={handleNewRowChange}
                                className={styles.input}
                            />
                        </td>
                        <td>


                            <select
                                name="connectorTypeId"
                                value={newRow.connectorTypeId}
                                onChange={handleNewRowChange}
                                className={styles.input}
                            >
                                <option value="0">Select Connector Type</option>
                                {connectorTypes.map((connectorType) => (
                                    <option key={connectorType.id} value={connectorType.id}>
                                        {connectorType.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button onClick={handleAddRow} className={styles.addButton}>Add</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ChargerConnectorsComponent;
