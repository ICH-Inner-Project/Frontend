import styles from "./About.module.css";
import Title from "@components/Title/Title";
import Text from "@components/Text/Text";

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.aboutAs}>
        <Title
          content="About Chatty"
          inlineStyles={{ fontSize: "24px", paddingBottom: "20px" }}
        />
        <Text content='"Chatty" is a social network created for communication and content sharing among users. We offer a simple and convenient way to share thoughts, posts, photos, and interact with others. Our goal is to provide a platform where everyone can be heard, regardless of location or time of day.' />
        <Text content="We aim to create a safe and intuitive space for communication and idea exchange, where every user can find a community of interest." />
        <Title
          content="Key features:"
          inlineStyles={{ fontSize: "24px", padding: "20px 0px 20px 0" }}
        />
        <ul>
          <li>
            <Text content="User registration and authentication." />
          </li>
          <li>
            <Text content="Post creation and editing." />
          </li>
          <li>
            <Text content="Viewing content from other users." />
          </li>
          <li>
            <Text content="Personalized profiles with editable data." />
          </li>
        </ul>
        <Text content='Join "Chatty" and become part of a friendly online community!' />
      </div>
    </div>
  );
}

export default About;
