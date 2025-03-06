import styles from "./Login.module.css";
import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { login, setLoading } from "@redux/slices/authSlices";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "@services/authService";
import Button from "@components/Button/Button";
import Text from "@components/Text/Text";
import { usernameValidate, passwordValidate } from "@utils/validations";

function LogIn() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.auth.loading);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>({
    mode: "onChange",
  });

  const handlelogin = async (formData: {
    username: string;
    password: string;
  }) => {
    setLoginError(null);
    dispatch(setLoading(true));
    try {
      const { data } = await authService.login(
        formData.username,
        formData.password
      );
      if (data?.login) {
        dispatch(login({ user: data.login.user, token: data.login.token }));
      }
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);

      if (!(err instanceof ApolloError)) {
        setLoginError("An unknown error occurred. Please try again later.");
        return;
      }

      if (err.networkError) {
        setLoginError("Network error. Please try again later.");
        return;
      }
      if (err.graphQLErrors.length === 0) {
        setLoginError("Incorrect username or password.");
        return;
      }

      const errorMessages = err.graphQLErrors.map((e) => e.message);
      if (errorMessages.includes("Login error: User not found")) {
        setLoginError(
          "User not found. Please check your username and try again."
        );
        return;
      }
      if (errorMessages.includes("Login error: Invalid password")) {
        setLoginError("Incorrect username or password");
        return;
      }
      setLoginError(errorMessages.join(" "));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      <form
        onSubmit={handleSubmit(handlelogin)}
        className={styles.formContainer}
      >
        <input
          type="text"
          placeholder="Username"
          {...register("username", {
            validate: usernameValidate,
          })}
          className={styles.input}
          onChange={() => {
            setLoginError(null);
          }}
        />
        {errors.username && (
          <Text
            content={errors.username.message || ""}
            inlineStyles={{ color: "red", fontSize: "14px" }}
          />
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            validate: passwordValidate,
          })}
          className={styles.input}
          onChange={() => {
            setLoginError(null);
          }}
        />
        {errors.password && (
          <Text
            content={errors.password.message || ""}
            inlineStyles={{ color: "red", fontSize: "14px" }}
          />
        )}
        <Button
          text={loading ? "LOGGIN IN" : "LOGIN"}
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
      {loginError && (
        <Text
          content={loginError}
          inlineStyles={{ color: "red", fontSize: "14px" }}
        />
      )}
    </div>
  );
}

export default LogIn;
