import Layout from '../../../components/Layout';
import styles from '../../../styles/ConnectorTypes.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { ConnectorType } from '@/types/connector-type';

export default function ConnectorTypes() {
  const [connectorTypes, setConnectorTypes] = useState<ConnectorType[]>([]);
  const [newConnectorType, setNewConnectorType] = useState({ name: '', description: '' });
  const [editConnectorType, setEditConnectorType] = useState<ConnectorType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof ConnectorType, order: 'asc' });
  const router = useRouter();

  const apiUrl = '/connector-types'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchConnectorTypes();
  }, []);

  const fetchConnectorTypes = async () => {
    try {
      const response = await api.get(apiUrl);
      setConnectorTypes(response.data);
    } catch (error: any) {
      console.error('Error fetching connector types:', error);
      if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
      }
    }
  };

  // Create a filtered and sorted list of Types based on search and sort
  const filteredConnectorTypes = connectorTypes
    .filter((connectorType) => {
      const query = searchQuery.toLowerCase();
      return (
        connectorType.name.toLowerCase().includes(query) ||
        connectorType.description.toLowerCase().includes(query)
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

  const createConnectorType = async () => {
    try {
      await api.post(apiUrl, newConnectorType);
      setNewConnectorType({ name: '', description: '' });
      fetchConnectorTypes(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error creating connector type:', error);
    }
  };

  const updateConnectorType = async () => {
    try {
      if (editConnectorType) {
        await api.put(`${apiUrl}/${editConnectorType.id}`, editConnectorType);
        setEditConnectorType(null);
        fetchConnectorTypes(); // Refresh the list
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating connector type:', error);
    }
  };

  const deleteConnectorType = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchConnectorTypes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting connector type:', error);
    }
  };

  const handleEditClick = (connectorType: ConnectorType) => {
    setEditConnectorType(connectorType);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditConnectorType(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setEditConnectorType(null);
    setNewConnectorType({ name: '', description: '' });
    setShowForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [keyof ConnectorType, 'asc' | 'desc'];
    setSortOrder({ field, order });
  };

  return (
    <Layout>
      <div className={styles.connectorTypes}>
        <h2>Manage Connector Types</h2>

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
            <ul className={styles.connectorTypeList}>
              {filteredConnectorTypes.map((connectorType) => (
                <li key={connectorType.id}>
                  <div>
                    <span className={styles.connectorTypeName}>{connectorType.name}</span>
                    <p className={styles.connectorTypeDescription}>{connectorType.description}</p>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEditClick(connectorType)}>Edit</button>
                    <button onClick={() => deleteConnectorType(connectorType.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {showForm && (
          <div className={styles.form}>
            <h3>{editConnectorType ? 'Edit Connector Type' : 'Add New Connector Type'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={editConnectorType ? editConnectorType.name : newConnectorType.name}
              onChange={(e) =>
                editConnectorType
                  ? setEditConnectorType({ ...editConnectorType, name: e.target.value })
                  : setNewConnectorType({ ...newConnectorType, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={editConnectorType ? editConnectorType.description : newConnectorType.description}
              onChange={(e) =>
                editConnectorType
                  ? setEditConnectorType({ ...editConnectorType, description: e.target.value })
                  : setNewConnectorType({ ...newConnectorType, description: e.target.value })
              }
            />
            <div className={styles.buttonGroup}>
              <button onClick={editConnectorType ? updateConnectorType : createConnectorType}>
                {editConnectorType ? 'Update' : 'Create'}
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
