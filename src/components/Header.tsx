import styles from "./Header.module.css";
import logo from "../assets/icon-192.png";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt  } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.side}></div>

      <div className={styles.center}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.title}>BjjARESSAL</span>
      </div>

      <div className={styles.side}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <FaSignOutAlt  className={styles.logoutIcon} />
        </button>
      </div>
    </header>
  );
};

export default Header;
