import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Charger } from '@/types/charger';
import styles from '../styles/ChargingStationChargersComponent.module.css';
import { ChargerType } from '@/types/charger-type';
import { ChargerOEM } from '@/types/charger-oem';
import ChargerConnectorsComponent from './ChargerConnectorsComponent';
import { ChargerModel } from '@/types/charger-model';

interface ChargingStationChargersComponentProps {
  chargingStationId: number; // chargingStationId is passed as a prop
}

const ChargingStationChargersComponent: React.FC<ChargingStationChargersComponentProps> = ({ chargingStationId }) => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [newCharger, setNewCharger] = useState({ name: '', description: '', chargerTypeId: 0, chargerOemId: 0, chargerModelId: 0, chargingStationId: chargingStationId });
  const [editCharger, setEditCharger] = useState<Charger | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof Charger, order: 'asc' });
  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);
  const [chargerOems, setChargerOEMs] = useState<ChargerOEM[]>([]);
  const [chargerModels, setChargerModels] = useState<ChargerModel[]>([]);


  const apiUrl = '/chargers'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchChargerTypes();
    fetchChargerOEMs();
    fetchChargers();
  }, [chargingStationId]); // Depend on chargingStationId to re-fetch if it changes

  // Fetch charger models based on selected charger type and OEM
  useEffect(() => {
    if (newCharger.chargerTypeId && newCharger.chargerOemId) {
      api.get(`/charger-models/charger-type/${newCharger.chargerTypeId}/charger-oem/${newCharger.chargerOemId}`)
        .then(response => {
          setChargerModels(response.data);
          setNewCharger(prevState => ({
            ...prevState,
            chargerModelId: response.data.length > 0 ? response.data[0].id : 0 // Default to first model
          }));
        })
        .catch(error => console.error('Error fetching charger models:', error));
    } else {
      setChargerModels([]);
    }
  }, [newCharger.chargerTypeId, newCharger.chargerOemId]); // Fetch models when type or OEM changes

  useEffect(() => {
    if (editCharger?.chargerTypeId && editCharger.chargerOemId) {
      api.get(`/charger-models/charger-type/${editCharger.chargerTypeId}/charger-oem/${editCharger.chargerOemId}`)
        .then(response => {
          setChargerModels(response.data);
          setEditCharger(prevState =>
            prevState
              ? {
                ...prevState,
                chargerModelId: response.data.length > 0 ? editCharger?.chargerModelId : 0 // Default to first model
              }
              : null
          );
        })
        .catch(error => console.error('Error fetching charger models:', error));
    } else {
      setChargerModels([]);
    }
  }, [editCharger?.chargerTypeId, editCharger?.chargerOemId]); // Fetch models when type or OEM changes


  const fetchChargers = async () => {
    try {
      const response = await api.get(`/charging-stations/${chargingStationId}/chargers`);
      setChargers(response.data);
    } catch (error: any) {
      console.error('Error fetching chargers:', error);
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
      setNewCharger({ name: '', description: '', chargingStationId: chargingStationId, chargerTypeId: 0, chargerOemId: 0, chargerModelId: 0 });
      fetchChargers(); // Refresh the list
      setShowForm(false);
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
        setShowForm(false);
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

  // Create a filtered and sorted list of Types based on search and sort
  const filteredChargers = chargers
    .filter((chargingStation) => {
      const query = searchQuery.toLowerCase();
      return (
        chargingStation.name.toLowerCase().includes(query) ||
        chargingStation.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const field = sortOrder.field;
      if (typeof a[field] === 'string' && typeof b[field] === 'string') {
        // Use localeCompare for string fields (name and description)
        return sortOrder.order === 'asc'
          ? (a[field] as string).localeCompare(b[field] as string)
          : (b[field] as string).localeCompare(a[field] as string);
      } else if (typeof a[field] === 'number' && typeof b[field] === 'number') {
        // Use normal comparison for number fields (id)
        return sortOrder.order === 'asc' ? a[field] - b[field] : b[field] - a[field];
      }
      return 0;
    });

  const handleEditClick = (charger: Charger) => {
    setEditCharger(charger);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditCharger(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setEditCharger(null);
    setNewCharger({ name: '', description: '', chargingStationId: chargingStationId, chargerTypeId: 0, chargerOemId: 0, chargerModelId: 0 });
    setShowForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [keyof Charger, 'asc' | 'desc'];
    setSortOrder({ field, order });
  };

  // Handler for form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditCharger(prevState =>
      prevState
        ? {
          ...prevState,
          [name]: value
        }
        : null
    );

    setNewCharger(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.chargers}>

        {!showForm && (
          <>
            <div className={styles.searchSortContainer}>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search Types..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />

              {/* Sort Dropdown */}
              <select onChange={handleSortChange} className={styles.sortDropdown}>
                <option value="name-asc">Sort by Name (A-Z)</option>
                <option value="name-desc">Sort by Name (Z-A)</option>
                <option value="description-asc">Sort by Description (A-Z)</option>
                <option value="description-desc">Sort by Description (Z-A)</option>
              </select>

              <button onClick={handleAddClick} className={styles.addNewButton}>Add</button>
            </div>
            <ul className={styles.chargerList}>
              {filteredChargers.map((charger) => (
                <li key={charger.id}>
                  <div>
                    <span className={styles.chargerName}>{charger.name}</span>
                    <p className={styles.chargerDescription}>{charger.description}</p>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEditClick(charger)}>Edit</button>
                    <button onClick={() => deleteCharger(charger.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {showForm && (
          <div className={styles.form}>
            <h3>{editCharger ? 'Edit Charger' : 'Add New Charger'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={editCharger ? editCharger.name || '' : newCharger.name}
              onChange={(e) =>
                editCharger
                  ? setEditCharger({ ...editCharger, name: e.target.value })
                  : setNewCharger({ ...newCharger, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={editCharger ? editCharger.description || '' : newCharger.description}
              onChange={(e) =>
                editCharger
                  ? setEditCharger({ ...editCharger, description: e.target.value })
                  : setNewCharger({ ...newCharger, description: e.target.value })
              }
            />

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

            <select
              name="chargerModelId"
              value={editCharger ? editCharger.chargerModelId : newCharger.chargerModelId}
              onChange={handleInputChange}
              disabled={chargerModels.length === 0}
            >
              <option value={0}>Select Charger Model</option>
              {chargerModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.modelNumber}: {model.modelName}
                </option>
              ))}
            </select>

            {editCharger && (
              <><h3>Manage Connectors</h3><ChargerConnectorsComponent chargerId={editCharger.id} /></>
            )}
            <div className={styles.buttonGroup}>
              <button onClick={editCharger ? updateCharger : createCharger}>
                {editCharger ? 'Update' : 'Create'}
              </button>
              <button onClick={handleCancelClick} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChargingStationChargersComponent;
