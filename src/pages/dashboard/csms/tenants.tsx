import Layout from '../../../components/Layout';
import styles from '../../../styles/Tenants.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { Tenant, TenantDetails } from '@/types/tenant';

export default function Tenants() {
  const [tenants, setTenants] = useState<TenantDetails[]>([]);
  const [newTenant, setNewTenant] = useState({ name: '', description: '', headOfficeAddress: '' });
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof Tenant, order: 'asc' });
  const router = useRouter();

  const apiUrl = '/tenants'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await api.get(`${apiUrl}/stats`);
      setTenants(response.data);
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
      if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
      }
    }
  };

  // Create a filtered and sorted list of Types based on search and sort
  const filteredTenant = tenants
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

  const createTenant = async () => {
    try {
      await api.post(apiUrl, newTenant);
      setNewTenant({ name: '', description: '', headOfficeAddress: '' });
      fetchTenants(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error creating tenant:', error);
    }
  };

  const updateTenant = async () => {
    try {
      if (editTenant) {
        await api.put(`${apiUrl}/${editTenant.id}`, editTenant);
        setEditTenant(null);
        fetchTenants(); // Refresh the list
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
    }
  };

  const deleteTenant = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchTenants(); // Refresh the list
    } catch (error) {
      console.error('Error deleting tenant:', error);
    }
  };

  const handleEditClick = (tenant: Tenant) => {
    setEditTenant(tenant);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditTenant(null);
    setShowForm(true);
  };

  const handleCancelClick = () => {
    setEditTenant(null);
    setNewTenant({ name: '', description: '', headOfficeAddress: '' });
    setShowForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [keyof Tenant, 'asc' | 'desc'];
    setSortOrder({ field, order });
  };

  return (
    <Layout>
      <div className={styles.tenants}>
        <h2>Manage Tenants</h2>

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
            <ul className={styles.tenantList}>
              {filteredTenant.map((tenant) => (
                <li key={tenant.id}>
                  <div>
                    <span className={styles.tenantName}>{tenant.name}</span>
                    <p className={styles.tenantDescription}>{tenant.description}</p>
                  </div>
                  <div>
                    <span className={styles.tenantName}>{tenant.noOfChargingStations} Charging Stations</span>
                    <p className={styles.tenantDescription}>{tenant.noOfChargingStations} Chargers</p>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEditClick(tenant)}>Edit</button>
                    <button onClick={() => deleteTenant(tenant.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {showForm && (
          <div className={styles.form}>
            <h3>{editTenant ? 'Edit Tenant' : 'Add New Tenant'}</h3>
            <input
              type="text"
              placeholder="Name"
              value={editTenant ? editTenant.name : newTenant.name}
              onChange={(e) =>
                editTenant
                  ? setEditTenant({ ...editTenant, name: e.target.value })
                  : setNewTenant({ ...newTenant, name: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              value={editTenant ? editTenant.description : newTenant.description}
              onChange={(e) =>
                editTenant
                  ? setEditTenant({ ...editTenant, description: e.target.value })
                  : setNewTenant({ ...newTenant, description: e.target.value })
              }
            />
            <textarea
              placeholder="Head Office Address"
              value={editTenant ? editTenant.headOfficeAddress : newTenant.headOfficeAddress}
              onChange={(e) =>
                editTenant
                  ? setEditTenant({ ...editTenant, headOfficeAddress: e.target.value })
                  : setNewTenant({ ...newTenant, headOfficeAddress: e.target.value })
              }
            />
            <div className={styles.buttonGroup}>
              <button onClick={editTenant ? updateTenant : createTenant}>
                {editTenant ? 'Update' : 'Create'}
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
