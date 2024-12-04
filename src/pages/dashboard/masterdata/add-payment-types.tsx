import Layout from '../../../components/Layout';
import styles from '../../../styles/PaymentTypes.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { PaymentType } from '@/types/payment-type';



interface AddPaymentTypeComponentProps {
    setActiveTab: any;
}


const AddPaymentType: React.FC<AddPaymentTypeComponentProps> = ({ setActiveTab }) => {
    const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
    const [newPaymentType, setNewPaymentType] = useState({ name: '', description: '' });
    const [editPaymentType, setEditPaymentType] = useState<PaymentType | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState({ field: 'name' as keyof PaymentType, order: 'asc' });
    const router = useRouter();

    const apiUrl = '/payment-types'; // Use relative URL with the Axios instance

    useEffect(() => {
        fetchPaymentTypes();
    }, []);

    const fetchPaymentTypes = async () => {
        try {
            const response = await api.get(apiUrl);
            setPaymentTypes(response.data);
        } catch (error: any) {
            console.error('Error fetching payment types:', error);
            if (error.response?.status === 401) {
                router.push('/login'); // Redirect to login if unauthorized
            }
        }
    };

    // Create a filtered and sorted list of Types based on search and sort
    const filteredPaymentType = paymentTypes
        .filter((paymentType) => {
            const query = searchQuery.toLowerCase();
            return (
                paymentType.name.toLowerCase().includes(query) ||
                paymentType.description.toLowerCase().includes(query)
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

    const createPaymentType = async () => {
        try {
            await api.post(apiUrl, newPaymentType);
            setNewPaymentType({ name: '', description: '' });
            fetchPaymentTypes(); // Refresh the list
            setShowForm(false);
        } catch (error) {
            console.error('Error creating payment type:', error);
        }
    };

    const updatePaymentType = async () => {
        try {
            if (editPaymentType) {
                await api.put(`${apiUrl}/${editPaymentType.id}`, editPaymentType);
                setEditPaymentType(null);
                fetchPaymentTypes(); // Refresh the list
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error updating payment type:', error);
        }
    };

    const deletePaymentType = async (id: number) => {
        try {
            await api.delete(`${apiUrl}/${id}`);
            fetchPaymentTypes(); // Refresh the list
        } catch (error) {
            console.error('Error deleting payment type:', error);
        }
    };

    const handleEditClick = (paymentType: PaymentType) => {
        setEditPaymentType(paymentType);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditPaymentType(null);
        setShowForm(true);
    };

    const handleCancelClick = () => {
        setEditPaymentType(null);
        setNewPaymentType({ name: '', description: '' });
        setShowForm(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, order] = e.target.value.split('-') as [keyof PaymentType, 'asc' | 'desc'];
        setSortOrder({ field, order });
    };

    return (
        <div>
            <div className={styles.form}>
                <h3>{editPaymentType ? 'Edit Payment Type' : 'Add New Payment Type'}</h3>
                <label htmlFor="name" className={styles.formLabel}>Name</label>
                <input
                    type="text"
                    placeholder="Name"
                    value={editPaymentType ? editPaymentType.name : newPaymentType.name}
                    onChange={(e) =>
                        editPaymentType
                            ? setEditPaymentType({ ...editPaymentType, name: e.target.value })
                            : setNewPaymentType({ ...newPaymentType, name: e.target.value })
                    }
                />
                <label htmlFor="description" className={styles.formLabel}>Description</label>
                <textarea
                    placeholder="Description"
                    value={editPaymentType ? editPaymentType.description : newPaymentType.description}
                    onChange={(e) =>
                        editPaymentType
                            ? setEditPaymentType({ ...editPaymentType, description: e.target.value })
                            : setNewPaymentType({ ...newPaymentType, description: e.target.value })
                    }
                />
                <div className={styles.buttonGroup}>
                    <button onClick={editPaymentType ? updatePaymentType : createPaymentType}>
                        {editPaymentType ? 'Update' : 'Create'}
                    </button>
                    <button onClick={handleCancelClick} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
            <div className={styles.paymentTypes}>
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
                <ul className={styles.paymentTypeList}>
                    {filteredPaymentType.map((paymentType) => (
                        <li key={paymentType.id}>
                            <div>
                                <span className={styles.paymentTypeName}>{paymentType.name}</span>
                                <p className={styles.paymentTypeDescription}>{paymentType.description}</p>
                            </div>
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleEditClick(paymentType)}>Edit</button>
                                <button onClick={() => deletePaymentType(paymentType.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default AddPaymentType