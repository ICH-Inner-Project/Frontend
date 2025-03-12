import styles from "./AdminPanel.module.css";
import Title from "@components/Title/Title";
import Link from "@components/Link/Link";
import CreateAccount from "@pages/CreateAccount/CreateAccount";
import ListOfAccount from "@pages/ListOfAccounts/ListOfAccount";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { setSelectedTab } from "@redux/slices/tableSlice";

function AdminPanel() {
  const dispatch = useAppDispatch();
  const selectedTab = useAppSelector((state) => state.tab.selectedTab);
  return (
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
  );
}

export default AdminPanel;
