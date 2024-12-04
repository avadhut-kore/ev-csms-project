import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const data = {
        labels: ['USA', 'China', 'Germany', 'UK', 'France', 'Netherlands'],
        datasets: [
          {
            label: 'Number of EV Chargers',
            data: [120000, 150000, 45000, 30000, 20000, 30000],  // Number of chargers
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',  // Red for Tesla
              'rgba(54, 162, 235, 0.6)',  // Blue for ChargePoint
              'rgba(255, 206, 86, 0.6)',  // Yellow for Electrify America
              'rgba(75, 192, 192, 0.6)',  // Green for EVgo
              'rgba(153, 102, 255, 0.6)',  // Purple for Ionity
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',  // Red for Tesla
              'rgba(54, 162, 235, 1)',  // Blue for ChargePoint
              'rgba(255, 206, 86, 1)',  // Yellow for Electrify America
              'rgba(75, 192, 192, 1)',  // Green for EVgo
              'rgba(153, 102, 255, 1)',  // Purple for Ionity
            ],
            borderWidth: 1,
          },
        ],
      };
    
      // Company-wise data with different colors for each bar
      const companyData = {
        labels: ['Tesla', 'ChargePoint', 'Electrify America', 'EVgo', 'Ionity'], // Companies
        datasets: [
          {
            label: 'Number of EV Chargers by Company',
            data: [40000, 25000, 15000, 20000, 12000],  // Number of chargers by company
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',  // Red for Tesla
              'rgba(54, 162, 235, 0.6)',  // Blue for ChargePoint
              'rgba(255, 206, 86, 0.6)',  // Yellow for Electrify America
              'rgba(75, 192, 192, 0.6)',  // Green for EVgo
              'rgba(153, 102, 255, 0.6)',  // Purple for Ionity
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',  // Red for Tesla
              'rgba(54, 162, 235, 1)',  // Blue for ChargePoint
              'rgba(255, 206, 86, 1)',  // Yellow for Electrify America
              'rgba(75, 192, 192, 1)',  // Green for EVgo
              'rgba(153, 102, 255, 1)',  // Purple for Ionity
            ],
            borderWidth: 1,
          },
        ],
      };
    
      // Customize chart options
      const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Number of EV Chargers by Country',
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };



  return (
    <div>
   <div style={{ width: '600px', height: '600px' }}>
            <h5>EV Chargers by Country</h5>
            <Bar data={data} options={options} />
          </div>
    </div>
  );
};

export default BarChart;