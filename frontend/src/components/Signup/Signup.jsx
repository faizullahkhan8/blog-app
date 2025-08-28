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
    const [error, setError] = useState();
    const [laoding, setLoading] = useState(false);

    const handleSignUp = async () => {
        let response;
        const data = {
            name: values.name,
            username: values.username,
            email: values.email,
            password: values.password,
        };
        try {
            setLoading(true);
            response = await signUp(data);
        } catch (error) {
            console.log(response);
        } finally {
            setLoading(false);
        }

        if (response.status === 201) {
            dispatch(
                setUser({
                    _id: response.data.user._id,
                    email: response.data.user.email,
                    username: response.data.user.username,
                    auth: response.data.auth,
                })
            );

            navigate("/");
        } else if (response.code === "ERR_BAD_REQUEST") {
            setError(response.response.data.message);
        }
    };

    const { values, handleBlur, handleChange, errors } = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: SignupSchema,
    });
    return (
        <div className={style.loginWrapper}>
            <div className={style.loginHeader}>Register your account</div>
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
                placeholder="Confirm password"
            />
            {error !== "" ? <p className="text-red-600">{error}</p> : ""}
            <button
                className={style.logInButton}
                onClick={handleSignUp}
                disabled={
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
                {laoding ? "Signing Up..." : "Sign Up"}
            </button>
            <span>
                Already have an account?
                <button
                    className={style.createAccount}
                    onClick={() => {
                        navigate("/LogIn");
                    }}
                >
                    Login
                </button>
            </span>
        </div>
    );
};

export default Signup;
