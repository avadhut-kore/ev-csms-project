import { useState } from 'react';
import styles from '../styles/ManageChargingStationComponent.module.css';
import EntityManagersComponent from './EntityManagersComponent';
import ChargingStationComponent from './ChargingStationComponent';
import ChargingStationChargersComponent from './ChargingStationChargersComponent';
import ChargingStationImagesComponent from './ChargingStationImagesComponent';

type Tab = 'details' | 'chargers' | 'managers' | 'stationImages';

interface ManageChargingStationComponentProps {
    chargingStationId: number;
    userRole: string;
}

const ManageChargingStationComponent: React.FC<ManageChargingStationComponentProps> = ({ chargingStationId, userRole }) => {
    const [activeTab, setActiveTab] = useState<Tab>('details');

    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                return <ChargingStationComponent chargingStationId={chargingStationId} />;
            case 'chargers':
                return <ChargingStationChargersComponent chargingStationId={chargingStationId} />;
            case 'managers':
                return <EntityManagersComponent entityId={chargingStationId} entityType="CHARGING-STATION" />;
            case 'stationImages' :
                return <ChargingStationImagesComponent chargingStationId={chargingStationId} />
            default:
                return null;
        }
    };

    return (
        <div className={styles.tabsContainer}>
            {/* Tab Headers */}
            <div className={styles.tabHeaders}>
                <div onClick={() => setActiveTab('details')}
                    className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                >
                    Charging Station Details
                </div>
                <div
                    onClick={() => setActiveTab('chargers')}
                    className={`${styles.tab} ${activeTab === 'chargers' ? styles.activeTab : ''}`}
                >
                    Chargers
                </div>
                <div
                    onClick={() => setActiveTab('stationImages')}
                    className={`${styles.tab} ${activeTab === 'stationImages' ? styles.activeTab : ''}`}
                >
                    Station Images
                </div>
                {(userRole === 'ROLE_TENANT_MANAGER' || userRole === 'ROLE_ADMIN') && (
                    <div
                        onClick={() => setActiveTab('managers')}
                        className={`${styles.tab} ${activeTab === 'managers' ? styles.activeTab : ''}`}
                    >
                        Station Managers
                    </div>
                )}
            </div>

            {/* Tab Content */}
            {renderContent()}
        </div>
    );
};

export default ManageChargingStationComponent;
