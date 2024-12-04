
import Layout from '../../../components/Layout';
import styles from '../../../styles/OrganizationTypes.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { OrganizationType } from '@/types/organization-type';

interface AddOrganizationTypeComponentProps {
    setActiveTab: any;
}


const AddOrganizationType: React.FC<AddOrganizationTypeComponentProps> = ({ setActiveTab }) => {
    const [organizationTypes, setOrganizationTypes] = useState<OrganizationType[]>([]);
    const [newOrganizationType, setNewOrganizationType] = useState({ name: '', description: '' });
    const [editOrganizationType, setEditOrganizationType] = useState<OrganizationType | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof OrganizationType, order: 'asc' });
    const router = useRouter();

    const apiUrl = '/organization-types'; // Use relative URL with the Axios instance

    useEffect(() => {
        fetchOrganizationTypes();
    }, []);

    const fetchOrganizationTypes = async () => {
        try {
            const response = await api.get(apiUrl);
            setOrganizationTypes(response.data);
        } catch (error: any) {
            console.error('Error fetching organization types:', error);
            if (error.response?.status === 401) {
                router.push('/login'); // Redirect to login if unauthorized
            }
        }
    };

    // Create a filtered and sorted list of Types based on search and sort
    const filteredOrganizationType = organizationTypes
        .filter((organizationType) => {
            const query = searchQuery.toLowerCase();
            return (
                organizationType.name.toLowerCase().includes(query) ||
                organizationType.description.toLowerCase().includes(query)
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

    const createOrganizationType = async () => {
        try {
            await api.post(apiUrl, newOrganizationType);
            setNewOrganizationType({ name: '', description: '' });
            fetchOrganizationTypes(); // Refresh the list
            setShowForm(false);
        } catch (error) {
            console.error('Error creating organization type:', error);
        }
    };

    const updateOrganizationType = async () => {
        try {
            if (editOrganizationType) {
                await api.put(`${apiUrl}/${editOrganizationType.id}`, editOrganizationType);
                setEditOrganizationType(null);
                fetchOrganizationTypes(); // Refresh the list
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error updating organization type:', error);
        }
    };

    const deleteOrganizationType = async (id: number) => {
        try {
            await api.delete(`${apiUrl}/${id}`);
            fetchOrganizationTypes(); // Refresh the list
        } catch (error) {
            console.error('Error deleting organization type:', error);
        }
    };

    const handleEditClick = (organizationType: OrganizationType) => {
        setEditOrganizationType(organizationType);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditOrganizationType(null);
        setShowForm(true);
    };

    const handleCancelClick = () => {
        setEditOrganizationType(null);
        setNewOrganizationType({ name: '', description: '' });
        setShowForm(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, order] = e.target.value.split('-') as [keyof OrganizationType, 'asc' | 'desc'];
        setSortOrder({ field, order });
    };

    return (
        <div>
            <div className={styles.form}>
                <h3>{editOrganizationType ? 'Edit Organization Type' : 'Add New Organization Type'}</h3>
                <label htmlFor="name" className={styles.formLabel}>Name</label>
                <input
                    type="text"
                    placeholder="Name"
                    value={editOrganizationType ? editOrganizationType.name : newOrganizationType.name}
                    onChange={(e) =>
                        editOrganizationType
                            ? setEditOrganizationType({ ...editOrganizationType, name: e.target.value })
                            : setNewOrganizationType({ ...newOrganizationType, name: e.target.value })
                    }
                />
                <label htmlFor="description" className={styles.formLabel}>Description</label>
                <textarea
                    placeholder="Description"
                    value={editOrganizationType ? editOrganizationType.description : newOrganizationType.description}
                    onChange={(e) =>
                        editOrganizationType
                            ? setEditOrganizationType({ ...editOrganizationType, description: e.target.value })
                            : setNewOrganizationType({ ...newOrganizationType, description: e.target.value })
                    }
                />
                <div className={styles.buttonGroup}>
                    <button onClick={editOrganizationType ? updateOrganizationType : createOrganizationType}>
                        {editOrganizationType ? 'Update' : 'Create'}
                    </button>
                    <button onClick={handleCancelClick} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>

            <div className={styles.organizationTypes}>
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
                <ul className={styles.organizationTypeList}>
                    {filteredOrganizationType.map((organizationType) => (
                        <li key={organizationType.id}>
                            <div>
                                <span className={styles.organizationTypeName}>{organizationType.name}</span>
                                <p className={styles.organizationTypeDescription}>{organizationType.description}</p>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleEditClick(organizationType)}>Edit</button>
                                <button onClick={() => deleteOrganizationType(organizationType.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default AddOrganizationType