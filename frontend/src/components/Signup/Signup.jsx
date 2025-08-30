import { useFormik } from "formik";
import SignupSchema from "../../Schemas/SignupSchema";
import TextInput from "../TextInput/TextInput";
import style from "./style.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signUp } from "../../API/internals";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (values) => {
        const data = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password,
        };

        try {
            setLoading(true);
            const response = await signUp(data);

            if (response.status === 201) {
                dispatch(
                    setUser({
                        _id: response.data.user._id,
                        email: response.data.user.email,
                        username: response.data.user.username,
                        auth: response.data.auth,
                    })
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.user)
                );

                navigate("/");
            }
        } catch (err) {
            if (err.code === "ERR_BAD_REQUEST") {
                setError(err.response?.data?.message || "Invalid details");
            } else {
                setError("Something went wrong, please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const { values, handleBlur, handleChange, errors, handleSubmit } =
        useFormik({
            initialValues: {
                name: "",
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            },
            validationSchema: SignupSchema,
            onSubmit: handleSignUp,
        });

    return (
        <div className={style.loginWrapper}>
            <div className={style.loginHeader}>Register your account</div>
            <form onSubmit={handleSubmit} className={style.form}>
                <TextInput
                    type="text"
                    value={values.name}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Name"
                />
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
                    type="text"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Email"
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
                <TextInput
                    type="password"
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm Password"
                />
                {error && <p className={style.errorText}>{error}</p>}
                <button
                    type="submit"
                    className={style.logInButton}
                    disabled={
                        loading ||
                        !values.name ||
                        !values.username ||
                        !values.email ||
                        !values.password ||
                        errors.name ||
                        errors.username ||
                        errors.email ||
                        errors.password ||
                        errors.confirmPassword
                    }
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
            <span className={style.registerText}>
                Already have an account?
                <button
                    className={style.createAccount}
                    onClick={() => navigate("/logIn")}
                >
                    Login
                </button>
            </span>
        </div>
    );
};

export default Signup;
