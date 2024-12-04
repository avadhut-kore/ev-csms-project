import { useRouter } from 'next/router';
import api from '../lib/axios';
import styles from '../styles/LogoutButton.module.css';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the Spring Boot logout API
      await api.post('/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    // Remove the token from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('entityId');
    localStorage.removeItem('activeTenantId');
    localStorage.removeItem('expiryDate');
    // Redirect the user to the login page
    router.push('/login');
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Logout
    </button>
  );
}
