import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import { useState, useEffect } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import style from "./Navbar.module.css";
import { useLogout } from "../../Hooks/ReactQueryHooks";

import { MutatingDots } from "react-loader-spinner";

const Navbar = () => {
    const isAuth = useSelector((state) => state.userSlice.auth);
    const username = useSelector((state) => state.userSlice.username);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { mutate, isPending } = useLogout();

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
        mutate();
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
                                    {username[0]}
                                </span>
                                <button
                                    className={style.signOutButton}
                                    onClick={handleSignOut}
                                >
                                    {isPending ? (
                                        <MutatingDots
                                            height="30"
                                            width="30"
                                            color="#4fa94d"
                                            secondaryColor="#4fa94d"
                                            radius="12.5"
                                            ariaLabel="mutating-dots-loading"
                                        />
                                    ) : (
                                        "Sign Out"
                                    )}
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
