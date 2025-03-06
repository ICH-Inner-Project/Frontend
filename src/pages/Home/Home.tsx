import { useNavigate } from "react-router-dom";
import { logout } from "@redux/slices/authSlices";
import { useAppDispatch } from "@hooks/reduxHooks";
import styles from "./Home.module.css";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function Logout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <div>Home</div>
      <button onClick={Logout}>Logout</button>
    </div>
  );
}

export default Home;
