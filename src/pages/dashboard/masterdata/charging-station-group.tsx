import Layout from '../../../components/Layout';
// import styles from '../../../styles/chargingStationGroup.module.css';
import styles from '../../../styles/ManageTenant.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import AllChargerStation from '@/components/AllChargerStation';


type Tab = 'details' | 'chargingStations' | 'managers' | 'connectortype' | 'organizationtype' | 'paymenttype';


export default function ChargingStationGroup(){

    const [activeTab, setActiveTab] = useState<Tab>('details');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');

    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return <AllChargerStation setActiveTab={setActiveTab} />;
            case 'chargingStations':
                return <AllChargerStation setActiveTab={setActiveTab} />;
            case 'managers':
                return < AllChargerStation setActiveTab={setActiveTab} />;
            case 'connectortype':
                return < AllChargerStation setActiveTab={setActiveTab} />
            case 'organizationtype':
                return < AllChargerStation setActiveTab={setActiveTab} />
            case 'paymenttype':
                return < AllChargerStation setActiveTab={setActiveTab} />
            default:
                return null;
        }
    };



    return (
        <Layout>
            <div className={styles.tableContainer}>
                <h1>Chargers</h1>
            <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('details')}
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                    >
                        All
                    </div>
                    <div
                        onClick={() => setActiveTab('chargingStations')}
                        className={`${styles.tab} ${activeTab === 'chargingStations' ? styles.activeTab : ''}`}
                    >
                      Online
                    </div>
                   
                        <div
                            onClick={() => setActiveTab('managers')}
                            className={`${styles.tab} ${activeTab === 'managers' ? styles.activeTab : ''}`}
                        >
                           Enabled
                        </div>
                
                 
                        <div
                            onClick={() => setActiveTab('connectortype')}
                            className={`${styles.tab} ${activeTab === 'connectortype' ? styles.activeTab : ''}`}
                        >
                          Disabled
                        </div>
                
                        <div
                            onClick={() => setActiveTab('organizationtype')}
                            className={`${styles.tab} ${activeTab === 'organizationtype' ? styles.activeTab : ''}`}
                        >
                           Microgrid
                        </div>
                
                </div>
                {renderContent()}
            </div>
        </Layout>
        
    )


}