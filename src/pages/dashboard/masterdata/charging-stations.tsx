import Layout from '../../../components/Layout';
import styles from '../../../styles/ChargerTypes.module.css';
import style from '../../../styles/ChargerStations.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/axios';

export default function ChargerStations() {
  const [newChargerType, setNewChargerType] = useState({ name: '', description: '' });
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const data = [
    {
      stationId: 1,
      name: 'Station Alpha',
      type: 'Solar',
      energySource: 'Solar Panels',
      description: 'A large solar farm located in Arizona.',
      createdAt: '2024-03-10',
    },
    {
      stationId: 2,
      name: 'Station Beta',
      type: 'Wind',
      energySource: 'Wind Turbines',
      description: 'A wind power station located in Texas.',
      createdAt: '2023-07-15',
    },
    {
      stationId: 3,
      name: 'Station Gamma',
      type: 'Hydro',
      energySource: 'Hydroelectric Dam',
      description: 'A hydroelectric station in Washington state.',
      createdAt: '2022-11-05',
    },
    {
      stationId: 4,
      name: 'Station Delta',
      type: 'Geothermal',
      energySource: 'Geothermal Wells',
      description: 'A geothermal station located in California.',
      createdAt: '2021-08-20',
    },
    {
      stationId: 5,
      name: 'Station Epsilon',
      type: 'Nuclear',
      energySource: 'Nuclear Reactor',
      description: 'A nuclear energy plant in Ohio.',
      createdAt: '2020-05-30',
    },
  ];

  const apiUrl = '/charger-types'; // Use relative URL with the Axios instance











  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };




    return (
        <Layout>
         <div className={style.chargerTypes}>
         <div className={style.searchSortContainer}>
            <h3>Stations</h3>
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search Types..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={style.searchInput}
              />

              <button  className={style.addNewButton}>Create new chargingpoint</button>
            </div>
         <div className={style.tableContainer}>
         <table className={style.table}>
        <thead>
          <tr>
            <th>Station Id</th>
            <th>Name</th>
            <th>Type</th>
            <th>Energy Source</th>
            <th>Description</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.stationId}>
              <td>{row.stationId}</td>
              <td>{row.name}</td>
              <td>{row.type}</td>
              <td>{row.energySource}</td>
              <td>{row.description}</td>
              <td>{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  


      </div>
        </Layout>
    )
}