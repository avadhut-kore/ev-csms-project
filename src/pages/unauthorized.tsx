'use client';
import Layout from '../components/Layout';
import styles from '../styles/Unauthorized.module.css';

export default function Unauthorized() {
  return (
    <Layout>
      <div className={styles.unauthorized}>
        <h2>Protected Content</h2>
        <p>You are not authorized to access this page.</p>
      </div>
    </Layout>
  );
}
