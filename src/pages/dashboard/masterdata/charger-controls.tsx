import Layout from '../../../components/Layout';
import styles from '../../../styles/ManageTenant.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import ChargerControlsAnalytics from '@/components/ChargerControlsAnalytics';
import ChargerControlsDetails from '@/components/ChargerControlsDetails';


type Tab = 'analytics' | 'details' ;

export default function ChargerControls() {

    const [activeTab, setActiveTab] = useState<Tab>('analytics');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');


    const renderContent = () => {
        switch (activeTab) {
            case 'analytics':
                return <ChargerControlsAnalytics setActiveTab={setActiveTab} />;
            case 'details':
                return <ChargerControlsDetails setActiveTab={setActiveTab} />;
            default:
                return null;
        }
    };


    return(
        <Layout>
        <div className={styles.tableContainer}>
                <h1>3.3 KW AC Charger </h1>
            <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('analytics')}
                        className={`${styles.tab} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
                    >
                        analytics
                    </div>
                    <div
                        onClick={() => setActiveTab('details')}
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                    >
                    Details
                    </div>
                </div>
                {renderContent()}
            </div>
        </Layout>
    )
}

