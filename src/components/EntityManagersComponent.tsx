import styles from '../styles/EntityManagersComponent.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { CreateManager, User } from '@/types/user';

interface EntityManagersComponentProps {
    entityId: number;
    entityType: string;
}

const EntityManagersComponent: React.FC<EntityManagersComponentProps> = ({ entityId, entityType }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<CreateManager>({ fullName: '', mobileNumber: '', email: '', entityId: entityId, password: '123456' });
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFruits, setSelectedFruits] = useState<(string | number)[]>([]);
    const [sortOrder, setSortOrder] = useState({ field: 'fullName' as keyof User, order: 'asc' });
    const router = useRouter();

    const apiUrl = '/admin';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get(`${apiUrl}/${entityType.toLowerCase()}-managers/${entityId}`);
            setUsers(response.data);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            if (error.response?.status === 401) {
                if (typeof window !== 'undefined') {
                    router.push('/login'); // Redirect to login if unauthorized
                }
            }
        }
    };

    // Create a filtered and sorted list of Types based on search and sort
    const filteredUser = users
        .filter((user) => {
            const query = searchQuery.toLowerCase();
            return (
                user.fullName.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
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

    const createUser = async () => {
        try {
            await api.post(`${apiUrl}/create-${entityType.toLowerCase()}-manager`, newUser);
            setNewUser({ fullName: '', mobileNumber: '', email: '', password: '123456', entityId: entityId });
            fetchUsers(); // Refresh the list
            setShowForm(false);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const updateUser = async () => {
        try {
            if (editUser) {
                await api.put(`${apiUrl}/${editUser.id}`, editUser);
                setEditUser(null);
                fetchUsers(); // Refresh the list
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id: number) => {
        try {
            await api.delete(`${apiUrl}/${id}`);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditClick = (user: User) => {
        setEditUser(user);
        setShowForm(true);
    };

    const handleAddClick = () => {
        setEditUser(null);
        setShowForm(true);
    };

    const handleCancelClick = () => {
        setEditUser(null);
        setNewUser({ fullName: '', mobileNumber: '', email: '', password: '123456', entityId: entityId });
        setShowForm(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, order] = e.target.value.split('-') as [keyof User, 'asc' | 'desc'];
        setSortOrder({ field, order });
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(event.target.selectedOptions);
        const selectedValues = selectedOptions.map(option => option.value);
    
        
        setSelectedFruits(prev => [...prev, ...selectedValues]);
    };
    
    const handleRemove = (fruitToRemove:string|number) => {
        setSelectedFruits((prevFruits) =>
          prevFruits.filter((fruit) => fruit !== fruitToRemove)
        );
    };
    // console.log(selectedFruits)
    return (
        <div className={styles.users}>
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
                            <option value="fullName-asc">Sort by Name (A-Z)</option>
                            <option value="fullName-desc">Sort by Name (Z-A)</option>
                            <option value="email-asc">Sort by Email (A-Z)</option>
                            <option value="email-desc">Sort by Email (Z-A)</option>
                        </select>

                        <button onClick={handleAddClick} className={styles.addNewButton}>Add</button>
                    </div>
                    <ul className={styles.userList}>
                        {filteredUser.map((user) => (
                            <li key={user.id}>
                                <div>
                                    <span className={styles.userName}>{user.fullName}</span>
                                    <p className={styles.userDescription}>{user.email}</p>
                                    <p className={styles.userDescription}>{user.roles}</p>
                                </div>
                                <div className={styles.buttonGroup}>
                                    <button onClick={() => handleEditClick(user)}>Edit</button>
                                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {showForm && (
                <div className={styles.form}>
                    <h3>{editUser ? 'Edit User' : 'Add New User'}</h3>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={editUser ? editUser.fullName : newUser.fullName}
                        onChange={(e) =>
                            editUser
                                ? setEditUser({ ...editUser, fullName: e.target.value })
                                : setNewUser({ ...newUser, fullName: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        value={editUser ? editUser.email : newUser.email}
                        onChange={(e) =>
                            editUser
                                ? setEditUser({ ...editUser, email: e.target.value })
                                : setNewUser({ ...newUser, email: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        value={editUser ? editUser.mobileNumber : newUser.mobileNumber}
                        onChange={(e) =>
                            editUser
                                ? setEditUser({ ...editUser, mobileNumber: e.target.value })
                                : setNewUser({ ...newUser, mobileNumber: e.target.value })
                        }
                    />
                    <>
                        <select id="fruits" onChange={handleChange} className={styles.select} >
                            <option defaultValue="" disabled selected>
                                Property Details
                            </option>
                            <option value="apple">Apple</option>
                            <option value="banana">Banana</option>
                            <option value="orange">Orange</option>
                            <option value="mango">Mango</option>
                            <option value="grapes">Grapes</option>
                        </select>
                        {selectedFruits.length > 0 && (
                          <ul className={styles.options}>
                          {selectedFruits.map((fruit, index) => (
                              <li key={index}>
                              {fruit} 
                              <button onClick={() => handleRemove(fruit)}>&#10005;</button>
                              </li>
                          ))}
                          </ul>
                        )}
                    </>
                    <div className={styles.buttonGroup}>
                        <button onClick={editUser ? updateUser : createUser}>
                            {editUser ? 'Update' : 'Create'}
                        </button>
                        <button onClick={handleCancelClick} className={styles.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EntityManagersComponent;