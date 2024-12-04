import Layout from '../../../components/Layout';
import styles from '../../../styles/Chargers.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { Charger } from '@/types/charger';
import { ChargerOEM } from '@/types/charger-oem';
import { ChargerType } from '@/types/charger-type';
import { ChargingStation } from '@/types/charging-station';

export default function Chargers() {
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);
  const [chargerOems, setChargerOEMs] = useState<ChargerOEM[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [newCharger, setNewCharger] = useState({ name: '', description: '', chargingStationId: 0, chargerTypeId: 0, chargerOemId: 0 });
  const [editCharger, setEditCharger] = useState<Charger | null>(null);
  const router = useRouter();

  const apiUrl = '/chargers'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchChargingStations();
    fetchChargerTypes();
    fetchChargerOEMs();
    fetchChargers();
  }, []);

  const fetchChargers = async () => {
    try {
      const response = await api.get(apiUrl);
      setChargers(response.data);
    } catch (error: any) {
      console.error('Error fetching chargers:', error);
      if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
      }
    }
  };

  const fetchChargingStations = async () => {
    try {
      const response = await api.get('/charging-stations');
      setChargingStations(response.data);
    } catch (error) {
      console.error('Error fetching chargingStations:', error);
    }
  };

  const fetchChargerTypes = async () => {
    try {
      const response = await api.get('/charger-types');
      setChargerTypes(response.data);
    } catch (error) {
      console.error('Error fetching charger types:', error);
    }
  };

  const fetchChargerOEMs = async () => {
    try {
      const response = await api.get('/charger-oems');
      setChargerOEMs(response.data);
    } catch (error) {
      console.error('Error fetching charger OEMs:', error);
    }
  };

  const createCharger = async () => {
    try {
      await api.post(apiUrl, newCharger);
      setNewCharger({ name: '', description: '', chargingStationId: 0, chargerTypeId: 0, chargerOemId: 0 });
      fetchChargers(); // Refresh the list
    } catch (error) {
      console.error('Error creating charger:', error);
    }
  };

  const updateCharger = async () => {
    try {
      if (editCharger) {
        await api.put(`${apiUrl}/${editCharger.id}`, editCharger);
        setEditCharger(null);
        fetchChargers(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating charger:', error);
    }
  };

  const deleteCharger = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchChargers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting charger:', error);
    }
  };

  return (
    <Layout>
      <div className={styles.chargers}>
        <h2>Manage Chargers</h2>
        <ul className={styles.chargerList}>
          {chargers.map((charger) => (
            <li key={charger.id}>
              <span>{charger.name}</span>
              <button onClick={() => setEditCharger(charger)}>Edit</button>
              <button onClick={() => deleteCharger(charger.id)}>Delete</button>
            </li>
          ))}
        </ul>
        <div className={styles.form}>
          <h3>{editCharger ? 'Edit Charger' : 'Add New Charger'}</h3>
          <input
            type="text"
            placeholder="Name"
            value={editCharger ? editCharger.name : newCharger.name}
            onChange={(e) =>
              editCharger
                ? setEditCharger({ ...editCharger, name: e.target.value })
                : setNewCharger({ ...newCharger, name: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            value={editCharger ? editCharger.description : newCharger.description}
            onChange={(e) =>
              editCharger
                ? setEditCharger({ ...editCharger, description: e.target.value })
                : setNewCharger({ ...newCharger, description: e.target.value })
            }
          />
          <select
            value={editCharger ? editCharger.chargingStationId : newCharger.chargingStationId}
            onChange={(e) =>
              editCharger
                ? setEditCharger({ ...editCharger, chargingStationId: parseInt(e.target.value) })
                : setNewCharger({ ...newCharger, chargingStationId: parseInt(e.target.value) })
            }
            required
          >
            <option value="0">Select ChargingStation</option>
            {chargingStations.map((chargingStation) => (
              <option key={chargingStation.id} value={chargingStation.id}>
                {chargingStation.name}
              </option>
            ))}
          </select>
          <select
            value={editCharger ? editCharger.chargerTypeId : newCharger.chargerTypeId}
            onChange={(e) =>
              editCharger
                ? setEditCharger({ ...editCharger, chargerTypeId: parseInt(e.target.value) })
                : setNewCharger({ ...newCharger, chargerTypeId: parseInt(e.target.value) })
            }
            required
          >
            <option value="0">Select Charger Type</option>
            {chargerTypes.map((chargerType) => (
              <option key={chargerType.id} value={chargerType.id}>
                {chargerType.name}
              </option>
            ))}
          </select>
          <select
            value={editCharger ? editCharger.chargerOemId : newCharger.chargerOemId}
            onChange={(e) =>
              editCharger
                ? setEditCharger({ ...editCharger, chargerOemId: parseInt(e.target.value) })
                : setNewCharger({ ...newCharger, chargerOemId: parseInt(e.target.value) })
            }
            required
          >
            <option value="0">Select Charger OEM</option>
            {chargerOems.map((chargerOem) => (
              <option key={chargerOem.id} value={chargerOem.id}>
                {chargerOem.name}
              </option>
            ))}
          </select>
          <button onClick={editCharger ? updateCharger : createCharger}>
            {editCharger ? 'Update' : 'Create'}
          </button>
          {editCharger && (
            <button onClick={() => setEditCharger(null)} className={styles.cancelButton}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
