import style from "./style.module.css";
import { getAllBlogs } from "../../API/internals";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdComment, MdShare, MdThumbUp } from "react-icons/md";
import { AiOutlineShareAlt } from "react-icons/ai";

const Blog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        (async function () {
            const response = await getAllBlogs();
            setBlogs(response.data.blogsDTO);
        })();
    }, []);

    if (blogs.length === 0) {
        return (
            <h1 style={{ textAlign: "center", margin: "3rem 0" }}>
                No Post To Display
            </h1>
        );
    }

    console.log(blogs);

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
                            <MdThumbUp />
                            <MdComment />
                            <MdShare />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Blog;
