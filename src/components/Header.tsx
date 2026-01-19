import styles from "./Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.side}></div>

      <div className={styles.center}>
        <img src="public/icon-192.png" alt="Logo" className={styles.logo} />
        <span className={styles.title}>BjjARESSAL</span>
      </div>

      <div className={styles.side}></div>
    </header>
  );
};

export default Header;
