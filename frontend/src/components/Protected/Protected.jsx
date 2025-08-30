import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { setUser } from "../../store/userSlice";

const Protected = ({ children }) => {
    const dispatch = useDispatch();
    const userFromLocal = localStorage.getItem("user");
    const isAuth = useSelector((state) => state.userSlice.auth);

    // Only restore user if needed
    useEffect(() => {
        if (userFromLocal && !isAuth) {
            dispatch(setUser(JSON.parse(userFromLocal)));
        }
    }, [userFromLocal, isAuth, dispatch]);

    // If logged in or restoring user, render children
    if (userFromLocal && (isAuth || !isAuth)) {
        return children;
    }

    // Otherwise, redirect to login
    return <Navigate to="/logIn" />;
};

export default Protected;
