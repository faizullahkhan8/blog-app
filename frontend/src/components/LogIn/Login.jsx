import style from "./style.module.css";
import TextInput from "../TextInput/TextInput";
import LoginSchema from "../../Schemas/LoginSchema";
import { useFormik } from "formik";
import { login } from "../../API/internals";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (values) => {
        const data = {
            username: values.username,
            password: values.password,
        };

        try {
            setLoading(true);

            const response = await login(data);

            if (response?.status === 200) {
                const user = {
                    _id: response.data.userDTO._id,
                    email: response.data.userDTO.email,
                    username: response.data.userDTO.username,
                    auth: response.data.auth,
                };
                dispatch(setUser(user));
                navigate("/");
            }
        } catch (err) {
            console.error("Login error:", err);

            if (err.code === "ERR_BAD_REQUEST") {
                setError(err.response?.data?.message || "Invalid credentials");
            } else if (err.code === "ERR_CONNECTION_REFUSED") {
                setError("Server is down, please try again later");
            } else {
                setError(
                    err.response?.data?.message ||
                        "Something went wrong, please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const { values, handleBlur, handleChange, errors, handleSubmit } =
        useFormik({
            initialValues: {
                username: "",
                password: "",
            },
            validationSchema: LoginSchema,
            onSubmit: handleLogin,
        });

    return (
        <div className={style.loginWrapper}>
            <div className={style.loginHeader}>Log in to your account</div>
            <form onSubmit={handleSubmit} className={style.form}>
                <TextInput
                    type="text"
                    value={values.username}
                    name="username"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.username}
                    placeholder="Username"
                />
                <TextInput
                    type="password"
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Password"
                />
                {error && <p className={style.errorText}>{error}</p>}
                <button
                    type="submit"
                    className={style.logInButton}
                    disabled={
                        loading ||
                        !values.username ||
                        !values.password ||
                        errors.username ||
                        errors.password
                    }
                >
                    {loading ? "Logging in..." : "Log In"}
                </button>
            </form>
            <span className={style.registerText}>
                Don&apos;t have an account?
                <button
                    className={style.createAccount}
                    onClick={() => navigate("/signUp")}
                >
                    Register
                </button>
            </span>
        </div>
    );
};

export default Login;
