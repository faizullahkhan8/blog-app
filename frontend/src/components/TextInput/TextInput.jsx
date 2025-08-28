import style from "./style.module.css";

const TextInput = ({ error, ...props }) => {
    return (
        <div className={style.textInputWrapper}>
            <input {...props} required />
            {error && <p className={style.errorMessage}>{error}</p>}
        </div>
    );
};

export default TextInput;
