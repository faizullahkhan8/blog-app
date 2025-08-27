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
    const { id: blogId } = useParams();

    const username = useSelector((state) => state.userSlice.username);
    const userId = useSelector((state) => state.userSlice._id);

    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isBlogOwner, setIsBlogOwner] = useState(false);

    // fetch blog + comments
    const fetchData = async () => {
        try {
            const blogRes = await BlogById(blogId);
            if (blogRes.status === 200) {
                setBlog(blogRes.data.singleBlogDTO);
                setIsBlogOwner(
                    username === blogRes.data.singleBlogDTO.authorUserName
                );
            }

            const commentsRes = await getCommentsById(blogId);
            if (commentsRes.status === 200) {
                setComments(commentsRes.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching blog or comments", err);
        }
    };

    useEffect(() => {
        fetchData();
        return () => {
            setBlog(null);
            setComments([]);
        };
    }, [blogId, username]);

    const blogDeleteHandler = async () => {
        try {
            const response = await deleteBlog(blogId);
            if (response.status === 200) {
                navigate("/blogs");
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    const postCommentHandler = async () => {
        if (!newComment.trim()) return;

        const data = {
            author: userId,
            blogId,
            content: newComment,
        };

        try {
            const response = await postComment(data);
            if (response.status === 201) {
                setNewComment("");
                fetchData(); // reload fresh comments after posting
            }
        } catch (err) {
            console.error("Comment post failed", err);
        }
    };

    if (!blog) return <div>Loading...</div>;

    return (
        <div className={style.detailWrapper}>
            <div className={style.left}>
                <h1 className={style.title}>{blog.title}</h1>
                <div className={style.meta}>
                    <p className={style.author}>@{blog.authorUserName}</p>
                    {" on " + new Date(blog.createdAt).toDateString()}
                </div>
                <div className={style.image}>
                    <img src={blog.photo} width={500} alt="blogImage" />
                </div>

                {isBlogOwner && (
                    <div className={style.controller}>
                        <button
                            className={style.edit}
                            onClick={() => navigate(`/blog/edit/${blogId}`)}
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
                    <div className={style.commentList}>
                        {comments.length === 0 ? (
                            <p>No comments yet</p>
                        ) : (
                            <CommentList comments={comments} />
                        )}
                    </div>

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
