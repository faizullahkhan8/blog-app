import style from "./style.module.css";

const CommentList = ({ comments }) => {
    let date;
    comments.forEach((element, index) => {
        date = new Date(comments[index].createdAt).toDateString();
    });

    return (
        <>
            {comments.map((comment) => {
                return (
                    <div className={style.comment} key={comment._id}>
                        <div className={style.header}>
                            <div className={style.header_det}>
                                <p className={style.author}>
                                    @{comment.author}
                                </p>
                                <div className={style.date}>{date}</div>
                            </div>
                            <div className={style.commentText}>
                                {comment.content}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default CommentList;
