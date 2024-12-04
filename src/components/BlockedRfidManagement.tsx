


import styles from '../styles/RfidManagement.module.css';

interface BlockedRfidManagementComponentProps {
    setActiveTab: any;
}


const BlockedRfidManagement: React.FC<BlockedRfidManagementComponentProps> = ({ setActiveTab }) =>  {
     // Example data, this can be fetched from an API in a real-world application
  const data = [
    { id: 1, userId: 'user_001', expired: true, expiryDate: '2024-12-31', blocked: false },
    { id: 2, userId: 'user_002', expired: false, expiryDate: '2025-01-15', blocked: true },
    { id: 3, userId: 'user_003', expired: false, expiryDate: '2024-11-30', blocked: false },
  ];

  return (
    <div className={styles.Container}>
    <div className={styles.tableContainer}>
    <table className={styles.table}>
    <thead>
      <tr>
        <th>ID</th>
        <th>User ID</th>
        <th>Expired</th>
        <th>Expiry Date</th>
        <th>Blocked</th>
      </tr>
    </thead>
    <tbody>
      {data.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.userId}</td>
          <td>{user.expired ? 'Yes' : 'No'}</td>
          <td>{user.expiryDate}</td>
          <td>{user.blocked ? 'Yes' : 'No'}</td>
        </tr>
      ))}
    </tbody>
    </table>
    </div>
    </div>
)
}


export default  BlockedRfidManagement