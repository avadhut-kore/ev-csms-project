
import Layout from '../components/Layout';
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import api from '@/lib/axios';

import styles from '../styles/AllChargerStation.module.css';



interface AllChargerStationComponentProps {
    setActiveTab: any;
}


const AllChargerStation: React.FC<AllChargerStationComponentProps> = ({ setActiveTab }) => {

     // Dummy data for the table
     const data = [
        {
          name: 'Solar Power Station Alpha',
          address: '123 Solar St, Arizona',
          type: 'Solar',
          capacity: '100 MW',
          vendor: 'SolarTech Inc.',
          creationTime: '2024-01-01',
          qrCode: 'QR1234567890',
        },
        {
          name: 'Wind Energy Station Beta',
          address: '456 Wind Ave, Texas',
          type: 'Wind',
          capacity: '150 MW',
          vendor: 'WindForce LLC',
          creationTime: '2023-06-15',
          qrCode: 'QR9876543210',
        },
        {
          name: 'Hydroelectric Station Gamma',
          address: '789 Hydro Rd, Washington',
          type: 'Hydro',
          capacity: '200 MW',
          vendor: 'HydroWorks',
          creationTime: '2022-11-10',
          qrCode: 'QR5432167890',
        },
        {
          name: 'Geothermal Power Station Delta',
          address: '101 Geothermal Pkwy, California',
          type: 'Geothermal',
          capacity: '50 MW',
          vendor: 'GeoPower Ltd.',
          creationTime: '2021-09-25',
          qrCode: 'QR1122334455',
        },
        {
          name: 'Nuclear Energy Station Epsilon',
          address: '202 Nuclear Blvd, Ohio',
          type: 'Nuclear',
          capacity: '300 MW',
          vendor: 'NuclearEnergy Corp.',
          creationTime: '2020-12-30',
          qrCode: 'QR9988776655',
        },
      ];

return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Vendor</th>
            <th>Creation Time</th>
            <th>QR Code</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.address}</td>
              <td>{row.type}</td>
              <td>{row.capacity}</td>
              <td>{row.vendor}</td>
              <td>{row.creationTime}</td>
              <td>{row.qrCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);


}


export default AllChargerStation