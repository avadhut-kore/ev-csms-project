import Layout from '../../../components/Layout';
// import styles from '../../../styles/Chargers.module.css';
import styles from '../../../styles/ManageTenant.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import InvoiceList from '@/components/InvoiceList';
import InvoiceAnalytics from '@/components/InvoiceAnalytics';
import BlockedRfidManagement from '@/components/BlockedRfidManagement';
import ActiveRfidManagement from '@/components/ActiveRfidManagement';
import AllRfidManagement from '@/components/AllRfidManagement';

type Tab = 'all' | 'active' | 'blocked' ;

export default function RfidManagement() {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');


    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return <AllRfidManagement setActiveTab={setActiveTab} />;
            case 'active':
                return <ActiveRfidManagement setActiveTab={setActiveTab} />;
            case 'blocked':
                return <BlockedRfidManagement setActiveTab={setActiveTab} />;
         
            default:
                return null;
        }
    };

return (
    <Layout>
    <div className={styles.tableContainer}>
                <h1>RFID Management</h1>
            <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('all')}
                        className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
                    >
                        All
                    </div>
                    <div
                        onClick={() => setActiveTab('active')}
                        className={`${styles.tab} ${activeTab === 'active' ? styles.activeTab : ''}`}
                    >
                    Active
                    </div>
                   
                    <div
                        onClick={() => setActiveTab('blocked')}
                        className={`${styles.tab} ${activeTab === 'blocked' ? styles.activeTab : ''}`}
                    >
                     Blocked
                    </div>
                
                </div>
                {renderContent()}
            </div>
        </Layout>
   
)
}