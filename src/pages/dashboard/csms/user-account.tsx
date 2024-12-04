import styles from '../../../styles/UserAccount.module.css'

export default function UserAccount(){

   // Dummy data for users
   const data = [
    { id: 1, email: 'john.doe@example.com', name: 'John Doe', phoneNumber: '123-456-7890', createdAt: '2023-01-01', lastModified: '2023-01-10' },
    { id: 2, email: 'jane.smith@example.com', name: 'Jane Smith', phoneNumber: '234-567-8901', createdAt: '2022-05-15', lastModified: '2023-02-18' },
    { id: 3, email: 'alice.jones@example.com', name: 'Alice Jones', phoneNumber: '345-678-9012', createdAt: '2023-03-22', lastModified: '2023-03-28' },
    { id: 4, email: 'bob.brown@example.com', name: 'Bob Brown', phoneNumber: '456-789-0123', createdAt: '2021-11-09', lastModified: '2023-04-05' },
  ];

  return (
    <div className={styles.Container}>
    <div className={styles.tableContainer}>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Created At</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.createdAt}</td>
              <td>{user.lastModified}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
  );
}