import styles from "./Profile.module.css";
import { useEffect } from "react";
import { usersService } from "@services/usersService";
import { postService } from "@services/postService";
import { useState, useRef } from "react";
import Button from "@components/Button/Button";
import { setPosts, removePost } from "@redux/slices/postsSlice";
import { setCurrentUser } from "@redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import PostCard from "@components/PostCardRectangle/PostCard";
import { useNavigate } from "react-router-dom";
import { PostResponse } from "@customTypes/postTypes";
import { toggleOnlyMine } from "@redux/slices/pagiNationSlice";
import PostModal from "@pages/PostModal/PostModal";
import EditUser from "@pages/EditUser/EditUser";
import Title from "@components/Title/Title";
import Text from "@components/Text/Text";

export interface EditUser {
  id: string;
  username: string;
  phone: string;
  birthday: string;
  gender: string;
  firstName: string;
  lastName: string;
  role?: string;
}

function Profile() {
  // const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const { posts } = useAppSelector((state) => state.posts);
  const navigate = useNavigate();
  const [isDialogCreatePostOpen, setIsDialogCreatePostOpen] = useState(false);
  const [isDialogEditProfile, setIsDialogEditProfile] = useState(false);
  const [editUser, setEditUser] = useState<EditUser | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PostResponse[]>([]);

  useEffect(() => {
    async function fetchedData() {
      setLoading(true);
      try {
        const fetchedUser = await usersService.getUser();
        dispatch(setCurrentUser(fetchedUser));
        setEditUser(fetchedUser);
        if (fetchedUser) {
          setLoadingPosts(true);
          const fetchedPosts = await postService.getUserPosts(fetchedUser.id);
          dispatch(setPosts(fetchedPosts));
        }
      } catch (error) {
        console.log("Error loading user or posts", error);
        if (
          error instanceof Error &&
          error.message === "Not authorized. Please log in."
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
        setLoadingPosts(false);
      }
    }
    fetchedData();
  }, [dispatch, navigate]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  async function handleDeletePost(postId: string, currentPost: PostResponse) {
    const succes = await postService.deletePost(postId);
    if (succes) {
      dispatch(removePost(postId));
      const updatedPosts = await postService.getUserPosts(currentPost.authorId);
      dispatch(setPosts(updatedPosts));
    }
  }

  const navigateToMyPosts = () => {
    navigate("/home");
  };

  const navigateToNotMyPosts = () => {
    navigate("/home");
    dispatch(toggleOnlyMine());
  };

  const openDialogCreatePost = () => {
    setIsDialogCreatePostOpen(true);
  };

  const closeDialogCreatePost = () => {
    setIsDialogCreatePostOpen(false);
  };

  const openDialogEditProfile = () => {
    setIsDialogEditProfile(true);
  };

  const closeDialogEditProfile = async () => {
    setIsDialogEditProfile(false);
    const fetchedUser = await usersService.getUser();
    dispatch(setCurrentUser(fetchedUser));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files as FileList | undefined;
    const file: File | undefined = fileList?.[0];
    if (!file || !currentUser) return;
    const imgUrl = URL.createObjectURL(file);
    setPreviewImage(imgUrl);
    try {
      const updatedUser = await usersService.updateAvatar(currentUser.id, file);
      dispatch(
        setCurrentUser({
          ...currentUser,
          avatar: updatedUser.avatar,
        })
      );

      setEditUser((prevUser) => {
        if (!prevUser) return prevUser;

        return {
          ...prevUser,
          avatar: updatedUser.avatar,
        };
      });
    } catch (error) {
      console.error("Error upload Avatar", error);
    }
  };

  function formatData(data: string | undefined): string {
    if (!data) return "N/A";
    const timestamp = Number(data);
    if (isNaN(timestamp)) return "Invalid data";
    const createData = new Date(timestamp).toISOString().split("T")[0];
    return createData.split("-").reverse().join(".");
  }

  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const posts = await postService.searchPosts(query);
      setSearchResults(posts);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.container}>
      {currentUser ? (
        <div className={styles.userInfoContainer}>
          <img
            src={
              previewImage || currentUser.avatar || "https://i.pravatar.cc/150"
            }
            alt="avatar"
            onClick={handleAvatarClick}
            className={styles.avatar}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className={styles.avatarInput}
            onChange={handleFileChange}
          />
          <div className={styles.settingsContainer}>
            <Title
              content={currentUser.username}
              inlineStyles={{ fontSize: "24px" }}
            />
            <span
              className="material-symbols-outlined"
              onClick={openDialogEditProfile}
            >
              edit
            </span>
          </div>
          <div className={styles.userContainer}>
            <div className={styles.leftConteiner}>
              <Text content={`Username: ${currentUser.username}`} />
              <Text content={`Name: ${currentUser.firstName}`} />
              <Text content={`Surname: ${currentUser.lastName}`} />
              <Text content={`Phone: ${currentUser.phone}`} />
            </div>
            <div className={styles.rightConteiner}>
              <Text
                content={`Birthdate: ${formatData(currentUser.birthday)}`}
              />
              <Text content={`Sex: ${currentUser.gender}`} />
            </div>
          </div>
          <div className={styles.btnContainer}>
            <Button
              text="See my posts"
              onClick={navigateToMyPosts}
              inlineStyles={{ padding: "5px", borderRadius: "5px" }}
            />
            <Button
              text="See not my posts"
              onClick={navigateToNotMyPosts}
              inlineStyles={{ padding: "5px", borderRadius: "5px" }}
            />
            <span
              className="material-symbols-outlined"
              style={{
                color: "white",
                backgroundColor: "black",
                fontSize: "15px",
                padding: "5px",
              }}
              onClick={openDialogCreatePost}
            >
              add
            </span>
          </div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      {loadingPosts ? (
        <div>Loading posts...</div>
      ) : (
        <div className={styles.userPostsContainer}>
          <div className={styles.divider}>
            <div className={styles.line}></div>
            <Title
              content="Posts"
              inlineStyles={{
                fontSize: "24px",
                textAlign: "center",
                padding: "10px",
              }}
            />
            <div className={styles.line}></div>
          </div>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for posts..."
              className={styles.searchInput}
            />
          </div>
          {searchQuery.trim() !== "" && searchResults.length === 0 ? (
            <p>No posts found</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                style="secondary"
                onClick={() => handlePostClick(post.id)}
                isAuthor={currentUser?.id === post.authorId}
                onDeleteClick={() => handleDeletePost(post.id, post)}
              />
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                style="secondary"
                onClick={() => handlePostClick(post.id)}
                isAuthor={currentUser?.id === post.authorId}
                onDeleteClick={() => handleDeletePost(post.id, post)}
              />
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      )}
      {isDialogCreatePostOpen && (
        <PostModal onCloseDialog={closeDialogCreatePost} isNewPost={true} />
      )}
      {isDialogEditProfile && editUser && (
        <EditUser user={editUser} onCloseDialog={closeDialogEditProfile} />
      )}
    </div>
  );
}

export default Profile;
