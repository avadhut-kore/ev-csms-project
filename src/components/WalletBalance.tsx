import { useEffect, useState } from "react";
import api from '@/lib/axios';
import styles from "../styles/BillingWelletManagement.module.css";
import { ChargingStation, DayData } from "@/types/charging-station";
import DayToggles from "./DayToggles";
import exp from "constants";

interface WalletBalanceComponentProps {
    setActiveTab: any;
}

const WalletBalanceComponent: React.FC<WalletBalanceComponentProps> = ({ setActiveTab }) => {

    const users = [
        {
          userId: 'user123',
          balance: 1000.50,
        },
        {
          userId: 'user456',
          balance: 250.75,
        },
        {
          userId: 'user789',
          balance: 320.0,
        },
        // Add more users as needed
      ];    

    return (
        <div className={styles.welletmangmentContainer}>
        <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>
    )
}

export default  WalletBalanceComponent