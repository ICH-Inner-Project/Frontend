import React from "react";
import styles from "./Footer.module.css";

interface FooterProps {}

export default function Footer(props: FooterProps) {
  return (
    <footer className={styles["footer-section"]}>
      <div className={styles["footer-container"]}>
        {/* Левая часть */}
        <div className={styles["footer-links"]}>
          <div className={styles.column}>
            <a href="/">About Us</a>
            <a href="/">Contact</a>
            <a href="/">Teams of Service</a>
          </div>
          <div className={styles.column}>
            <a href="/">FAQ</a>
            <a href="/">Support</a>
            <a href="/">Privacy Policy</a>
          </div>
        </div>

        {/* Центральный текст */}
        <div className={styles["footer-text"]}>
          <p>Этот сайт создан для [опишите цель проекта]. Узнайте больше о нас!</p>
          <p>Мы создаем [описание проекта], чтобы [миссия]. Узнаете больше здесь.</p>
        </div>

        {/* Социальные сети и магазины приложений */}
        <div className={styles["footer-bottom"]}>
          <div className={styles["social-icons"]}>
            <img src="/img.svg/Facebook.svg" alt="Facebook" />
            <img src="/img.svg/Twiter.svg" alt="Twiter" />
            <img src="/img.svg/Youtube.svg" alt="YouTube" />
            <img src="/img.svg/Instagram.svg" alt="Instagram" />
            <img src="/img.svg/TikTok.svg" alt="TikTok" />
          </div>
          <div className={styles["app-links"]}>
            <img src="/img.svg/GooglePlay.svg" alt="Google Play" width={140} height={40} />
            <img src="/img.svg/AppStories.svg" alt="App Stories" width={140} height={40} />
          </div>
        </div>

        {/* Контактная информация */}
        <div className={styles["footer-contact"]}>
          <p>Адрес: [ваш адрес] Телефон: +49 0000000000 Email: myemail@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
