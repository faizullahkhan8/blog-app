import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
    MdEdit,
    MdDelete,
    MdPerson,
    MdAccessTime,
    MdSend,
    MdArrowBack,
    MdShare,
    MdBookmark,
    MdBookmarkBorder,
} from "react-icons/md";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Memoize formatted date
    const formattedDate = useMemo(() => {
        if (!blog?.createdAt) return "";
        return new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }, [blog?.createdAt]);

    // Fetch blog and comments data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [blogRes, commentsRes] = await Promise.all([
                BlogById(blogId),
                getCommentsById(blogId),
            ]);

            if (blogRes.status === 200) {
                setBlog(blogRes.data.singleBlogDTO);
                setIsBlogOwner(
                    username === blogRes.data.singleBlogDTO.authorUserName
                );
            } else {
                setError("Blog not found");
            }

            if (commentsRes.status === 200) {
                setComments(commentsRes.data.data || []);
            }
        } catch (err) {
            console.error("Error fetching blog or comments", err);
            setError("Failed to load blog content");
        } finally {
            setLoading(false);
        }
    }, [blogId, username]);

    useEffect(() => {
        fetchData();
        return () => {
            setBlog(null);
            setComments([]);
            setError(null);
        };
    }, [fetchData]);

    // Delete blog handler with confirmation
    const blogDeleteHandler = useCallback(async () => {
        try {
            const response = await deleteBlog(blogId);
            if (response.status === 200) {
                navigate("/blogs", {
                    state: { message: "Blog deleted successfully" },
                });
            }
        } catch (err) {
            console.error("Delete failed", err);
            setError("Failed to delete blog");
        }
    }, [blogId, navigate]);

    // Post comment handler with optimistic updates
    const postCommentHandler = useCallback(async () => {
        if (!newComment.trim() || commentLoading) return;

        const tempComment = {
            _id: `temp-${Date.now()}`,
            author: username,
            content: newComment.trim(),
            createdAt: new Date().toISOString(),
            isTemp: true,
        };

        try {
            setCommentLoading(true);

            // Optimistic update
            setComments((prev) => [tempComment, ...prev]);
            setNewComment("");

            const response = await postComment({
                author: userId,
                blogId,
                content: newComment.trim(),
            });

            if (response.status === 201) {
                // Remove temp comment and add real one
                setComments((prev) =>
                    prev.filter((c) => c._id !== tempComment._id)
                );
                // Refresh comments to get the real data
                const commentsRes = await getCommentsById(blogId);
                if (commentsRes.status === 200) {
                    setComments(commentsRes.data.data || []);
                }
            } else {
                throw new Error("Failed to post comment");
            }
        } catch (err) {
            console.error("Comment post failed", err);
            // Revert optimistic update
            setComments((prev) =>
                prev.filter((c) => c._id !== tempComment._id)
            );
            setNewComment(tempComment.content); // Restore the comment text
            setError("Failed to post comment. Please try again.");
        } finally {
            setCommentLoading(false);
        }
    }, [newComment, commentLoading, username, userId, blogId]);

    // Share functionality
    const handleShare = useCallback(async () => {
        const shareData = {
            title: blog.title,
            text: `Check out this blog by @${blog.authorUserName}`,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                // You could show a toast notification here
                alert("Link copied to clipboard!");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    }, [blog]);

    // Toggle bookmark
    const toggleBookmark = useCallback(() => {
        setIsBookmarked((prev) => !prev);
        // Here you would typically make an API call to save/remove bookmark
    }, []);

    // Handle Enter key press in comment input
    const handleCommentKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                postCommentHandler();
            }
        },
        [postCommentHandler]
    );

    // Loading state
    if (loading) {
        return (
            <div className={style.container}>
                <div className={style.loadingContainer}>
                    <div className={style.loadingSkeleton}>
                        <div className={style.skeletonHeader}>
                            <div className={style.skeletonTitle}></div>
                            <div className={style.skeletonMeta}></div>
                        </div>
                        <div className={style.skeletonImage}></div>
                        <div className={style.skeletonContent}></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !blog) {
        return (
            <div className={style.container}>
                <div className={style.errorContainer}>
                    <h2 className={style.errorTitle}>Something went wrong</h2>
                    <p className={style.errorMessage}>{error}</p>
                    <div className={style.errorActions}>
                        <button className={style.retryBtn} onClick={fetchData}>
                            Try Again
                        </button>
                        <button
                            className={style.backBtn}
                            onClick={() => navigate("/blogs")}
                        >
                            <MdArrowBack /> Back to Blogs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className={style.container}>
            {/* Back Navigation */}
            <div className={style.backNav}>
                <button
                    className={style.backButton}
                    onClick={() => navigate("/blogs")}
                    aria-label="Back to blogs"
                >
                    <MdArrowBack />
                    <span>Back to Blogs</span>
                </button>
            </div>

            <div className={style.detailWrapper}>
                {/* Main Content */}
                <article className={style.mainContent}>
                    <header className={style.blogHeader}>
                        <h1 className={style.title}>{blog.title}</h1>

                        <div className={style.meta}>
                            <div className={style.authorInfo}>
                                <MdPerson className={style.authorIcon} />
                                <span className={style.author}>
                                    @{blog.authorUserName}
                                </span>
                            </div>
                            <div className={style.dateInfo}>
                                <MdAccessTime className={style.dateIcon} />
                                <time
                                    dateTime={blog.createdAt}
                                    className={style.date}
                                >
                                    {formattedDate}
                                </time>
                            </div>
                        </div>

                        <div className={style.blogActions}>
                            <button
                                className={style.shareBtn}
                                onClick={handleShare}
                                aria-label="Share this blog"
                            >
                                <MdShare />
                                Share
                            </button>
                            <button
                                className={style.bookmarkBtn}
                                onClick={toggleBookmark}
                                aria-label={
                                    isBookmarked
                                        ? "Remove bookmark"
                                        : "Bookmark this blog"
                                }
                            >
                                {isBookmarked ? (
                                    <MdBookmark />
                                ) : (
                                    <MdBookmarkBorder />
                                )}
                                {isBookmarked ? "Bookmarked" : "Bookmark"}
                            </button>
                        </div>
                    </header>

                    <div className={style.imageContainer}>
                        <img
                            src={blog.photo}
                            alt={blog.title}
                            className={style.blogImage}
                        />
                    </div>

                    {/* Owner Controls */}
                    {isBlogOwner && (
                        <div className={style.ownerControls}>
                            <button
                                className={style.editBtn}
                                onClick={() => navigate(`/blog/edit/${blogId}`)}
                                aria-label="Edit blog"
                            >
                                <MdEdit />
                                Edit
                            </button>
                            <button
                                className={style.deleteBtn}
                                onClick={() => setShowDeleteConfirm(true)}
                                aria-label="Delete blog"
                            >
                                <MdDelete />
                                Delete
                            </button>
                        </div>
                    )}
                </article>

                {/* Comments Section */}
                <aside className={style.commentsSection}>
                    <div className={style.commentsHeader}>
                        <h2>Comments ({comments.length})</h2>
                    </div>

                    {/* Comment Input */}
                    <div className={style.commentInput}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={handleCommentKeyPress}
                            className={style.commentTextarea}
                            placeholder="Share your thoughts..."
                            rows={3}
                            maxLength={500}
                        />
                        <div className={style.commentInputFooter}>
                            <span className={style.charCount}>
                                {newComment.length}/500
                            </span>
                            <button
                                className={style.postCommentBtn}
                                onClick={postCommentHandler}
                                disabled={!newComment.trim() || commentLoading}
                            >
                                {commentLoading ? (
                                    <span>Posting...</span>
                                ) : (
                                    <>
                                        <MdSend />
                                        Post
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className={style.commentsList}>
                        {comments.length === 0 ? (
                            <div className={style.noComments}>
                                <p>
                                    No comments yet. Be the first to share your
                                    thoughts!
                                </p>
                            </div>
                        ) : (
                            <CommentList comments={comments} />
                        )}
                    </div>
                </aside>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className={style.modal}>
                    <div className={style.modalContent}>
                        <h3>Delete Blog</h3>
                        <p>
                            Are you sure you want to delete this blog? This
                            action cannot be undone.
                        </p>
                        <div className={style.modalActions}>
                            <button
                                className={style.cancelBtn}
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={style.confirmDeleteBtn}
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    blogDeleteHandler();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {error && (
                <div className={style.errorToast}>
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
