import { useEffect, useState } from "react";
import api from '@/lib/axios';
// import styles from "../styles/ChargingStationComponent.module.css";
import style from '../styles/BillingInvoice.module.css';

interface InvoiceAnalyticsComponentProps {
    setActiveTab: any;
}

const InvoiceAnalytics:React.FC<InvoiceAnalyticsComponentProps> = ({ setActiveTab }) => {


    const orders = [
        {
          orderId: '001',
          amount: 150.0,
          type: 'Purchase',
          status: 'Completed',
          createdAt: '2024-11-26 10:30',
          userId: 'user123',
        },
        {
          orderId: '002',
          amount: 200.0,
          type: 'Refund',
          status: 'Pending',
          createdAt: '2024-11-25 15:00',
          userId: 'user456',
        },
        // Add more orders as needed
      ];


    return (
        <div className={style.invoiceContainer}>
        <div className={style.tableContainer}>
        <table className={style.table}>
         <thead>
           <tr>
             <th>Order ID</th>
             <th>Amount</th>
             <th>Type</th>
             <th>Status</th>
             <th>Created At</th>
             <th>User ID</th>
           </tr>
         </thead>
         <tbody>
           {orders.map((order) => (
             <tr key={order.orderId}>
               <td>{order.orderId}</td>
               <td>{order.amount}</td>
               <td>{order.type}</td>
               <td>{order.status}</td>
               <td>{order.createdAt}</td>
               <td>{order.userId}</td>
             </tr>
           ))}
         </tbody>
       </table>
       </div>
       </div>
    )
}

export default InvoiceAnalytics