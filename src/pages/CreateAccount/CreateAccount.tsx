import styles from "./CreateAccount.module.css";
import Text from "@components/Text/Text";
import Title from "@components/Title/Title";
import {
  usernameValidate,
  firstAndLastNameValidate,
  passwordValidate,
  birthdayValidate,
  genderValidate,
  phoneValidate,
} from "@utils/validations";
import Button from "@components/Button/Button";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@hooks/reduxHooks";
import { setSelectedTab } from "@redux/slices/tableSlice";
import { usersService } from "@services/usersService";
import { ApolloError } from "@apollo/client";
import { useState } from "react";

export interface UserInCreate {
  username: string;
  password: string;
  phone: string;
  birthday: string;
  gender: string;
  firstName: string;
  lastName: string;
  role?: string;
  avatar?: File;
}

function CreateAccount() {
  const dispatch = useAppDispatch();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserInCreate>({
    mode: "onChange",
  });

  const handleCreateAccount = async (formData: UserInCreate) => {
    try {
      const fileList = formData.avatar as FileList | undefined;
      console.log(fileList, "fileList");
      const file: File | undefined = fileList?.[0];
      if (file) {
        console.log(file, "file");
      } else {
        console.log("No file selected");
      }

      const response = await usersService.createUser(
        formData.username,
        formData.password,
        formData.phone,
        formData.birthday,
        formData.gender,
        formData.firstName,
        formData.lastName,
        formData.role,
        file
      );

      if (response) {
        dispatch(setSelectedTab("list"));
        reset();
        console.log("User created:", response);
      } else {
        console.log("No data received:", response);
      }
    } catch (err) {
      if (!(err instanceof ApolloError)) {
        setServerError("An unknown error occurred. Please try again later.");
        return;
      }

      if (err.networkError) {
        setServerError("Network error. Please try again later.");
        return;
      }

      if (err.graphQLErrors.length === 0) {
        setServerError("An unexpected error occurred. Please try again.");
        return;
      }
      const errorMessages = err.graphQLErrors.map((e) => e.message);
      if (
        errorMessages.some((message) =>
          message.includes("User with this username or phone already exists")
        )
      ) {
        setServerError("User with this username or phone already exists.");
        return;
      }
      setServerError(errorMessages.join(" "));
    }
  };

  return (
    <div className={styles.createAccountContainer}>
      <form
        onSubmit={handleSubmit(handleCreateAccount)}
        className={styles.formContainer}
      >
        <div className={styles.rightContainer}>
          <div className={styles.rightInputContainer}>
            <input
              type="text"
              placeholder="Username"
              {...register("username", {
                validate: usernameValidate,
              })}
              className={styles.input}
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
              type="password"
              placeholder="Password"
              {...register("password", {
                validate: passwordValidate,
              })}
              className={styles.input}
            />
            {errors.password && (
              <Text
                content={errors.password.message || ""}
                inlineStyles={{ color: "red", fontSize: "14px" }}
              />
            )}
            <input
              type="date"
              placeholder="Birthdate"
              defaultValue={new Date().toISOString().split("T")[0]}
              {...register("birthday", {
                validate: birthdayValidate,
              })}
              className={styles.input}
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
              text="CREATE"
              onClick={() => {}}
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
      </form>
      {serverError && (
        <Text
          content={serverError}
          inlineStyles={{ color: "red", fontSize: "14px", textAlign: "center" }}
        />
      )}
    </div>
  );
}

export default CreateAccount;
