import React from "react";
import { Link, useLocation } from "react-router-dom";
import style from "./style.module.css";

const Error = ({ message }) => {
  const location = useLocation();
  return (
    <div className={style.errorWrapper}>
      <div className={style.error}>
        {message ? message : `404 - ${location.pathname} Not Found`}
      </div>
      <div className={style.link}>
        Go back to{" "}
        <Link to="/" className="text-green-600 font-bold">
          Home
        </Link>
      </div>
    </div>
  );
};

export default Error;
