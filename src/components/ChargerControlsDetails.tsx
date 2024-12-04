import styles from '../styles/ChargerControlsAnalytics.module.css';

interface ChargerControlsDetailsComponentProps {
    setActiveTab: any;
}


const ChargerControlsDetails: React.FC<ChargerControlsDetailsComponentProps> = ({ setActiveTab }) =>  {

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
    
    const handleResetCharger = () => {
        console.log("Resetting charger...");
        // Logic to reset the charger
      };
      
      const handleChargerConfiguration = () => {
        console.log("Opening charger configuration...");
        // Logic for charger configuration
      };
      
      const handleClearCache = () => {
        console.log("Clearing cache...");
        // Logic to clear the cache
      };
      
      const handleMakeInoperative = () => {
        console.log("Making charger inoperative...");
        // Logic to make charger inoperative
      };
      
      const handleUpdateFirmware = () => {
        console.log("Updating firmware...");
        // Logic to update firmware
      };
      
      const handleTriggerMessage = () => {
        console.log("Triggering message...");
        // Logic to trigger a message
      };
      

    return(
        <div>
        <div className={styles.chargerControllers}>
  <h2>Charger Controllers</h2>
  <div className={styles.buttonGroup}>
    <button className={styles.button} onClick={handleResetCharger}>
      Reset Charger
    </button>
    <button className={styles.button} onClick={handleChargerConfiguration}>
      Charger Configuration
    </button>
    <button className={styles.button} onClick={handleClearCache}>
      Clear Cache
    </button>
    <button className={styles.button} onClick={handleMakeInoperative}>
      Make Inoperative
    </button>
    <button className={styles.button} onClick={handleUpdateFirmware}>
      Update Firmware
    </button>
    <button className={styles.button} onClick={handleTriggerMessage}>
      Trigger Message
    </button>
  </div>
</div>


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

<div className={styles.tableContainer}>
<h2>Connectors</h2>
<table className={styles.table}>
  <thead>
    <tr>

      <th>ID</th>
      <th>Type</th>
      <th>Status</th>
      <th>Status Last updated</th>
      <th>Action</th>
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
</div>
    )

}

export default ChargerControlsDetails