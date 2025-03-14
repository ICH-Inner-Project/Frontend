import { useNavigate } from "react-router-dom";
import { logout } from "@redux/slices/authSlices";
import { useAppDispatch } from "@hooks/reduxHooks";
import styles from "./Home.module.css";
import UserPosts from "@pages/UserPosts/UserPosts";
import { useEffect } from "react";
import { usersService } from "@services/usersService";
import { UserResponse } from "@customTypes/userTypes";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    async function fetchUser() {
      try {
        const fetchedUser = await usersService.getUser();
        setUser(fetchedUser);
      } catch (error) {
        console.error("Error loading user", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  function Logout() {
    dispatch(logout());
    navigate("/login");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <button onClick={Logout}>Logout</button>
      {user && user.id && <UserPosts userId={user.id} />}
    </div>
  );
}

export default Home;
