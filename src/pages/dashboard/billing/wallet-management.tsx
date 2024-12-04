import Layout from '../../../components/Layout';
// import styles from '../../../styles/Chargers.module.css';
import styles from '../../../styles/ManageTenant.module.css'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import TransactionWalletComponent from '@/components/TransactionWallet';
import WalletBalanceComponent from '@/components/WalletBalance';

type Tab = 'wallettransaction' | 'walletbalance' ;



export default function walletManagement(){
    const [activeTab, setActiveTab] = useState<Tab>('wallettransaction');
    const [activeTenantId, setActiveTenantId] = useState(0);
    const [userRole, setUserRole] = useState('');

    const renderContent = () => {
        switch (activeTab) {
            case 'wallettransaction':
                return <TransactionWalletComponent setActiveTab={setActiveTab} />;
            case 'walletbalance':
                return <WalletBalanceComponent setActiveTab={setActiveTab} />;
         
            default:
                return null;
        }
    };


    return(
        <Layout>
           <div className={styles.tableContainer}>
                <h1>Wallet Management</h1>
            <div className={styles.tabHeaders}>
                    <div onClick={() => setActiveTab('wallettransaction')}
                        className={`${styles.tab} ${activeTab === 'wallettransaction' ? styles.activeTab : ''}`}
                    >
                        Wallet Transaction
                    </div>
                    <div
                        onClick={() => setActiveTab('walletbalance')}
                        className={`${styles.tab} ${activeTab === 'walletbalance' ? styles.activeTab : ''}`}
                    >
                      Wallet Balance
                    </div>
                   
                </div>
                {renderContent()}
            </div>
        </Layout>
    )
}