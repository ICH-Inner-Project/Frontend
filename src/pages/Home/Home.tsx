import { useNavigate } from "react-router-dom";
import { logout } from "@redux/slices/authSlices";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import styles from "./Home.module.css";
import UserPosts from "@pages/UserPosts/UserPosts";
import { useEffect } from "react";
import { usersService } from "@services/usersService";
import { UserResponse } from "@customTypes/userTypes";
import { useState } from "react";
import Text from "@components/Text/Text";
import PostModal from "@pages/PostModal/PostModal";
import Drafts from "@pages/Drafts/Drafts";
import { toggleDraftsView } from "@redux/slices/postsSlice";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isDraftsView = useAppSelector((state) => state.posts.isDraftsView);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAscending, setIsAscending] = useState(true);
  const [isMyPosts, setIsMyPosts] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
  };

  const toggleNotMyPosts = () => {
    setIsMyPosts((prev) => !prev);
  };

  const toggleIsDraftsView = () => {
    dispatch(toggleDraftsView());
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

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
      <div className={styles.postsSettingsContainer}>
        <span
          className="material-symbols-outlined"
          style={{ color: "white", backgroundColor: "black", fontSize: "15px" }}
          onClick={openDialog}
        >
          add
        </span>
        <div className={styles.showPostsSettingsContainer}>
          <div className={styles.orderContainer}>
            <span
              className="material-symbols-outlined"
              style={{
                transform: isAscending ? "rotate(0deg)" : "rotate(180deg)",
                fontSize: "15px",
              }}
              onClick={toggleSortOrder}
            >
              sort
            </span>
            <Text content="Order" />
          </div>
          <div className={styles.notMyPostsContainer}>
            <span
              className="material-symbols-outlined"
              style={{
                transform: isMyPosts ? "rotate(0deg)" : "rotate(180deg)",
                fontSize: "20px",
              }}
              onClick={toggleNotMyPosts}
            >
              toggle_off
            </span>
            <Text content="Not my Posts" />
          </div>
          <div className={styles.toogleSwitch}>
            <span
              className="material-symbols-outlined"
              style={{
                transform: isDraftsView ? "rotate(180deg)" : "rotate(0deg)",
                fontSize: "20px",
              }}
              onClick={toggleIsDraftsView}
            >
              toggle_off
            </span>
            <Text content="Post is draft" />
          </div>
        </div>
      </div>
      {user &&
        user.id &&
        (isDraftsView ? (
          <Drafts userId={user.id} />
        ) : (
          <UserPosts userId={user.id} />
        ))}
      {isDialogOpen && (
        <PostModal onCloseDialog={closeDialog} isNewPost={true} />
      )}
    </div>
  );
}

export default Home;
