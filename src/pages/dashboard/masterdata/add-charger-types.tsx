import styles from '../../../styles/ChargerTypes.module.css';
import { useState, useEffect } from 'react';
import { ChargerType } from '@/types/charger-type';
import { useRouter } from 'next/router';
import api from '@/lib/axios';

interface AddChargerTypeComponentProps {
    setActiveTab: any;
}


const AddChargerType: React.FC<AddChargerTypeComponentProps> = ({ setActiveTab }) => {
    const [chargerTypes, setChargerTypes] = useState<ChargerType[]>([]);
    const [newChargerType, setNewChargerType] = useState({ name: '', description: '' });
    const [editChargerType, setEditChargerType] = useState<ChargerType | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof ChargerType, order: 'asc' });
    const router = useRouter();

    const apiUrl = '/charger-types'; // Use relative URL with the Axios instance

    useEffect(() => {
        fetchChargerTypes();
    }, []);

    const fetchChargerTypes = async () => {
        try {
            const response = await api.get(apiUrl);
            setChargerTypes(response.data);
        } catch (error: any) {
            console.error('Error fetching charger types:', error);
            if (error.response?.status === 401) {
                router.push('/login'); // Redirect to login if unauthorized
            }
        }
    };

    // Create a filtered and sorted list of Types based on search and sort
    const filteredChargerType = chargerTypes
        .filter((chargerType) => {
            const query = searchQuery.toLowerCase();
            return (
                chargerType.name.toLowerCase().includes(query) ||
                chargerType.description.toLowerCase().includes(query)
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

    const createChargerType = async () => {
        try {
            await api.post(apiUrl, newChargerType);
            setNewChargerType({ name: '', description: '' });
            fetchChargerTypes(); // Refresh the list
            setShowForm(false);
        } catch (error) {
            console.error('Error creating charger type:', error);
        }
    };

    const updateChargerType = async () => {
        try {
            if (editChargerType) {
                await api.put(`${apiUrl}/${editChargerType.id}`, editChargerType);
                setEditChargerType(null);
                fetchChargerTypes(); // Refresh the list
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error updating charger type:', error);
        }
    };

    const deleteChargerType = async (id: number) => {
        try {
            await api.delete(`${apiUrl}/${id}`);
            fetchChargerTypes(); // Refresh the list
        } catch (error) {
            console.error('Error deleting charger type:', error);
        }
    };

    const handleEditClick = (chargerType: ChargerType) => {
        setEditChargerType(chargerType);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditChargerType(null);
        setShowForm(true);
    };

    const handleCancelClick = () => {
        setEditChargerType(null);
        setNewChargerType({ name: '', description: '' });
        setShowForm(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, order] = e.target.value.split('-') as [keyof ChargerType, 'asc' | 'desc'];
        setSortOrder({ field, order });
    };



    return (
        <div >
            <div className={styles.form}>
                <h3>{editChargerType ? 'Edit Charger Type' : 'Add New Charger Type'}</h3>
                <label htmlFor="name" className={styles.formLabel}>Name</label>
                <input
                    type="text"
                    placeholder="Name"
                    value={editChargerType ? editChargerType.name : newChargerType.name}
                    onChange={(e) =>
                        editChargerType
                            ? setEditChargerType({ ...editChargerType, name: e.target.value })
                            : setNewChargerType({ ...newChargerType, name: e.target.value })
                    }
                />
                <label htmlFor="description" className={styles.formLabel}>Description</label>
                <textarea
                    placeholder="Description"
                    value={editChargerType ? editChargerType.description : newChargerType.description}
                    onChange={(e) =>
                        editChargerType
                            ? setEditChargerType({ ...editChargerType, description: e.target.value })
                            : setNewChargerType({ ...newChargerType, description: e.target.value })
                    }
                />
                <div className={styles.buttonGroup}>
                    <button onClick={editChargerType ? updateChargerType : createChargerType}>
                        {editChargerType ? 'Update' : 'Create'}
                    </button>
                    <button onClick={handleCancelClick} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>

            <div className={styles.chargerTypes}>
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
                </div>
                <ul className={styles.chargerTypeList}>
                    {filteredChargerType.map((chargerType) => (
                        <li key={chargerType.id}>
                            <div>
                                <span className={styles.chargerTypeName}>{chargerType.name}</span>
                                <p className={styles.chargerTypeDescription}>{chargerType.description}</p>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleEditClick(chargerType)}>Edit</button>
                                <button onClick={() => deleteChargerType(chargerType.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}



export default AddChargerType;