import style from "./style.module.css";
import { getAllBlogs, likeABlog } from "../../API/internals";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdComment, MdShare, MdThumbUp } from "react-icons/md";
import { useSelector } from "react-redux";

const Blog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    const userId = useSelector((state) => state.userSlice._id);

    useEffect(() => {
        (async function () {
            const response = await getAllBlogs();
            setBlogs(response.data.blogsDTO);
        })();
    }, [isLiked]);

    async function handleLike(blog) {
        const data = { userId, blogId: blog.id };
        const response = await likeABlog(data);

        if (response.status === 200) {
            setIsLiked((prev) => !prev);
        }
    }

    if (blogs.length === 0) {
        return (
            <h1 style={{ textAlign: "center", margin: "3rem 0" }}>
                No Post To Display
            </h1>
        );
    }

    return (
        <div className={style.container}>
            {blogs.map((blog) => {
                return (
                    <div className={style.blog} key={blog.id}>
                        <div className="w-full">
                            <p className=" text-2xl">
                                Author:{" "}
                                <span className="text-blue-600">
                                    @{blog.username}
                                </span>
                            </p>
                            <p>
                                On : {new Date(blog.createdAt).toDateString()}
                            </p>
                        </div>
                        <h1 className="w-full">{blog.title}</h1>
                        <img
                            src={blog.photo}
                            alt="blog"
                            onClick={() => {
                                navigate(`/blog/${blog.id}`);
                            }}
                        />
                        <div className={style.reaction}>
                            <div
                                onClick={() => {
                                    handleLike(blog);
                                }}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                }}
                            >
                                <MdThumbUp
                                    style={
                                        blog.likes.some(
                                            (id) => id === userId
                                        ) && {
                                            background: "blue",
                                            borderRadius: "7px",
                                            padding: "5px",
                                        }
                                    }
                                />
                                <p>{blog.likes.length}</p>
                            </div>
                            <div
                                onClick={() => {
                                    navigate(`/blog/${blog.id}`);
                                }}
                                className={style.comment}
                            >
                                <MdComment />
                                <p>{blog.comments?.length}</p>
                            </div>
                            <MdShare />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Blog;
