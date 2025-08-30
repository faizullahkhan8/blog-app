import { useState, useMemo, useCallback } from "react";
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
import toast from "react-hot-toast";

import style from "./style.module.css";
import CommentList from "../CommentList/CommentList";

import { useGetBlog, useGetComments } from "../../Hooks/ReactQueryHooks";
import { postComment, deleteBlog } from "../../API/internals";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BlogDetail = () => {
    const navigate = useNavigate();
    const { id: blogId } = useParams();

    const username = useSelector((state) => state.userSlice.username);
    const userId = useSelector((state) => state.userSlice._id);

    const [newComment, setNewComment] = useState("");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const queryClient = useQueryClient();

    // Fetch blog and comments via React Query
    const {
        data: blog,
        isLoading: blogLoading,
        error: blogError,
    } = useGetBlog(blogId);

    const {
        data: comments = [],
        isLoading: commentsLoading,
        error: commentsError,
    } = useGetComments(blogId);

    // Check ownership
    const isBlogOwner = username && blog?.authorUserName === username;

    // Format date
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

    // Delete blog mutation
    const deleteMutation = useMutation({
        mutationFn: () => deleteBlog(blogId),
        onSuccess: () => {
            queryClient.invalidateQueries(["blogs"]);
            toast.success("Blog deleted successfully");
            navigate("/blogs");
        },
        onError: () => {
            toast.error("Failed to delete blog");
        },
    });

    // Post comment mutation with optimistic update
    const commentMutation = useMutation({
        mutationFn: (content) =>
            postComment({ author: userId, blogId, content }),
        onMutate: async (content) => {
            await queryClient.cancelQueries(["comments", blogId]);

            const previousComments = queryClient.getQueryData([
                "comments",
                blogId,
            ]);

            const tempComment = {
                _id: `temp-${Date.now()}`,
                author: username,
                content,
                createdAt: new Date().toISOString(),
                isTemp: true,
            };

            queryClient.setQueryData(["comments", blogId], (old = []) => [
                tempComment,
                ...old,
            ]);

            return { previousComments };
        },
        onError: (_err, _newComment, context) => {
            queryClient.setQueryData(
                ["comments", blogId],
                context.previousComments
            );
            toast.error("Failed to post comment. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries(["comments", blogId]);
        },
    });

    // Share functionality
    const handleShare = useCallback(async () => {
        const shareData = {
            title: blog?.title,
            text: `Check out this blog by @${blog?.authorUserName}`,
            url: window.location.href,
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            toast.error("Error sharing: " + error.message);
        }
    }, [blog]);

    // Toggle bookmark
    const toggleBookmark = useCallback(() => {
        setIsBookmarked((prev) => !prev);
        // API call can be added here
    }, []);

    // Handle Enter key press in comment input
    const handleCommentKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (newComment.trim()) {
                    commentMutation.mutate(newComment.trim());
                    setNewComment("");
                }
            }
        },
        [newComment, commentMutation]
    );

    // Loading state
    if (blogLoading || commentsLoading) {
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
    if (blogError || commentsError) {
        return (
            <div className={style.container}>
                <div className={style.errorContainer}>
                    <h2 className={style.errorTitle}>Something went wrong</h2>
                    <p className={style.errorMessage}>
                        {blogError?.message || commentsError?.message}
                    </p>
                    <div className={style.errorActions}>
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
                                onClick={() => {
                                    if (newComment.trim()) {
                                        commentMutation.mutate(
                                            newComment.trim()
                                        );
                                        setNewComment("");
                                    }
                                }}
                                disabled={
                                    !newComment.trim() ||
                                    commentMutation.isLoading
                                }
                            >
                                {commentMutation.isLoading ? (
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
                                    deleteMutation.mutate();
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogDetail;
