import styles from "./AdminPanel.module.css";
import Title from "@components/Title/Title";
import Link from "@components/Link/Link";
import CreateAccount from "@pages/CreateAccount/CreateAccount";
import ListOfAccount from "@pages/ListOfAccounts/ListOfAccount";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { setSelectedTab } from "@redux/slices/tableSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const selectedTab = useAppSelector((state) => state.tab.selectedTab);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      const timer = setTimeout(() => {
        navigate("/home");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return user?.role === "admin" ? (
    <div
      className={
        selectedTab === "list" ? styles.containerList : styles.containerAccount
      }
    >
      <div className={styles.headerContainer}>
        <Title content="Admin panel" inlineStyles={{ fontSize: "24px" }} />
        <div
          className={
            selectedTab === "list"
              ? styles.linkContainerList
              : styles.linkContainerAccount
          }
        >
          <Link
            text="Create account"
            onClick={() => {
              dispatch(setSelectedTab("create"));
            }}
            inlineStyles={{ fontSize: "24px" }}
          />
          <Link
            text="List of accounts"
            onClick={() => {
              dispatch(setSelectedTab("list"));
            }}
            inlineStyles={{ fontSize: "24px" }}
          />
        </div>
      </div>
      {selectedTab === "list" ? <ListOfAccount /> : <CreateAccount />}
    </div>
  ) : (
    <div className={styles.admiAcessMessage}>
      Only the administrator has access to the admin panel
    </div>
  );
}

export default AdminPanel;
