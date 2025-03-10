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

interface UserInEdit {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthday: string;
  role?: string;
  gender: string;
  avatar?: FileList;
}

interface EditUserProps {
  user: UserInEdit;
  onCloseDialog: () => void;
}

function EditUser({ user, onCloseDialog }: EditUserProps) {
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
      console.log("Form data received:", formData);
      const avatarFile =
        formData.avatar && formData.avatar.length > 0
          ? formData.avatar
          : undefined;
      const response = await usersService.updateUser(
        user.id,
        formData.username,
        formData.phone,
        formData.birthday,
        formData.gender,
        formData.firstName,
        formData.lastName,
        user.role,
        avatarFile
      );
      reset();
      onCloseDialog();
      if (response) {
        console.log("User updated:", response);
      } else {
        console.log("No data received from update");
      }
    } catch (err) {
      console.error("Mutation error:", err);
    }
  };

  return (
    <div className={styles.modalContainer} onClick={onCloseDialog}>
      <form
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(handleEditUser)}
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
              onClick={onCloseDialog}
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
    </div>
  );
}

export default EditUser;
