import Layout from '../../../components/Layout';
import { useEffect, useState } from 'react';
import styles from '../../../styles/ManageTenant.module.css';
import { useRouter } from 'next/router';
import TenantComponent from '@/components/TenantComponent';
import TenantChargingStationsComponent from '@/components/TenantChargingStationsComponent';
import EntityManagersComponent from '@/components/EntityManagersComponent';
import AddChargerOEMs from './add-charger-oems';
import { ChargerOEM } from '@/types/charger-oem';
import api from '@/lib/axios';
import chargeroemstyles from '../../../styles/ChargerOEMs.module.css';
import AddChargerType from './add-charger-types';
import AddChargerModels from './add-charger-models';
import AddConnectorType from './add-connector-types';
import AddOrganizationType from './add-organization-types';
import AddPaymentType from './add-payment-types';

const apiUrl = '/charger-oems'; // Use relative URL with the Axios instance

type Tab = 'details' | 'chargingStations' | 'managers' | 'connectortype' | 'organizationtype' | 'paymenttype';

export default function AddCharger() {
    const [activeTab, setActiveTab] = useState<Tab>('details');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');


    useEffect(() => {
        const strActiveTenantId = localStorage.getItem('activeTenantId2') ?? localStorage.getItem('entityId');
        const activeTenantId = strActiveTenantId ? parseInt(strActiveTenantId) : 0;
        if (activeTenantId > 0) {
            setActiveTenantId(activeTenantId);
        } else {
            console.log('No tenant ID found in localStorage');
            // router.push('/dashboard');
        }

        const userRole = localStorage.getItem('userRoles') || '';
        setUserRole(userRole);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return <AddChargerOEMs setActiveTab={setActiveTab} />;
            case 'chargingStations':
                return <AddChargerType setActiveTab={setActiveTab} />;
            case 'managers':
                return < AddChargerModels setActiveTab={setActiveTab} />;
            case 'connectortype':
                return < AddConnectorType setActiveTab={setActiveTab} />
            case 'organizationtype':
                return < AddOrganizationType setActiveTab={setActiveTab} />
            case 'paymenttype':
                return < AddPaymentType setActiveTab={setActiveTab} />
            default:
                return null;
        }
    };


    return (
        <Layout>
            <div className={styles.tabsContainer}>
                <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('details')}
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                    >
                        Add New Charger OEM
                    </div>
                    <div
                        onClick={() => setActiveTab('chargingStations')}
                        className={`${styles.tab} ${activeTab === 'chargingStations' ? styles.activeTab : ''}`}
                    >
                        Manage Charger Types
                    </div>
                    {userRole === 'ROLE_ADMIN' && (
                        <div
                            onClick={() => setActiveTab('managers')}
                            className={`${styles.tab} ${activeTab === 'managers' ? styles.activeTab : ''}`}
                        >
                            Manage Charger Models
                        </div>
                    )}
                    {userRole === 'ROLE_ADMIN' && (
                        <div
                            onClick={() => setActiveTab('connectortype')}
                            className={`${styles.tab} ${activeTab === 'connectortype' ? styles.activeTab : ''}`}
                        >
                            Add Connector Type
                        </div>
                    )}

                    {userRole === 'ROLE_ADMIN' && (
                        <div
                            onClick={() => setActiveTab('organizationtype')}
                            className={`${styles.tab} ${activeTab === 'organizationtype' ? styles.activeTab : ''}`}
                        >
                            Add Org Types
                        </div>
                    )}

                    {userRole === 'ROLE_ADMIN' && (
                        <div
                            onClick={() => setActiveTab('paymenttype')}
                            className={`${styles.tab} ${activeTab === 'paymenttype' ? styles.activeTab : ''}`}
                        >
                            Add Payment Types
                        </div>
                    )}
                </div>

                {renderContent()}
            </div>
        </Layout>
    );
}


