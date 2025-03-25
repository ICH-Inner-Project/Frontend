import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import Link from "@components/Link/Link";
import { useAppSelector, useAppDispatch } from "@hooks/reduxHooks";
import { logout } from "@redux/slices/authSlices";
import { apolloClient } from "@graphql/index";
import Text from "@components/Text/Text";

function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.currentUser);

  function Logout() {
    dispatch(logout());
    apolloClient.resetStore();
    navigate("/login");
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.homeConteiner}>
        <Link
          text="Home"
          onClick={() => {
            navigate("/home");
          }}
        />
      </div>

      <div className={styles.navigationContainer}>
        <Link
          text="About"
          onClick={() => {
            navigate("/about");
          }}
        />
        <Link
          text="Contact"
          onClick={() => {
            navigate("/contact");
          }}
        />
        <div className={styles.userMenu}>
          <Text
            content={`Hello, ${user ? user.username : "Guest"}`}
            inlineStyles={{ fontSize: "16px" }}
          />

          <span className={styles.userName}></span>
          <div className={styles.dropdownMenu}>
            <Link
              onClick={() => {
                navigate("/profile");
              }}
              text="Profile"
            />
            <Link onClick={Logout} text="Exit" />
            <Link onClick={Logout} text="Log in with another account" />
            {user?.role === "admin" && (
              <Link
                onClick={() => {
                  navigate("/admin");
                }}
                text="Admin panel"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
