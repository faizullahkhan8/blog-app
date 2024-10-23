import { TailSpin } from "react-loader-spinner";
import style from "./style.module.css";

const Loader = ({ text }) => {
    return (
        <div className={style.loaderWrapper}>
            <h2>Loading... {text}</h2>
            <TailSpin height={80} width={80} radius={1} color={"#3861fb"} />
        </div>
    );
};

export default Loader;
