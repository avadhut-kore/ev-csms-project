'use client';
import Layout from '../../../components/Layout';
import styles from '../../../styles/ChargerOEMs.module.css';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { ChargerOEM } from '@/types/charger-oem';

export default function ChargerOEMs() {
  const [chargerOEMs, setChargerOEMs] = useState<ChargerOEM[]>([]);
  const [newChargerOEM, setNewChargerOEM] = useState({ name: '', description: '' });
  const [editChargerOEM, setEditChargerOEM] = useState<ChargerOEM | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof ChargerOEM, order: 'asc' });
  const router = useRouter();

  const apiUrl = '/charger-oems'; // Use relative URL with the Axios instance

  useEffect(() => {
    fetchChargerOEMs();
  }, []);

  const fetchChargerOEMs = async () => {
    try {
      const response = await api.get(apiUrl);
      setChargerOEMs(response.data);
    } catch (error: any) {
      console.error('Error fetching charger oems:', error);
      if (error.response?.status === 401) {
        router.push('/login'); // Redirect to login if unauthorized
      }
    }
  };

  // Create a filtered and sorted list of OEMs based on search and sort
  const filteredOEMs = chargerOEMs
    .filter((oem) => {
      const query = searchQuery.toLowerCase();
      return (
        oem.name.toLowerCase().includes(query) ||
        oem.description.toLowerCase().includes(query)
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

  const createChargerOEM = async () => {
    try {
      await api.post(apiUrl, newChargerOEM);
      setNewChargerOEM({ name: '', description: '' });
      fetchChargerOEMs(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error('Error creating charger type:', error);
    }
  };

  const updateChargerOEM = async () => {
    try {
      if (editChargerOEM) {
        await api.put(`${apiUrl}/${editChargerOEM.id}`, editChargerOEM);
        setEditChargerOEM(null);
        fetchChargerOEMs(); // Refresh the list
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error updating charger type:', error);
    }
  };

  const deleteChargerOEM = async (id: number) => {
    try {
      await api.delete(`${apiUrl}/${id}`);
      fetchChargerOEMs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting charger type:', error);
    }
  };

  const handleEditClick = (oem: ChargerOEM) => {
    setEditChargerOEM(oem);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditChargerOEM(null);
    setShowForm(true);
  };

  const handleExportClick = async () => {
    try {
      const response = await api.get(`${apiUrl}/download-excel`, { responseType: 'blob' });
      // Create a URL for the blob data
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'charger-oems.xlsx'); // Set the file name

      // Append the link to the body, trigger a click, and remove it afterward
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error: any) {
      console.error('Failed to download the file:', error);
    }
  };

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile) {
      handleSubmit(selectedFile); // Automatically submit the file after selection
    }
  };

  // Handle form submission (file upload)
  const handleSubmit = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post(`${apiUrl}/upload-excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      fetchChargerOEMs();
    } catch (error: any) {
      alert('Error uploading file: ' + error.message);
    }
  };

  const handleCancelClick = () => {
    setEditChargerOEM(null);
    setNewChargerOEM({ name: '', description: '' });
    setShowForm(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split('-') as [keyof ChargerOEM, 'asc' | 'desc'];
    setSortOrder({ field, order });
  };

  return (
    <Layout>
      <div className={styles.chargerOEMs}>
        {/* <h2>Manage Charger OEMs</h2> */}

        {!showForm && (
          <>
            <div className={styles.searchSortContainer}>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search OEMs..."
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
              <button onClick={handleExportClick} className={styles.addNewButton}>Export</button>
              <button onClick={() => document.getElementById('fileInput')?.click()} className={styles.addNewButton}>Bulk Upload</button>
              <input
                id="fileInput"
                type="file"
                accept=".xlsx"
                style={{ display: 'none' }} // Hide the file input element
                onChange={handleFileChange}
              />
            </div>
            <ul className={styles.oemList}>
              {filteredOEMs.map((chargerOEM) => (
                <li key={chargerOEM.id}>
                  <div>
                    <span className={styles.oemName}>{chargerOEM.name}</span>
                    <p className={styles.oemDescription}>{chargerOEM.description}</p>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button onClick={() => handleEditClick(chargerOEM)}>Edit</button>
                    <button onClick={() => deleteChargerOEM(chargerOEM.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {showForm && (
          <div className={styles.form}>
            <h3>{editChargerOEM ? 'Edit Charger OEM' : 'Add New Charger OEM'}</h3>

            <div className={styles.formField}>
            <label htmlFor="name" className={styles.formLabel}>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={editChargerOEM ? editChargerOEM.name : newChargerOEM.name}
              onChange={(e) =>
                editChargerOEM
                  ? setEditChargerOEM({ ...editChargerOEM, name: e.target.value })
                  : setNewChargerOEM({ ...newChargerOEM, name: e.target.value })
              }
            />
            </div>
             <div className={styles.formField}>
            <label htmlFor="description" className={styles.formLabel}>Description</label>
            <textarea
              placeholder="Description"
              value={editChargerOEM ? editChargerOEM.description : newChargerOEM.description}
              onChange={(e) =>
                editChargerOEM
                  ? setEditChargerOEM({ ...editChargerOEM, description: e.target.value })
                  : setNewChargerOEM({ ...newChargerOEM, description: e.target.value })
              }
            />
            </div>
            <div className={styles.buttonGroup}>
              <button onClick={editChargerOEM ? updateChargerOEM : createChargerOEM}>
                {editChargerOEM ? 'Update' : 'Create'}
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
