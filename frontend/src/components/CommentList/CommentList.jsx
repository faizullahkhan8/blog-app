import style from "./style.module.css";
// import { MessageCircle } from "lucide-react";

const CommentList = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return (
            <p className={style.noComments}>
                No comments yet. Be the first to share your thoughts!
            </p>
        );
    }

    return (
        <div className={style.commentsList}>
            {comments.map((comment) => {
                const date = new Date(comment.createdAt).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                );

                return (
                    <div className={style.commentCard} key={comment._id}>
                        <div className={style.commentHeader}>
                            <div className={style.authorInfo}>
                                {/* <MessageCircle className={style.commentIcon} /> */}
                                <span className={style.author}>
                                    @{comment.author}
                                </span>
                            </div>
                            <span className={style.date}>{date}</span>
                        </div>
                        <p className={style.commentText}>{comment.content}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default CommentList;
