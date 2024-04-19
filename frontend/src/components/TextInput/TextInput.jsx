import style from "./style.module.css";
const TextInput = (props) => {
  return (
    <div className={style.textInputWrapper}>
      <input required={true} {...props} />
      <p className={style.errorMessage}>{props.error}</p>
    </div>
  );
};

export default TextInput;
