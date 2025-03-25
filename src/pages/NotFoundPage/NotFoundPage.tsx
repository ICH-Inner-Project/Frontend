import styles from "./NotFoundPage.module.css";
import Title from "@components/Title/Title";
import Text from "@components/Text/Text";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className={styles.notFoundPageContainer}>
      <Title content="Oops! Page Not Found (404 Error)" />
      <Text content=" We're sorry, but the page you're looking for doesn't seem to exist." />
    </div>
  );
}

export default NotFoundPage;
