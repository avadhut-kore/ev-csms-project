import Layout from '../../components/Layout';
import styles from '../../styles/Settings.module.css';

export default function Settings() {
  return (
    <Layout>
      <div className={styles.settings}>
        <h2>Settings</h2>
        <p>Manage your application settings here.</p>
        {/* Add forms, toggles, and other settings-related components here */}
      </div>
    </Layout>
  );
}
