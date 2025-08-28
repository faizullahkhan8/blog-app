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
    const [laoding, setLoading] = useState(false);

    const handleLogin = async () => {
        const data = {
            username: values.username,
            password: values.password,
        };

        try {
            setLoading(true); // start loading

            const response = await login(data);
            console.log(response);

            if (response?.status === 200) {
                // 1. setUser
                const user = {
                    _id: response.data.userDTO._id,
                    email: response.data.userDTO.email,
                    username: response.data.userDTO.username,
                    auth: response.data.auth,
                };
                dispatch(setUser(user));

                // 2. redirect -> home page
                navigate("/");
            } else if (response?.code === "ERR_BAD_REQUEST") {
                setError(
                    response.response?.data?.message || "Invalid credentials"
                );
            } else if (response?.code === "ERR_CONNECTION_REFUSED") {
                setError("Server is down, please try again later");
            } else {
                setError("Something went wrong, please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.message || "Unexpected error occurred."
            );
        } finally {
            setLoading(false); // stop loading (always runs)
        }
    };

    const { values, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: LoginSchema,
    });
    return (
        <div className={style.loginWrapper}>
            <div className={style.loginHeader}>Log in to your account</div>
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
            {error !== "" ? <p className="text-red-600">{error}</p> : ""}
            <button
                className={style.logInButton}
                onClick={handleLogin}
                disabled={
                    !values.username ||
                    !values.password ||
                    errors.username ||
                    errors.password
                }
            >
                {laoding ? "Logging in..." : "Log In"}
            </button>
            <span>
                Don't have an account?
                <button
                    className={style.createAccount}
                    onClick={() => {
                        navigate("/signUp");
                    }}
                >
                    Register
                </button>
            </span>
        </div>
    );
};

export default Login;
