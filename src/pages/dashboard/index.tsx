import Layout from '../../components/Layout';
import DashboardCard from '../../components/DashboardCard';
import styles from '../../styles/Home.module.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import BarChart from '@/components/BarChart';
import DashboardMap from '@/components/DashboardMap';

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


export default function Home() {


  return (
    <Layout>
      <div>
        <div className={styles.searchSortContainer}>

          {/* Select Region */}
          <div className={styles.dropdownContainer}>
            <label htmlFor="region" className={styles.label}>Select Region</label>
            <select
              id="region"
              // onChange={handleRegionChange}
              className={styles.sortDropdown}
            >
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </div>

          {/* Start Date */}
          <div className={styles.dropdownContainer}>
            <label htmlFor="startDate" className={styles.label}>Start Date</label>
            <input
              id="startDate"
              type="date"
              // onChange={handleStartDateChange}
              className={styles.sortDropdown}
            />
          </div>

          {/* End Date */}
          <div className={styles.dropdownContainer}>
            <label htmlFor="endDate" className={styles.label}>End Date</label>
            <input
              id="endDate"
              type="date"
              // onChange={handleEndDateChange}
              className={styles.sortDropdown}
            />
          </div>

          {/* Select Charger Group */}
          <div className={styles.dropdownContainer}>
            <label htmlFor="chargerGroup" className={styles.label}>Select Charger Group</label>
            <select
              id="chargerGroup"
              // onChange={handleChargerGroupChange}
              className={styles.sortDropdown}
            >
              <option value="group1">Group 1</option>
              <option value="group2">Group 2</option>
              <option value="group3">Group 3</option>
            </select>
          </div>

        </div>

      </div>
      <div className={styles.dashboard}>
        <DashboardCard title="Revenue" value="$1,200" />
        <DashboardCard title="Users" value="340" />
        <DashboardCard title="Sales" value="120" />
        <DashboardCard title="Sales" value="120" />

      </div>
      <div style={{ marginLeft: '20px' }}>
        {/* Radio Buttons Section */}
        <h5>View Selections</h5>
        <div className={styles.radioButtonContainer}>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="metrics"
              value="energy"
              defaultChecked
              // onChange={handleRadioChange}
              className={styles.radioButton}
            />
            Energy Consumption
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="metrics"
              value="transactions"
              // onChange={handleRadioChange}
              className={styles.radioButton}
            />
            Transactions
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="metrics"
              value="revenue"
              // onChange={handleRadioChange}
              className={styles.radioButton}
            />
            Revenue
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="metrics"
              value="capacity"
              // onChange={handleRadioChange}
              className={styles.radioButton}
            />
            Capacity Utilization
          </label>

          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="metrics"
              value="kwh"
              // onChange={handleRadioChange}
              className={styles.radioButton}
            />
            kWh Consumed by Time
          </label>
        </div>
      </div>
      <div className={styles.container}>
        <BarChart />
        <DashboardMap />
      </div>
    </Layout>
  );
}
