import { useNavigate } from "react-router-dom";
import { logout } from "@redux/slices/authSlices";
import { useAppDispatch } from "@hooks/reduxHooks";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function Logout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div>
      <div>Home</div>
      <button onClick={Logout}>Logout</button>
    </div>
  );
}

export default Home;
