import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
    getCommentsById,
    postComment,
    BlogById,
    deleteBlog,
} from "../../API/internals";

import CommentList from "../CommentList/CommentList";

import style from "./style.module.css";

const BlogDetail = () => {
    const navigate = useNavigate();
    // useSelector((state)=>state.userSlice.id)

    const params = useParams();
    const blogId = params.id;

    const username = useSelector((state) => state.userSlice.username);

    const userId = useSelector((state) => state.userSlice._id);

    const [blog, setBlog] = useState([]);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [isBlogOwner, setIsBlogOwner] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        let response;
        (async function () {
            response = await BlogById(blogId);
            if (response.status === 200) {
                setBlog(response.data.singleBlogDTO);
                setIsBlogOwner(
                    username === response.data.singleBlogDTO.authorUserName
                );
            }

            response = await getCommentsById(blogId);
            if (response.status === 200) {
                setComments(response.data.data);
            }
        })();

        setBlog([]);
        setComments([]);
    }, [reload]);

    const blogDeleteHandler = async () => {
        const response = await deleteBlog(blogId);

        console.log(response);

        if (response.status === 200) {
            navigate("/blogs");
        }
    };

    const postCommentHandler = async () => {
        const data = {
            author: userId,
            blog: blogId,
            content: newComment,
        };

        const response = await postComment(data);

        if (response.status === 201) {
            setNewComment("");
            setReload(!reload);
        }
    };

    return (
        <div className={style.detailWrapper}>
            <div className={style.left}>
                <h1 className={style.title}>{blog.title}</h1>
                <div className={style.meta}>
                    <p className={style.author}>@{blog.authorUserName}</p>
                    {" on " + new Date(blog.createdAt).toDateString()}
                </div>
                <div className={style.image}>
                    <img
                        src={blog.photo}
                        width={500}
                        height={500}
                        alt="blogImage"
                    />
                </div>
                {isBlogOwner && (
                    <div className={style.controller}>
                        <button
                            className={style.edit}
                            onClick={() => {
                                navigate(`/blog/edit/${blogId}`);
                            }}
                        >
                            Edit
                        </button>
                        <button
                            className={style.delete}
                            onClick={blogDeleteHandler}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <div className={style.right}>
                <div className={style.commentsWrapper}>
                    {!comments ? (
                        "No Comment Yet"
                    ) : (
                        <div className={style.commentList}>
                            <CommentList comments={comments} />
                        </div>
                    )}
                    <div className={style.postComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className={style.input}
                            placeholder="comment goes here..."
                        />
                        <button
                            className={style.postCommentButton}
                            onClick={postCommentHandler}
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
