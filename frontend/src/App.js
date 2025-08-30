import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import style from "./App.module.css";
import Protected from "./components/Protected/Protected";
import Error from "./components/Error/Error";
import Login from "./components/LogIn/Login";
import Signup from "./components/Signup/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Crypto from "./components/Crypto/Crypto";
import Blog from "./components/Blog/Blog";
import SubmitABlog from "./components/SubmitBlog/SubmitBlog";
import BlogDetail from "./components/BlogDetail/BlogDetail";
import UpdateBlog from "./components/UpdateBlog/UpdateBlog";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
    return (
        <div className={style.container}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <div className={style.layout}>
                        <Navbar />
                        <Routes>
                            {/* Home route */}
                            <Route
                                path="/"
                                exact
                                element={
                                    <div className={style.main}>
                                        <Protected>
                                            <Home />
                                        </Protected>
                                    </div>
                                }
                            />
                            {/* crypto route */}
                            <Route
                                path="/crypto"
                                exact
                                element={
                                    <div className={style.main}>
                                        <Protected>
                                            <Crypto />
                                        </Protected>
                                    </div>
                                }
                            />
                            {/* blog */}
                            <Route
                                path="/blogs"
                                element={
                                    <Protected>
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
                                    <Protected>
                                        <div className={style.main}>
                                            <BlogDetail />
                                        </div>
                                    </Protected>
                                }
                            />

                            {/* update a blog */}
                            <Route
                                path="/blog/edit/:id"
                                element={
                                    <Protected>
                                        <div className={style.main}>
                                            <UpdateBlog />
                                        </div>
                                    </Protected>
                                }
                            />

                            {/* submit a blog route */}
                            <Route
                                path="/submit"
                                element={
                                    <Protected>
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
                </QueryClientProvider>
            </BrowserRouter>
        </div>
    );
};

export default App;
