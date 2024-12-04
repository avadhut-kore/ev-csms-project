import { useState } from 'react';
import styles from '../styles/ChargerControlsAnalytics.module.css';

interface ChargerControlsAnalyticsComponentProps {
    setActiveTab: any;
}


const ChargerControlsAnalytics: React.FC<ChargerControlsAnalyticsComponentProps> = ({ setActiveTab }) =>  {

    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [isModalOpen2, setIsModalOpen2] = useState(false); // State to manage modal visibility
    const [formData, setFormData] = useState({
        tariff: '',
        address: '',
        country: '',
        city: '',
        pincode: '',
        latitude: '',
        longitude: '',
      });
      const [FirmwareformData, setFirmwareFormData] = useState({
        tariff: '',
        url: '',
        retrieveDate: '',
        numberOfRetries: '',
        retryInterval: ''
      });
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
    
 

        // Function to open the modal
  const handleResetCharger = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Here you would handle the form submission, e.g., API call to reset charger
    closeModal();
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        setIsModalOpen2(true);
        // Logic to update firmware
      };

      const closeModal2 = () => {
        setIsModalOpen2(false);
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
{isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Reset Charger</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="tariff">Tariff:</label>
                <input
                  type="text"
                  id="tariff"
                  name="tariff"
                  value={formData.tariff}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="country">Country:</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Country</option>
                  <option value="USA">USA</option>
                  <option value="India">India</option>
                  <option value="UK">UK</option>
                  {/* Add more country options as needed */}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="pincode">Pincode:</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="latitude">Latitude:</label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="longitude">Longitude:</label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{isModalOpen2 && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Reset Charger</h3>
            <form onSubmit={handleSubmit}>
        
              {/* New Fields */}
              <div className={styles.formGroup}>
                <label htmlFor="url">URL:</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={FirmwareformData.url}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="retrieveDate">Retrieve Date:</label>
                <input
                  type="date"
                  id="retrieveDate"
                  name="retrieveDate"
                  value={FirmwareformData.retrieveDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="numberOfRetries">Number of Retries:</label>
                <input
                  type="number"
                  id="numberOfRetries"
                  name="numberOfRetries"
                  value={FirmwareformData.numberOfRetries}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="retryInterval">Retry Interval (s):</label>
                <input
                  type="number"
                  id="retryInterval"
                  name="retryInterval"
                  value={FirmwareformData.retryInterval}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Buttons */}
              <div className={styles.formGroup}>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={closeModal2}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>

    )

}


export default ChargerControlsAnalytics
