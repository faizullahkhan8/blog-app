import React, { useEffect, useState, useCallback } from "react";
import { likeABlog } from "../../API/internals";
import { useNavigate } from "react-router-dom";
import { MdThumbUp, MdComment, MdShare, MdPerson } from "react-icons/md";
import { useSelector } from "react-redux";
import style from "./style.module.css";
import { useGetAllBlogs } from "../../Hooks/ReactQueryHooks";

const Blog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const userId = useSelector((state) => state.userSlice._id);
    const { data, isLoading: loading, isError: error } = useGetAllBlogs();

    useEffect(() => {
        if (data) {
            setBlogs(data.blogsDTO);
        }
    }, [data]);

    const handleLike = useCallback(
        async (blog) => {
            if (!userId) return;
            const isLiked = blog.likes.includes(userId);
            const blogId = blog.id;

            setBlogs((prev) =>
                prev.map((blog) =>
                    blog.id === blogId
                        ? {
                              ...blog,
                              likes: isLiked
                                  ? blog.likes.filter((id) => id !== userId)
                                  : [...blog.likes, userId],
                          }
                        : blog
                )
            );

            try {
                await likeABlog({ userId, blogId });
            } catch (error) {
                setBlogs((prev) =>
                    prev.map((blog) =>
                        blog.id === blogId
                            ? {
                                  ...blog,
                                  likes: isLiked
                                      ? [...blog.likes, userId]
                                      : blog.likes.filter(
                                            (id) => id !== userId
                                        ),
                              }
                            : blog
                    )
                );
            }
        },
        [userId]
    );

    const handleShare = async (blog) => {
        const url = `${window.location.origin}/blog/${blog.id}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: blog.title, url });
            } else {
                await navigator.clipboard.writeText(url);
            }
        } catch (error) {
            console.error("Share failed:", error);
        }
    };

    if (loading) return <div className={style.loader}>Loading blogs...</div>;
    if (error) return <div className={style.error}>{error}</div>;

    return (
        <div className={style.container}>
            <h1 className={style.title}>Latest Blogs</h1>
            {blogs.length === 0 ? (
                <div className={style.empty}>
                    <p>No blogs yet. Be the first!</p>
                    <button onClick={() => navigate("/submit")}>
                        Create Blog
                    </button>
                </div>
            ) : (
                <div className={style.grid}>
                    {blogs.map((blog) => (
                        <div key={blog.id} className={style.card}>
                            <div className={style.header}>
                                <div className={style.author}>
                                    <MdPerson />@{blog.username}
                                </div>
                                <time className={style.date}>
                                    {new Date(
                                        blog.createdAt
                                    ).toLocaleDateString()}
                                </time>
                            </div>

                            <h3
                                className={style.blogTitle}
                                onClick={() => navigate(`/blog/${blog.id}`)}
                            >
                                {blog.title}
                            </h3>

                            <div
                                className={style.imageBox}
                                onClick={() => navigate(`/blog/${blog.id}`)}
                            >
                                <img src={blog.photo} alt={blog.title} />
                                <div className={style.overlay}>Read More</div>
                            </div>

                            <div className={style.actions}>
                                <button
                                    className={`${style.btn} ${
                                        blog.likes.includes(userId)
                                            ? style.liked
                                            : ""
                                    }`}
                                    onClick={() => handleLike(blog)}
                                >
                                    <MdThumbUp />
                                    <span>{blog.likes.length}</span>
                                </button>

                                <button
                                    className={style.btn}
                                    onClick={() => navigate(`/blog/${blog.id}`)}
                                >
                                    <MdComment />
                                    <span>{blog.comments?.length || 0}</span>
                                </button>

                                <button
                                    className={style.btn}
                                    onClick={() => handleShare(blog)}
                                >
                                    <MdShare />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blog;
