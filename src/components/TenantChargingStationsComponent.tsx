import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { ChargingStation } from '@/types/charging-station';
import styles from '../styles/TenantChargingStationsComponent.module.css';
import ManageChargingStationComponent from './ManageChargingStationComponent';

interface TenantChargingStationsComponentProps {
  tenantId: number;
  userRole: string;
}

const TenantChargingStationsComponent: React.FC<TenantChargingStationsComponentProps> = ({ tenantId, userRole }) => {
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [newChargingStation, setNewChargingStation] = useState({ name: '', description: '', address: '', pincode: '', latitude: 0, longitude: 0, tenantId: tenantId });
  const [editChargingStation, setEditChargingStation] = useState<ChargingStation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof ChargingStation, order: 'asc' });

  const apiUrl = '/charging-stations'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchChargingStations();
  }, [tenantId]); // Depend on tenantId to re-fetch if it changes

  const fetchChargingStations = async () => {
    try {
      const response = await api.get(`/tenants/${tenantId}/charging-stations`);
      setChargingStations(response.data);
    } catch (error: any) {
      console.error('Error fetching chargingStations:', error);
    }
  };

  const createChargingStation = async () => {
    try {
      await api.post(apiUrl, newChargingStation);
      setNewChargingStation({ name: '', description: '', address: '', pincode: '', latitude: 0, longitude: 0, tenantId: tenantId });
      fetchChargingStations(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error creating chargingStation:', error);
    }
  };

  const updateChargingStation = async () => {
    try {
      if (editChargingStation) {
        await api.put(`${apiUrl}/${editChargingStation.id}`, editChargingStation);
        setEditChargingStation(null);
        fetchChargingStations(); // Refresh the list
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating chargingStation:', error);
    }
  };

  const deleteChargingStation = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchChargingStations(); // Refresh the list
    } catch (error) {
      console.error('Error deleting chargingStation:', error);
    }
  };

  // Create a filtered and sorted list of Types based on search and sort
  const filteredChargingStations = chargingStations
    .filter((tenant) => {
      const query = searchQuery.toLowerCase();
      return (
        tenant.name.toLowerCase().includes(query) ||
        tenant.description.toLowerCase().includes(query)
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

  const handleEditClick = (chargingStation: ChargingStation) => {
    setEditChargingStation(chargingStation);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditChargingStation(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setEditChargingStation(null);
    setNewChargingStation({ name: '', description: '', address: '', pincode: '', latitude: 0, longitude: 0, tenantId: tenantId });
    setShowForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [keyof ChargingStation, 'asc' | 'desc'];
    setSortOrder({ field, order });
  };

  return (
    <div className={styles.tabContent}>
      <div className={styles.chargingStations}>

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
            <ul className={styles.chargingStationList}>
              {filteredChargingStations.map((chargingStation) => (
                <li key={chargingStation.id}>
                  <div>
                    <span className={styles.chargingStationName}>{chargingStation.name}</span>
                    <p className={styles.chargingStationDescription}>{chargingStation.description}</p>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEditClick(chargingStation)}>Details</button>
                    <button onClick={() => deleteChargingStation(chargingStation.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {showForm && editChargingStation && (
          <>
            <ManageChargingStationComponent chargingStationId={editChargingStation.id} userRole={userRole} />
            <div className={styles.cancelBackbuttonParent}>
            <button className={styles.cancelBackbutton} onClick={() => { setShowForm(false); setEditChargingStation(null); } }>Cancel</button>
            </div>
          </>
        )}

        {showForm && !editChargingStation && (
          <div className={styles.form}>
            <h3>{editChargingStation ? 'Edit Charging Station' : 'Add New Charging Station'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={newChargingStation.name}
              onChange={(e) => setNewChargingStation({ ...newChargingStation, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={newChargingStation.description}
              onChange={(e) => setNewChargingStation({ ...newChargingStation, description: e.target.value })
              }
            />
            <textarea
              placeholder="Address"
              value={newChargingStation.address}
              onChange={(e) => setNewChargingStation({ ...newChargingStation, address: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Pincode"
              value={newChargingStation.pincode}
              onChange={(e) => setNewChargingStation({ ...newChargingStation, pincode: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Latitude"
              value={newChargingStation.latitude}
              onChange={(e) => setNewChargingStation({ ...newChargingStation, latitude: parseFloat(e.target.value) })
              }
            />
            <input
              type="text"
              placeholder="Longitude"
              value={newChargingStation.longitude}
              onChange={(e) => setNewChargingStation({ ...newChargingStation, longitude: parseFloat(e.target.value) })
              }
            />
            <div className={styles.buttonGroup}>
              <button onClick={createChargingStation}>
                {'Create'}
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

export default TenantChargingStationsComponent;
