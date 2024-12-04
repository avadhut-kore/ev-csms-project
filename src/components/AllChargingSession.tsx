
import styles from '../styles/ChargingSession.module.css';



interface AllChargingSessionComponentProps {
    setActiveTab: any;
}


const AllChargingSession: React.FC<AllChargingSessionComponentProps> = ({ setActiveTab }) => {

    const dummyData = [
        {
          id: 1,
          chargerPointId: "CP123",
          startTime: "2024-11-20 08:00",
          endTime: "2024-11-20 09:00",
          duration: "1 hour",
          energyConsumed: "10 kWh",
        },
        {
          id: 2,
          chargerPointId: "CP124",
          startTime: "2024-11-21 10:00",
          endTime: "2024-11-21 11:30",
          duration: "1.5 hours",
          energyConsumed: "15 kWh",
        },
        {
          id: 3,
          chargerPointId: "CP125",
          startTime: "2024-11-22 14:00",
          endTime: "2024-11-22 15:45",
          duration: "1 hour 45 minutes",
          energyConsumed: "18 kWh",
        },
        // Add more dummy entries as needed
      ];
    
      return (
     

<div className={styles.tableContainer}>
<table className={styles.table}>
  <thead>
    <tr>
      <th>ID</th>
      <th>ChargerPoint ID</th>
      <th>Start Time</th>
      <th>Duration</th>
      <th>Energy Consumed</th>
    </tr>
  </thead>
  <tbody>
    {dummyData.map((row, index) => (
      <tr key={index}>
        <td>{row.id}</td>
        <td>{row.chargerPointId}</td>
        <td>{row.startTime}</td>
        <td>{row.duration}</td>
        <td>{row.energyConsumed}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
      );

}

export default AllChargingSession