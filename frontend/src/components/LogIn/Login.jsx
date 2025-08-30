import style from "./style.module.css";
import TextInput from "../TextInput/TextInput";
import LoginSchema from "../../Schemas/LoginSchema";
import { useFormik } from "formik";
import { login } from "../../API/internals";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ Setup mutation
    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            if (response?.status === 200) {
                const user = {
                    _id: response.data.userDTO._id,
                    email: response.data.userDTO.email,
                    username: response.data.userDTO.username,
                    auth: response.data.auth,
                };

                // Save user in redux + localStorage
                dispatch(setUser(user));
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/");
            }
        },
        onError: (err) => {
            if (err.code === "ERR_BAD_REQUEST") {
                toast.error(
                    err.response?.data?.message || "Invalid credentials"
                );
            } else if (err.code === "ERR_CONNECTION_REFUSED") {
                toast.error("Server is down, please try again later");
            } else {
                toast.error(
                    err.response?.data?.message ||
                        "Something went wrong, please try again."
                );
            }
        },
    });

    const { values, handleBlur, handleChange, errors, handleSubmit } =
        useFormik({
            initialValues: {
                username: "",
                password: "",
            },
            validationSchema: LoginSchema,
            onSubmit: (values) => {
                const data = {
                    username: values.username,
                    password: values.password,
                };
                loginMutation.mutate(data); // ✅ use mutation here
            },
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
                {loginMutation.isError && (
                    <p className={style.errorText}>
                        {loginMutation.error.message}
                    </p>
                )}
                <button
                    type="submit"
                    className={style.logInButton}
                    disabled={
                        loginMutation.isPending ||
                        !values.username ||
                        !values.password ||
                        errors.username ||
                        errors.password
                    }
                >
                    {loginMutation.isPending ? "Logging in..." : "Log In"}
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
