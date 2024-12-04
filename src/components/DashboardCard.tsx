import styles from '../styles/DashboardCard.module.css';

interface DashboardCardProps {
  title: string;
  value: string;
}

const DashboardCard = ({ title, value }: DashboardCardProps) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DashboardCard;
