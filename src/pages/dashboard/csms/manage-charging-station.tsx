import Layout from '../../../components/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ManageChargingStationComponent from '@/components/ManageChargingStationComponent';

export default function ManageChargingStationPage() {
    const [activeChargingStationId, setActiveChargingStationId] = useState(0);
    const [userRole, setUserRole] = useState('');

    const router = useRouter();

    useEffect(() => {
        const strActiveChargingStationId = localStorage.getItem('entityId');
        const userRole = localStorage.getItem('userRoles') || '';
        setUserRole(userRole);

        const activeChargingStationId = strActiveChargingStationId ? parseInt(strActiveChargingStationId) : 0;
        if (activeChargingStationId > 0) {
            setActiveChargingStationId(activeChargingStationId);
        } else {
            console.log('No chargingStation ID found in localStorage');
            router.push('/dashboard');
        }
    }, []);

    return (
        <Layout>
            <ManageChargingStationComponent chargingStationId={activeChargingStationId} userRole={userRole} />
        </Layout>
    );
};
