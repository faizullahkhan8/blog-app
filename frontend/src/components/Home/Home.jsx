import React, { useEffect, useState } from "react";
import { getNews } from "../../API/external";
import style from "./style.module.css";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

const Home = () => {
  const [ariticals, setAriticals] = useState([]);
  useEffect(() => {
    (async function newsApiCall() {
      const response = await getNews();
      setAriticals(response);
    })();

    setAriticals([]);
  }, []);

  const handleCardClick = (url) => {
    window.open(url, "_blank");
  };

  if (ariticals.length === 0) {
    return <Loader text={"Home Page"} />;
  }

  return (
    <>
      {ariticals.code === "ERR_NETWORK" ? (
        <Error message={"No Internet Connection"} />
      ) : (
        <>
          <div className={style.header}>Lastest Articles</div>
          <div className={style.grid}>
            {ariticals.map((aritical) => {
              return (
                <div
                  className={style.card}
                  key={aritical.url}
                  onClick={() => handleCardClick(aritical.url)}
                >
                  <img src={aritical.urlToImage} />
                  <h3>{aritical.title}</h3>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};
export default Home;
