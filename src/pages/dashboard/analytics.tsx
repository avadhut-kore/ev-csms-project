import Layout from '../../components/Layout';
import styles from '../../styles/Analytics.module.css';

export default function Analytics() {
  return (
    <Layout>
      <div className={styles.analytics}>
        <h2>Analytics</h2>
        <p>Here you can see detailed analytics of your application&#39;s performance.</p>
        {/* Add charts, graphs, and other analytic components here */}
      </div>
    </Layout>
  );
}
