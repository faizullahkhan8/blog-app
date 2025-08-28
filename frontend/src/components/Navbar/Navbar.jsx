import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../API/internals";
import { resetUser } from "../../store/userSlice";
import { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import style from "./Navbar.module.css";

const Navbar = () => {
    const isAuth = useSelector((state) => state.userSlice.auth);
    const username = useSelector((state) => state.userSlice.username);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMenuOpen]);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isMenuOpen]);

    const handleSignOut = async () => {
        try {
            const response = await logOut();
            if (response.status === 200) {
                dispatch(resetUser());
                navigate("/logIn");
                setIsMenuOpen(false);
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Handle overlay click
    const handleOverlayClick = (e) => {
        // Only close if clicking the overlay itself, not its children
        if (e.target === e.currentTarget) {
            closeMenu();
        }
    };

    return (
        <>
            <nav className={style.navbar}>
                <NavLink to="/" className={style.logo} onClick={closeMenu}>
                    BlogBook
                </NavLink>

                {/* Desktop Navigation */}
                <div className={style.desktopNav}>
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
                        Crypto
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
                        Submit
                    </NavLink>

                    <div className={style.authButtons}>
                        {isAuth ? (
                            <div className={style.userSection}>
                                <span className={style.welcomeText}>
                                    Hi, {username}
                                </span>
                                <button
                                    className={style.signOutButton}
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink
                                    to="/logIn"
                                    className={({ isActive }) =>
                                        isActive
                                            ? style.activeButton
                                            : style.inactiveButton
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
                                            ? style.activeButton
                                            : style.inactiveButton
                                    }
                                >
                                    <button className={style.signUpButton}>
                                        Sign Up
                                    </button>
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button className={style.mobileMenuBtn} onClick={toggleMenu}>
                    {isMenuOpen ? <MdClose /> : <MdMenu />}
                </button>
            </nav>

            {/* Mobile Navigation - Moved outside navbar for better z-index control */}
            {isMenuOpen && (
                <div
                    className={style.mobileOverlay}
                    onClick={handleOverlayClick}
                >
                    <div
                        className={`${style.mobileNav} ${
                            isMenuOpen ? style.mobileNavOpen : ""
                        }`}
                    >
                        <div
                            className={style.mobileNavContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button in mobile nav */}
                            <button
                                className={style.mobileCloseBtn}
                                onClick={closeMenu}
                            >
                                <MdClose />
                            </button>

                            {isAuth && (
                                <div className={style.mobileUserInfo}>
                                    <span className={style.mobileWelcome}>
                                        Welcome, {username}!
                                    </span>
                                </div>
                            )}

                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `${style.mobileNavLink} ${
                                        isActive ? style.activeMobile : ""
                                    }`
                                }
                                onClick={closeMenu}
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/crypto"
                                className={({ isActive }) =>
                                    `${style.mobileNavLink} ${
                                        isActive ? style.activeMobile : ""
                                    }`
                                }
                                onClick={closeMenu}
                            >
                                Cryptocurrencies
                            </NavLink>

                            <NavLink
                                to="/blogs"
                                className={({ isActive }) =>
                                    `${style.mobileNavLink} ${
                                        isActive ? style.activeMobile : ""
                                    }`
                                }
                                onClick={closeMenu}
                            >
                                Blogs
                            </NavLink>

                            <NavLink
                                to="/submit"
                                className={({ isActive }) =>
                                    `${style.mobileNavLink} ${
                                        isActive ? style.activeMobile : ""
                                    }`
                                }
                                onClick={closeMenu}
                            >
                                Submit a Blog
                            </NavLink>

                            <div className={style.mobileAuthButtons}>
                                {isAuth ? (
                                    <button
                                        className={style.mobileSignOutButton}
                                        onClick={handleSignOut}
                                    >
                                        Sign Out
                                    </button>
                                ) : (
                                    <>
                                        <NavLink
                                            to="/logIn"
                                            onClick={closeMenu}
                                        >
                                            <button
                                                className={
                                                    style.mobileLogInButton
                                                }
                                            >
                                                Log In
                                            </button>
                                        </NavLink>

                                        <NavLink
                                            to="/signUp"
                                            onClick={closeMenu}
                                        >
                                            <button
                                                className={
                                                    style.mobileSignUpButton
                                                }
                                            >
                                                Sign Up
                                            </button>
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={style.separator}></div>
        </>
    );
};

export default Navbar;
