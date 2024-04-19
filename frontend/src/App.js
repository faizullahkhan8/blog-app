import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import style from "./App.module.css";
import Protected from "./components/Protected/Protected";
import Error from "./components/Error/Error";
import Login from "./components/LogIn/Login";
import Signup from "./components/Signup/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Crypto from "./components/Crypto/Crypto";
import Blog from "./components/Blog/Blog";
import SubmitABlog from "./components/SubmitBlog/SubmitBlog";
import BlogDetail from "./components/BlogDetail/BlogDetail";
import UpdateBlog from "./components/UpdateBlog/UpdateBlog";
const App = () => {
    const isAuth = useSelector((state) => state.userSlice.auth);
    return (
        <div className={style.container}>
            <BrowserRouter>
                <div className={style.layout}>
                    <Navbar />
                    <Routes>
                        {/* Home route */}
                        <Route
                            path="/"
                            exact
                            element={
                                <div className={style.main}>
                                    <Home />
                                </div>
                            }
                        />
                        {/* crypto route */}
                        <Route
                            path="/crypto"
                            exact
                            element={
                                <div className={style.main}>
                                    <Crypto />
                                </div>
                            }
                        />
                        {/* blog */}
                        <Route
                            path="/blogs"
                            element={
                                <Protected isAuth={isAuth}>
                                    <div className={style.main}>
                                        <Blog />
                                    </div>
                                </Protected>
                            }
                        />

                        {/* single blog by id */}
                        <Route
                            path="/blog/:id"
                            element={
                                <div className={style.main}>
                                    <BlogDetail />
                                </div>
                            }
                        />

                        {/* update a blog */}
                        <Route
                            path="/blog/edit/:id"
                            element={
                                <div className={style.main}>
                                    <UpdateBlog />
                                </div>
                            }
                        />

                        {/* submit a blog route */}
                        <Route
                            path="/submit"
                            element={
                                <Protected isAuth={isAuth}>
                                    <div className={style.main}>
                                        <SubmitABlog />
                                    </div>
                                </Protected>
                            }
                        />

                        {/* login route */}
                        <Route
                            path="/logIn"
                            exact
                            element={
                                <div className={style.main}>
                                    <Login />
                                </div>
                            }
                        />
                        {/* sign up route */}
                        <Route
                            path="/signUp"
                            exact
                            element={
                                <div className={style.main}>
                                    <Signup />
                                </div>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <div className={style.main}>
                                    <Error />
                                </div>
                            }
                        />
                    </Routes>
                    <Footer />
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
