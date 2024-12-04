import styles from '../styles/Navbar.module.css';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <h1>RapidChargeX Dashboard</h1>
      <div className={styles.container}>
        {/* Select Region */}
        <div className={styles.dropdownContainer}>
          <select
            id="region"
            className={styles.sortDropdown}
          >
            <option value="IN">IN - India</option>
            <option value="US">US - United States</option>
            <option value="CA">CA - Canada</option>
            <option value="GB">GB - United Kingdom</option>
            <option value="AU">AU - Australia</option>
            <option value="DE">DE - Germany</option>
            <option value="FR">FR - France</option>
            <option value="IT">IT - Italy</option>
            <option value="JP">JP - Japan</option>
            <option value="CN">CN - China</option>
          </select>
        </div>
        <LogoutButton /></div>
    </nav>
  );
};

export default Navbar;
