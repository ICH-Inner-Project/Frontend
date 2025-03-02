import styles from "./styles.module.css";
import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { login, setLoading } from "@redux/slices/authSlices";
import { useAppDispatch, useAppSelector } from "@hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authService } from "@services/authService";

function LogIn() {
  const dispatch = useAppDispatch();
  const naavigate = useNavigate();
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
      naavigate("/home");
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof ApolloError) {
        if (err.networkError) {
          setLoginError("Ошибка сети. Пожалуйста, попробуйте позже.");
        } else if (err.graphQLErrors.length > 0) {
          const errorMessages = err.graphQLErrors.map((e) => e.message);
          if (errorMessages.includes("Login error: User not found")) {
            setLoginError(
              "Пользователь не найден. Проверьте логин и попробуйте снова."
            );
          } else if (errorMessages.includes("Login error: Invalid password")) {
            setLoginError("Неверный логин или пароль.");
          } else {
            setLoginError(errorMessages.join(" "));
          }
        } else {
          setLoginError("Неверный логин или пароль.");
        }
      } else {
        setLoginError("Произошла неизвестная ошибка. Попробуйте позже.");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(handlelogin)}>
        <input
          type="text"
          placeholder="username"
          {...register("username", { required: "It's required" })}
        />
        {errors.username && (
          <p className={styles.error}>{errors.username.message}</p>
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: "It's required" })}
        />
        {errors.password && (
          <p className={styles.error}>{errors.password.message}</p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      {loginError && <p className={styles.error}>{loginError}</p>}
    </div>
  );
}

export default LogIn;
