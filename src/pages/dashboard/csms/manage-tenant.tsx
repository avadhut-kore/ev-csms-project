import Layout from '../../../components/Layout';
import { useEffect, useState } from 'react';
import styles from '../../../styles/ManageTenant.module.css';
import { useRouter } from 'next/router';
import EntityManagersComponent from '@/components/EntityManagersComponent';
import TenantComponent from '@/components/TenantComponent';
import TenantChargingStationsComponent from '@/components/TenantChargingStationsComponent';

type Tab = 'details' | 'chargingStations' | 'managers';

export default function ManageTenantPage() {
    const [activeTab, setActiveTab] = useState<Tab>('details');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');
    const router = useRouter();

    useEffect(() => {
        const strActiveTenantId = localStorage.getItem('activeTenantId') ?? localStorage.getItem('entityId');
        const activeTenantId = strActiveTenantId ? parseInt(strActiveTenantId) : 0;
        if (activeTenantId > 0) {
            setActiveTenantId(activeTenantId);
        } else {
            console.log('No tenant ID found in localStorage');
            router.push('/dashboard');
        }

        const userRole = localStorage.getItem('userRoles') || '';
        setUserRole(userRole);
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return activeTenantId > 0 && <TenantComponent tenantId={activeTenantId} />;
            case 'chargingStations':
                return activeTenantId > 0 && <TenantChargingStationsComponent tenantId={activeTenantId} userRole={userRole} />;
            case 'managers':
                return activeTenantId > 0 && <EntityManagersComponent entityId={activeTenantId} entityType="TENANT" />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className={styles.tabsContainer}>
                {/* Tab Headers */}
                <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('details')}
                        className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                    >
                        Tenant Details
                    </div>
                    <div
                        onClick={() => setActiveTab('chargingStations')}
                        className={`${styles.tab} ${activeTab === 'chargingStations' ? styles.activeTab : ''}`}
                    >
                        Charging Stations
                    </div>
                    {userRole === 'ROLE_ADMIN' && (
                        <div
                            onClick={() => setActiveTab('managers')}
                            className={`${styles.tab} ${activeTab === 'managers' ? styles.activeTab : ''}`}
                        >
                            Tenant Managers
                        </div>
                    )}
                </div>

                {/* Tab Content */}
                {renderContent()}
            </div>
        </Layout>
    );
};
