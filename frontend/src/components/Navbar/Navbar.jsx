import { NavLink, useNavigate } from "react-router-dom";
import style from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../API/internals";
import { resetUser } from "../../store/userSlice";

const Navbar = () => {
    const isAuth = useSelector((state) => state.userSlice.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        let response;
        try {
            response = await logOut();
        } catch (error) {
            return error;
        }
        if (response.status === 200) {
            dispatch(resetUser());
            navigate("/login");
        }
    };

    return (
        <>
            <nav className={style.navbar}>
                <NavLink className={style.logo}>BlogBook</NavLink>

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? style.activeStyle : style.inActiveStyle
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/crypto"
                    className={({ isActive }) =>
                        isActive ? style.activeStyle : style.inActiveStyle
                    }
                >
                    Cryptocurrencies
                </NavLink>

                <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                        isActive ? style.activeStyle : style.inActiveStyle
                    }
                >
                    Blogs
                </NavLink>

                <NavLink
                    to="/submit"
                    className={({ isActive }) =>
                        isActive ? style.activeStyle : style.inActiveStyle
                    }
                >
                    Submit a blog
                </NavLink>
                {isAuth ? (
                    <NavLink>
                        <button
                            className={style.signOutButton}
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    </NavLink>
                ) : (
                    <>
                        <NavLink
                            to="/logIn"
                            className={({ isActive }) =>
                                isActive
                                    ? style.activeStyle
                                    : style.inActiveStyle
                            }
                        >
                            <button className={style.logInButton}>
                                Log In
                            </button>
                        </NavLink>

                        <NavLink
                            to="/signUp"
                            className={({ isActive }) =>
                                isActive
                                    ? style.activeStyle
                                    : style.inActiveStyle
                            }
                        >
                            <button className={style.signUpButton}>
                                sign Up
                            </button>
                        </NavLink>
                    </>
                )}
            </nav>
            <div className={style.seperator}></div>
        </>
    );
};

export default Navbar;
