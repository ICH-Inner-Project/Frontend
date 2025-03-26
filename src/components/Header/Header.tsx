import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import Link from "@components/Link/Link";
import { useAppSelector, useAppDispatch } from "@hooks/reduxHooks";
import { logout } from "@redux/slices/authSlices";
import { apolloClient } from "@graphql/index";
import Text from "@components/Text/Text";
import { useState, useRef, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.currentUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  function toggleMenu() {
    setIsMenuOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
          inlineStyles={{ lineHeight: "14.06px", cursor: "pointer" }}
        />
      </div>

      <div className={styles.navigationContainer}>
        <Link
          text="About"
          onClick={() => {
            navigate("/about");
          }}
          inlineStyles={{ lineHeight: "14.06px", cursor: "pointer" }}
        />
        <Link
          text="Contact"
          onClick={() => {
            navigate("/contact");
          }}
          inlineStyles={{ lineHeight: "14.06px", cursor: "pointer" }}
        />
        <div className={styles.userMenu}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
          >
            <Text
              content={`Hello, ${user ? user.username : "Guest"}`}
              inlineStyles={{ fontSize: "16px", cursor: "pointer" }}
            />
          </div>
          <div
            ref={menuRef}
            className={styles.dropdownMenu}
            style={{
              opacity: isMenuOpen ? 1 : 0,
              visibility: isMenuOpen ? "visible" : "hidden",
              transform: isMenuOpen ? "translateY(0)" : "translateY(-10px)",
            }}
          >
            <Link
              onClick={() => {
                navigate("/profile");
                toggleMenu();
              }}
              text="Profile"
            />
            <Link
              onClick={() => {
                Logout();
                toggleMenu();
              }}
              text="Exit"
            />
            <Link
              onClick={() => {
                Logout();
                toggleMenu();
              }}
              text="Log in with another account"
            />
            {user?.role === "admin" && (
              <Link
                onClick={() => {
                  navigate("/admin");
                  toggleMenu();
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
