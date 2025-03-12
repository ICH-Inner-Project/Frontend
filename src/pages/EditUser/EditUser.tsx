import styles from "./EditUser.module.css";
import { useForm } from "react-hook-form";
import { usersService } from "@services/usersService";
import Text from "@components/Text/Text";
import Title from "@components/Title/Title";
import Button from "@components/Button/Button";
import {
  usernameValidate,
  firstAndLastNameValidate,
  birthdayValidate,
  genderValidate,
  phoneValidate,
} from "@utils/validations";
import { useState } from "react";
import { ApolloError } from "@apollo/client";

interface UserInEdit {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthday: string;
  role?: string;
  gender: string;
  avatar?: File;
}

interface EditUserProps {
  user: UserInEdit;
  onCloseDialog: () => void;
}

function EditUser({ user, onCloseDialog }: EditUserProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInEdit>({
    mode: "onChange",
  });

  const handleEditUser = async (formData: UserInEdit) => {
    try {
      setServerError(null);
      const fileList = formData.avatar as FileList | undefined;
      console.log(fileList, "fileList");
      const file: File | undefined = fileList?.[0];
      if (file) {
        console.log(file, "file");
      } else {
        console.log("No file selected");
      }
      const response = await usersService.updateUser(
        user.id,
        formData.username,
        formData.phone,
        formData.birthday,
        formData.gender,
        formData.firstName,
        formData.lastName,
        user.role,
        file
      );

      if (response) {
        reset();
        onCloseDialog();
        console.log("User updated:", response);
      } else {
        console.log("No data received from update");
      }
    } catch (err) {
      console.error("Mutation error:", err);

      if (err instanceof ApolloError) {
        if (err.networkError) {
          setServerError("Network error. Please check your connection.");
          return;
        }

        if (err.graphQLErrors.length > 0) {
          const errorMessages = err.graphQLErrors.map((e) => e.message);
          if (
            errorMessages.some((msg) =>
              msg.includes(
                "Invalid file type. Only JPG, PNG, and GIF are allowed"
              )
            )
          ) {
            setServerError(
              "Invalid file type. Only JPG, PNG, and GIF are allowed"
            );
            return;
          }
        }
      }

      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div
      className={styles.modalContainer}
      onClick={() => {
        onCloseDialog();
        reset();
      }}
    >
      <form
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(handleEditUser)}
      >
        <div className={styles.container}>
          <div className={styles.rightContainer}>
            <div className={styles.rightInputContainer}>
              <input
                type="text"
                placeholder="Username"
                {...register("username", {
                  validate: usernameValidate,
                })}
                className={styles.input}
                defaultValue={user.username}
              />
              {errors.username && (
                <Text
                  content={errors.username.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              <input
                type="text"
                placeholder="Name"
                {...register("firstName", {
                  validate: firstAndLastNameValidate,
                })}
                className={styles.input}
                defaultValue={user.firstName}
              />
              {errors.firstName && (
                <Text
                  content={errors.firstName.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              <input
                type="text"
                placeholder="Surname"
                {...register("lastName", {
                  validate: firstAndLastNameValidate,
                })}
                className={styles.input}
                defaultValue={user.lastName}
              />
              {errors.lastName && (
                <Text
                  content={errors.lastName.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              <input
                type="text"
                placeholder="Phone"
                {...register("phone", {
                  validate: phoneValidate,
                })}
                className={styles.input}
                defaultValue={user.phone}
              />
              {errors.phone && (
                <Text
                  content={errors.phone.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
            </div>
            <div className={styles.avtarContainer}>
              <label htmlFor="file-upload" className={styles.customFileUpload}>
                <Title content="Add avatar +" inlineStyles={{}} />
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                {...register("avatar")}
                className={styles.addAvatarInput}
              />
            </div>
          </div>
          <div className={styles.leftContainer}>
            <div className={styles.leftInputContainer}>
              <input
                type="date"
                placeholder="Birthdate"
                {...register("birthday", {
                  validate: birthdayValidate,
                })}
                className={styles.input}
                defaultValue={
                  new Date(Number(user.birthday)).toISOString().split("T")[0]
                }
              />
              {errors.birthday && (
                <Text
                  content={errors.birthday.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
              <select
                {...register("gender", {
                  validate: genderValidate,
                })}
                className={styles.input}
                defaultValue={user.gender}
              >
                <option value="">Sex</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <Text
                  content={errors.gender.message || ""}
                  inlineStyles={{ color: "red", fontSize: "14px" }}
                />
              )}
            </div>
            <div className={styles.buttonContainer}>
              <Button
                text="Save"
                onClick={() => {}}
                inlineStyles={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "50px",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              />
              <Button
                text="Close"
                onClick={() => {
                  onCloseDialog();
                  reset();
                }}
                inlineStyles={{
                  width: "100%",
                  maxWidth: "400px",
                  height: "50px",
                  borderRadius: "5px",
                  fontSize: "16px",
                }}
              />
            </div>
          </div>
        </div>
        {serverError && (
          <Text
            content={serverError}
            inlineStyles={{
              color: "red",
              fontSize: "14px",
              textAlign: "center",
            }}
          />
        )}
      </form>
    </div>
  );
}

export default EditUser;
