

'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css';
import ProtectedLink from './ProtectedLink';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Tenant } from '@/types/tenant';

const getUserRole = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userRoles') || '';
  }
  return '';
};

const Sidebar = () => {
  const [mounted, setMounted] = useState(false); // Track if the component has mounted
  const router = useRouter();
  const current_user_role = getUserRole(); // Fetch role directly
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [activeTenantId, setActiveTenantId] = useState(0);

  useEffect(() => {
    setMounted(true); // Mark as mounted when the component is ready

    if (router.pathname !== '/dashboard/csms/manage-tenant') {
      setActiveTenantId(0);
      localStorage.removeItem('activeTenantId')
    }
    else {
      const storedTenantId = localStorage.getItem('activeTenantId');
      if (storedTenantId) {
        setActiveTenantId(parseInt(storedTenantId));
      }
    }

    if (current_user_role === 'ROLE_ADMIN') {
      fetchTenants();
    }
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await api.get('/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleTenantChange = (e: { target: { value: string; }; }) => {
    const activeTenantId = parseInt(e.target.value);
    setActiveTenantId(activeTenantId);

    localStorage.setItem('activeTenantId', activeTenantId.toString());
    localStorage.setItem('activeTenantId2', activeTenantId.toString());

    router.push(`/dashboard/csms/manage-tenant`).then(() => router.reload());
  };

  const menuItems = [
    { title: "Overview", path: "/dashboard" },
    { title: "Network Map", path: "/dashboard/networkmap" },
    { title: "Location", path: "/dashboard/networkmap" },
    { title: "Analytics", path: "/dashboard/analytics" },
  ];

  const masterdataItems = [
    { title: "Add Charger", path: "/dashboard/masterdata/add-charger", requiredRole: "ROLE_ADMIN" },
    { title: "RFID Management", path: "/dashboard/masterdata/rfid-management", requiredRole: "ROLE_ADMIN" },
    { title: "Charging Stations", path: "/dashboard/masterdata/charging-stations", requiredRole: "ROLE_ADMIN" },
    { title: "Charging Group", path: "/dashboard/masterdata/charging-station-group", requiredRole: "ROLE_ADMIN" },
    { title: "Charging Session", path: "/dashboard/masterdata/charging-session", requiredRole: "ROLE_ADMIN" },
    { title: "Charger Controls", path: "/dashboard/masterdata/charger-controls", requiredRole: "ROLE_ADMIN" },
    
     // { title: "Charger OEMs", path: "/dashboard/masterdata/charger-oems", requiredRole: "ROLE_ADMIN" },
    // { title: "Charger Types", path: "/dashboard/masterdata/charger-types", requiredRole: "ROLE_ADMIN" },
    // { title: "Charger Models", path: "/dashboard/masterdata/charger-models", requiredRole: "ROLE_ADMIN" },
    // { title: "Connector Types", path: "/dashboard/masterdata/connector-types", requiredRole: "ROLE_ADMIN" },
    // { title: "Organization Types", path: "/dashboard/masterdata/organization-types", requiredRole: "ROLE_ADMIN" },
    // { title: "Payment Types", path: "/dashboard/masterdata/payment-types", requiredRole: "ROLE_ADMIN" },
  ].filter(m => m.requiredRole === current_user_role);

  const csmsItems = [
    { title: "Tenants", path: "/dashboard/csms/tenants", requiredRole: "ROLE_ADMIN" },
    { title: "Settings", path: "/dashboard/settings" , requiredRole: "ROLE_ADMIN" },
    { title: "Users", path: "/dashboard/csms/users", requiredRole: "ROLE_ADMIN" },
    { title: "Manage Tenant", path: "/dashboard/csms/manage-tenant", requiredRole: "ROLE_TENANT_MANAGER" },
    { title: "Manage ChargingStation", path: "/dashboard/csms/manage-chargingStation", requiredRole: "ROLE_CHARGING_STATION_MANAGER" },
  ].filter(m => m.requiredRole === current_user_role);

  const billingItems = [
    { title: "Invoice", path: "/dashboard/billing/invoice", requiredRole: "ROLE_ADMIN" },
    { title: "Wallet Management", path: "/dashboard/billing/wallet-management", requiredRole: "ROLE_ADMIN" },

  ].filter(m => m.requiredRole === current_user_role);

  // Filter billing items based on current_user_role
  const filteredBillingItems = billingItems.filter(item => item.requiredRole === current_user_role);

    // New function for handling Billing Item Dropdown change
    const handleBillingItemChange = (e: { target: { value: string; }; }) => {
      const selectedPath = e.target.value;
      if (selectedPath && selectedPath !== '0') {
        router.push(selectedPath);
      }
    };

  if (!mounted) {
    return null; // Render nothing on the server or during initial client render
  }

  return (
    <aside className={styles.sidebar}>
      <h2>Dashboard</h2>
      <div className={styles.scrollbar}>
      <ul>
        {current_user_role === 'ROLE_ADMIN' && (
          <li>
            <select
                value={activeTenantId}
                className={styles.sortDropdown}
                onChange={handleTenantChange}
                required
              >
                <option value="0">Select Tenant</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
          </li>
        )}
        {menuItems.map((item) => (
          <li key={item.path} className={router.pathname === item.path ? styles.active : ""}>
            <Link href={item.path}>{item.title}</Link>
          </li>
        ))}

        {masterdataItems.length > 0 && (
          <li>
            <div className={styles.menuHeader}>Masterdata</div>
            <li>
            <select
              className={styles.sortDropdown}
              onChange={handleBillingItemChange}
              required
            >
              <option value="0"> Billing & Mangment</option>
              {filteredBillingItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.title}
                </option>
              ))}
            </select>
          </li>
        
            <ul  className={styles.subMenu} suppressHydrationWarning >
              {masterdataItems.map((item) => (
                <li key={item.path} className={router.pathname === item.path ? styles.active : ""}>
                  <ProtectedLink href={item.path} requiredRole={item.requiredRole}>{item.title}</ProtectedLink>
                </li>
              ))}
            </ul>
          </li>
        )}

        {csmsItems.length > 0 && (
          <li>
            <div className={styles.menuHeader}>CSMS</div>
            <ul className={styles.subMenu} suppressHydrationWarning >
              {csmsItems.map((item) => (
                <li key={item.path} className={router.pathname === item.path ? styles.active : ""}>
                  <ProtectedLink href={item.path} requiredRole={item.requiredRole}>{item.title}</ProtectedLink>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
      </div>
      <div >
    <button className={styles.logoutButton} >
      Logout
    </button>
  </div>
    </aside>
  );
};

export default Sidebar;
