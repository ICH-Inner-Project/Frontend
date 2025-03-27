import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import styles from "./Home.module.css";
import UserPosts from "@pages/UserPosts/UserPosts";
import { useEffect } from "react";
import { usersService } from "@services/usersService";
import { useState } from "react";
import Text from "@components/Text/Text";
import PostModal from "@pages/PostModal/PostModal";
import Drafts from "@pages/Drafts/Drafts";
import { toggleDraftsView } from "@redux/slices/postsSlice";
import { updateSortPosts, toggleOnlyMine } from "@redux/slices/pagiNationSlice";

import { setCurrentUser } from "@redux/slices/usersSlice";
import Title from "@components/Title/Title";

function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isDraftsView = useAppSelector((state) => state.posts.isDraftsView);
  const { sortMyPosts, sortNotMyPosts, onlyMine } = useAppSelector(
    (state) => state.pagination
  );
  const user = useAppSelector((state) => state.users.currentUser);
  // const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [isAscending, setIsAscending] = useState(true);
  // const [isMyPosts, setIsMyPosts] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleSortOrder = () => {
    const newSort = onlyMine ? sortMyPosts : sortNotMyPosts;
    const newSortOrder = newSort === "new" ? "old" : "new";
    dispatch(updateSortPosts(newSortOrder));
    // setIsAscending((prev) => !prev);
  };

  const toggleNotMyPosts = () => {
    dispatch(toggleOnlyMine());
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
        dispatch(setCurrentUser(fetchedUser));
      } catch (error) {
        console.error("Error loading user", error);
        if (
          error instanceof Error &&
          error.message === "Not authorized. Please log in."
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [navigate, dispatch]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Title
        content="Blog"
        inlineStyles={{ marginLeft: 0, marginRight: "auto" }}
      />
      <div className={styles.postsSettingsContainer}>
        <span
          className="material-symbols-outlined"
          style={{
            color: "white",
            backgroundColor: "black",
            fontSize: "15px",
            cursor: "pointer",
          }}
          onClick={openDialog}
        >
          add
        </span>
        <div className={styles.showPostsSettingsContainer}>
          <div
            className={styles.orderContainer}
            style={{ visibility: isDraftsView ? "hidden" : "visible" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                transform: onlyMine
                  ? sortMyPosts === "new"
                    ? "rotate(0deg)"
                    : "rotate(180deg)"
                  : sortNotMyPosts === "new"
                  ? "rotate(0deg)"
                  : "rotate(180deg)",
                fontSize: "15px",
                cursor: "pointer",
              }}
              onClick={toggleSortOrder}
            >
              sort
            </span>
            <Text content="Order" />
          </div>
          <div
            className={styles.notMyPostsContainer}
            style={{ visibility: isDraftsView ? "hidden" : "visible" }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                transform: onlyMine ? "rotate(0deg)" : "rotate(180deg)",
                fontSize: "20px",
                cursor: "pointer",
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
                cursor: "pointer",
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
        (isDraftsView ? <Drafts userId={user.id} /> : <UserPosts />)}
      {isDialogOpen && (
        <PostModal onCloseDialog={closeDialog} isNewPost={true} />
      )}
    </div>
  );
}

export default Home;
