import Layout from '../../../components/Layout';
// import styles from '../../../styles/Chargers.module.css';
import styles from '../../../styles/ManageTenant.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import InvoiceList from '@/components/InvoiceList';
import InvoiceAnalytics from '@/components/InvoiceAnalytics';

type Tab = 'invoiceanalytics' | 'invoicelist' ;

export default function Invoice() {
    const [activeTab, setActiveTab] = useState<Tab>('invoiceanalytics');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');

    const renderContent = () => {
        switch (activeTab) {
            case 'invoiceanalytics':
                return <InvoiceAnalytics setActiveTab={setActiveTab} />;
            case 'invoicelist':
                return <InvoiceList setActiveTab={setActiveTab} />;
         
            default:
                return null;
        }
    };

    return (
        <Layout>
    <div className={styles.tableContainer}>
                <h1>Invoice</h1>
            <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('invoiceanalytics')}
                        className={`${styles.tab} ${activeTab === 'invoiceanalytics' ? styles.activeTab : ''}`}
                    >
                        Invoice Analytics
                    </div>
                    <div
                        onClick={() => setActiveTab('invoicelist')}
                        className={`${styles.tab} ${activeTab === 'invoicelist' ? styles.activeTab : ''}`}
                    >
                      Invoice List
                    </div>
                   
                
                </div>
                {renderContent()}
            </div>
        </Layout>
   
    )
}