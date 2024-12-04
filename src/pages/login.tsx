import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/Login.module.css';
import api from '@/lib/axios';
import { FaGoogle, FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const expiryDate = localStorage.getItem('expiryDate');
    if (token && expiryDate) {
      const now = new Date().getTime();
      const expiry = new Date(expiryDate).getTime();
      if (now < expiry) {
        router.push('/dashboard');
      }
      else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('entityId');
        localStorage.removeItem('activeTenantId');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl, { email, password });
      const { token, refreshToken, expiresIn } = response.data;

      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      const expiryDate = new Date(Date.now() + expiresIn);
      localStorage.setItem('expiryDate', expiryDate.toISOString());
      try {
        const response = await api.get('users/roles');
        localStorage.setItem('userRoles', response.data.roleName);
        localStorage.setItem('entityId', response.data.entityId);
        // Redirect to the dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Error fetching user roles:', error);
        if (error.response?.status === 401) {
          router.push('/login'); // Redirect to login if unauthorized
        }
      }
    } catch (err) {
      setError('Login failed. Please check your email and password.');
      console.error('Login error:', err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;  // Show loading state while checking role
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h2 className={styles.title}>Login</h2>
         {/* Social Media Login Section */}
      <div className={styles.socialLoginContainer}>
        <div className={styles.socialIcons}>
          <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaGoogle size={30} />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaFacebookF size={30} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaTwitter size={30} />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
            <FaInstagram size={30} />
          </a>
        </div>
        <p className={styles.socialLoginText}>Or login with</p>
      </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}
