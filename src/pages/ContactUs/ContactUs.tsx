import { useForm } from "react-hook-form";
import Button from "@components/Button/Button";
import Text from "@components/Text/Text";
import Title from "@components/Title/Title";
import styles from "./ContactUs.module.css";
import {
  yournameValidate,
  emailValidate,
  contentValidate,
} from "@utils/validations";
import { usersService } from "@services/usersService";

function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ yourname: string; yourEmail: string; content: string }>({
    mode: "onChange",
  });

  const handleContactForm = async (formData: {
    yourname: string;
    yourEmail: string;
    content: string;
  }) => {
    try {
      console.log(formData);
      const response = await usersService.sendEmail(
        formData.yourEmail,
        "chatty.tech.info@gmail.com", // прописать почту нашей техподдержки
        `New message from ${formData.yourname}`,
        formData.content
      );
      if (response) {
        alert("The message has been successfully sent!");
        reset();
      } else {
        throw new Error("Failed to send the message.");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to submit the data. Please try again");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <Title
          content="Contact us!"
          inlineStyles={{
            fontSize: "24px",
            paddingBottom: "64px",
            textAlign: "center",
          }}
        />
        <form
          onSubmit={handleSubmit(handleContactForm)}
          className={styles.formContainer}
        >
          <input
            type="text"
            placeholder="Your name"
            {...register("yourname", {
              validate: yournameValidate,
            })}
            className={styles.contactInput}
          />
          {errors.yourname && (
            <Text
              content={errors.yourname.message || ""}
              inlineStyles={{ color: "red", fontSize: "14px" }}
            />
          )}
          <input
            type="text"
            placeholder="Your email"
            {...register("yourEmail", {
              validate: emailValidate,
            })}
            className={styles.contactInput}
          />
          {errors.yourEmail && (
            <Text
              content={errors.yourEmail.message || ""}
              inlineStyles={{ color: "red", fontSize: "14px" }}
            />
          )}
          <textarea
            placeholder="Content"
            {...register("content", {
              validate: contentValidate,
            })}
            className={styles.textarea}
          />
          {errors.content && (
            <Text
              content={errors.content.message || ""}
              inlineStyles={{ color: "red", fontSize: "14px" }}
            />
          )}
          <Button
            text="contact us"
            onClick={() => {}}
            inlineStyles={{
              width: "100%",
              maxWidth: "400px",
              height: "50px",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#4F4F4F",
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
