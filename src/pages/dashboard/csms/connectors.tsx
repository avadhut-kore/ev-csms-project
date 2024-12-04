import Layout from '../../../components/Layout';
import styles from '../../../styles/Connectors.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { Charger } from '@/types/charger';
import { Connector } from '@/types/connector';
import { ConnectorType } from '@/types/connector-type';

export default function Connectors() {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [connectorTypes, setConnectorTypes] = useState<ConnectorType[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [newConnector, setNewConnector] = useState({ name: '', description: '', chargerId: 0, connectorTypeId: 0 });
  const [editConnector, setEditConnector] = useState<Connector | null>(null);
  const router = useRouter();

  const apiUrl = '/connectors'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchChargers();
    fetchConnectorTypes();
    fetchConnectors();
  }, []);

  const fetchConnectors = async () => {
    try {
      const response = await api.get(apiUrl);
      setConnectors(response.data);
    } catch (error: any) {
      console.error('Error fetching connectors:', error);
      if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
      }
    }
  };

  const fetchChargers = async () => {
    try {
      const response = await api.get('/chargers');
      setChargers(response.data);
    } catch (error) {
      console.error('Error fetching chargers:', error);
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

  const createConnector = async () => {
    try {
      await api.post(apiUrl, newConnector);
      setNewConnector({ name: '', description: '', chargerId: 0, connectorTypeId: 0 });
      fetchConnectors(); // Refresh the list
    } catch (error) {
      console.error('Error creating connector:', error);
    }
  };

  const updateConnector = async () => {
    try {
      if (editConnector) {
        await api.put(`${apiUrl}/${editConnector.id}`, editConnector);
        setEditConnector(null);
        fetchConnectors(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating connector:', error);
    }
  };

  const deleteConnector = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchConnectors(); // Refresh the list
    } catch (error) {
      console.error('Error deleting connector:', error);
    }
  };

  return (
    <Layout>
      <div className={styles.connectors}>
        <h2>Manage Connectors</h2>
        <ul className={styles.connectorList}>
          {connectors.map((connector) => (
            <li key={connector.id}>
              <span>{connector.name}</span>
              <button onClick={() => setEditConnector(connector)}>Edit</button>
              <button onClick={() => deleteConnector(connector.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <div className={styles.form}>
          <h3>{editConnector ? 'Edit Connector' : 'Add New Connector'}</h3>
          <input
            type="text"
            placeholder="Name"
            value={editConnector ? editConnector.name : newConnector.name}
            onChange={(e) =>
              editConnector
                ? setEditConnector({ ...editConnector, name: e.target.value })
                : setNewConnector({ ...newConnector, name: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={editConnector ? editConnector.description : newConnector.description}
            onChange={(e) =>
              editConnector
                ? setEditConnector({ ...editConnector, description: e.target.value })
                : setNewConnector({ ...newConnector, description: e.target.value })
            }
          />
          <select
            value={editConnector ? editConnector.chargerId : newConnector.chargerId}
            onChange={(e) =>
              editConnector
                ? setEditConnector({ ...editConnector, chargerId: parseInt(e.target.value) })
                : setNewConnector({ ...newConnector, chargerId: parseInt(e.target.value) })
            }
            required
          >
            <option value="0">Select Charger</option>
            {chargers.map((charger) => (
              <option key={charger.id} value={charger.id}>
                {charger.name}
              </option>
            ))}
          </select>
          <select
            value={editConnector ? editConnector.connectorTypeId : newConnector.connectorTypeId}
            onChange={(e) =>
              editConnector
                ? setEditConnector({ ...editConnector, connectorTypeId: parseInt(e.target.value) })
                : setNewConnector({ ...newConnector, connectorTypeId: parseInt(e.target.value) })
            }
            required
          >
            <option value="0">Select Connector Type</option>
            {connectorTypes.map((connectorType) => (
              <option key={connectorType.id} value={connectorType.id}>
                {connectorType.name}
              </option>
            ))}
          </select>
          <button onClick={editConnector ? updateConnector : createConnector}>
            {editConnector ? 'Update' : 'Create'}
          </button>
          {editConnector && (
            <button onClick={() => setEditConnector(null)} className={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
