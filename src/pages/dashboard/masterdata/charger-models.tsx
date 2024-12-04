import Layout from '../../../components/Layout';
import styles from '../../../styles/ChargerModels.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { ChargerModel } from '@/types/charger-model';
import { ChargerType } from '@/types/charger-type';
import { ChargerOEM } from '@/types/charger-oem';

export default function ChargerModels() {
  const [chargerModels, setChargerModels] = useState<ChargerModel[]>([]);
  const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);
  const [chargerOems, setChargerOEMs] = useState<ChargerOEM[]>([]);
  const [newChargerModel, setNewChargerModel] = useState({ modelNumber: '', modelName: '', maxPower: 0, voltage: 0, current: 0, chargerTypeId: 0, chargerOemId: 0 });
  const [editChargerModel, setEditChargerModel] = useState<ChargerModel | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof ChargerModel, order: 'asc' });
  const router = useRouter();

  const apiUrl = '/charger-models'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchChargerModels();
    fetchChargerTypes();
    fetchChargerOEMs();
  }, []);

  const fetchChargerModels = async () => {
    try {
      const response = await api.get(apiUrl);
      setChargerModels(response.data);
    } catch (error: any) {
      console.error('Error fetching charger models:', error);
      if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
      }
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

  // Create a filtered and sorted list of Models based on search and sort
  const filteredChargerModel = chargerModels
    .filter((chargerModel) => {
      const query = searchQuery.toLowerCase();
      return (
        chargerModel.modelName.toLowerCase().includes(query) ||
        chargerModel.modelNumber.toLowerCase().includes(query)
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

  const createChargerModel = async () => {
    try {
      await api.post(apiUrl, newChargerModel);
      setNewChargerModel({ modelNumber: '', modelName: '', maxPower: 0, voltage: 0, current: 0, chargerTypeId: 0, chargerOemId: 0 });
      fetchChargerModels(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error creating charger model:', error);
    }
  };

  const updateChargerModel = async () => {
    try {
      if (editChargerModel) {
        await api.put(`${apiUrl}/${editChargerModel.id}`, editChargerModel);
        setEditChargerModel(null);
        fetchChargerModels(); // Refresh the list
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating charger model:', error);
    }
  };

  const deleteChargerModel = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchChargerModels(); // Refresh the list
    } catch (error) {
      console.error('Error deleting charger model:', error);
    }
  };

  const handleEditClick = (chargerModel: ChargerModel) => {
    setEditChargerModel(chargerModel);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditChargerModel(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setEditChargerModel(null);
    setNewChargerModel({ modelNumber: '', modelName: '', maxPower: 0, voltage: 0, current: 0, chargerTypeId: 0, chargerOemId: 0 });
    setShowForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [keyof ChargerModel, 'asc' | 'desc'];
    setSortOrder({ field, order });
  };

  return (
    <Layout>
      <div className={styles.chargerModels}>
        <h2>Manage Charger Models</h2>

        {!showForm && (
          <>
            <div className={styles.searchSortContainer}>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search Models..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />

              {/* Sort Dropdown */}
              <select onChange={handleSortChange} className={styles.sortDropdown}>
                <option value="modelName-asc">Sort by Model Name (A-Z)</option>
                <option value="modelName-desc">Sort by Model Name (Z-A)</option>
                <option value="modelNumber-asc">Sort by Model Number (A-Z)</option>
                <option value="modelNumber-desc">Sort by Model Number (Z-A)</option>
              </select>

              <button onClick={handleAddClick} className={styles.addNewButton}>Add</button>
            </div>
            <ul className={styles.chargerModelList}>
              {filteredChargerModel.map((chargerModel) => (
                <li key={chargerModel.id}>
                  <div>
                    <span className={styles.chargerModelName}>{chargerModel.modelNumber}</span>
                    <p className={styles.chargerModelDescription}>{chargerModel.modelName}</p>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEditClick(chargerModel)}>Edit</button>
                    <button onClick={() => deleteChargerModel(chargerModel.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {showForm && (
          <div className={styles.form}>
            <h3>{editChargerModel ? 'Edit Charger Model' : 'Add New Charger Model'}</h3>
            <input
              type="text"
              placeholder="Model Name"
              value={editChargerModel ? editChargerModel.modelName : newChargerModel.modelName}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, modelName: e.target.value })
                  : setNewChargerModel({ ...newChargerModel, modelName: e.target.value })
              }
            />
            <input
              placeholder="Model Number"
              value={editChargerModel ? editChargerModel.modelNumber : newChargerModel.modelNumber}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, modelNumber: e.target.value })
                  : setNewChargerModel({ ...newChargerModel, modelNumber: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Max Power"
              value={editChargerModel ? editChargerModel.maxPower : newChargerModel.maxPower}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, maxPower: parseInt(e.target.value) })
                  : setNewChargerModel({ ...newChargerModel, maxPower: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Voltage"
              value={editChargerModel ? editChargerModel.voltage : newChargerModel.voltage}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, voltage: parseInt(e.target.value) })
                  : setNewChargerModel({ ...newChargerModel, voltage: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Current"
              value={editChargerModel ? editChargerModel.current : newChargerModel.current}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, current: parseInt(e.target.value) })
                  : setNewChargerModel({ ...newChargerModel, current: parseInt(e.target.value) })
              }
            />
            <select
              value={editChargerModel ? editChargerModel.chargerTypeId : newChargerModel.chargerTypeId}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, chargerTypeId: parseInt(e.target.value) })
                  : setNewChargerModel({ ...newChargerModel, chargerTypeId: parseInt(e.target.value) })
              }
            >
              <option value="">Select Charger Type</option>
              {chargerTypes.map((chargerType) => (
                <option key={chargerType.id} value={chargerType.id}>
                  {chargerType.name}
                </option>
              ))}
            </select>
            <select
              value={editChargerModel ? editChargerModel.chargerOemId : newChargerModel.chargerOemId}
              onChange={(e) =>
                editChargerModel
                  ? setEditChargerModel({ ...editChargerModel, chargerOemId: parseInt(e.target.value) })
                  : setNewChargerModel({ ...newChargerModel, chargerOemId: parseInt(e.target.value) })
              }
            >
              <option value="">Select Charger OEM</option>
              {chargerOems.map((chargerOem) => (
                <option key={chargerOem.id} value={chargerOem.id}>
                  {chargerOem.name}
                </option>
              ))}
            </select>
            <div className={styles.buttonGroup}>
              <button onClick={editChargerModel ? updateChargerModel : createChargerModel}>
                {editChargerModel ? 'Update' : 'Create'}
              </button>
              <button onClick={handleCancelClick} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
