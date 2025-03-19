import styles from "./Footer.module.css";
import React from "react";

const Footer = () => {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerContainer}>
        {/* Левая часть */}
        <div className={styles.footerLinks}>
          <div className={styles.column}>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className={styles.column}>
            <a href="#">FAQ</a>
            <a href="#">Support</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>

        {/* Центральный текст */}
        <div className={styles.footerText}>
          <p>
            Этот сайт создан для [опишите цель проекта]. Узнайте больше о нас!
          </p>
          <p>
            Мы создаем [описание проекта], чтобы [миссия]. Узнайте больше здесь.
          </p>
        </div>

        {/* Социальные сети и магазины приложений */}
        <div className={styles.footerBottom}>
          <div className={styles.socialIcons}>
            <img src="/img/Facebook.svg" alt="Facebook" />
            <img src="/img/Twitter.svg" alt="Twitter" />
            <img src="/img/YouTube.svg" alt="YouTube" />
            <img src="/img/Instagram.svg" alt="Instagram" />
            <img src="/img/TikTok.svg" alt="TikTok" />
          </div>
          <div className={styles.appLinks}>
            <img
              src="../img/GooglePlay.svg"
              alt="Google Play"
              className={styles.appIcon}
            />
            <img
              src="../img/AppStore.svg"
              alt="App Store"
              className={styles.appIcon}
            />
          </div>
        </div>

        {/* Контактная информация */}
        <div className={styles.footerContact}>
          <p>
            Адрес: [ваш адрес] &nbsp;&nbsp; Телефон: +49 0000000000 &nbsp;&nbsp;
            Email: myemail@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
