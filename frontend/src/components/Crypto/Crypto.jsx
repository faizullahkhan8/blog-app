import style from "./style.module.css";
import { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import { getCrypto } from "../../API/external";
import Error from "../Error/Error";

const Crypto = () => {
  const [data, setData] = useState([]);

  const negetiveStyle = {
    color: "red",
  };
  const positiveStyle = {
    color: "green",
  };

  useEffect(() => {
    (async function cryptoApiCall() {
      const response = await getCrypto();
      setData(response);
    })();

    // cleanup
    setData([]);
  }, []);

  if (data.code === "ERR_NETWORK") {
    return <Error message={"No Internet Connection"} />;
  }

  if (data.length == 0) {
    return <Loader message={"cryptocurrencies"} />;
  }
  return (
    <table className={style.table}>
      <thead className={style.head}>
        <tr>
          <th>#</th>
          <th>Coin</th>
          <th>Symbol</th>
          <th>Price</th>
          <th>24H</th>
        </tr>
      </thead>
      <tbody>
        {data.map((coin) => {
          return (
            <tr key={coin.id} className={style.tableRow}>
              <td>{coin.market_cap_rank}</td>
              <td>
                <div className={style.logo}>
                  <img src={coin.image} width={40} height={40} alt={"image"} />
                  <p>{coin.name}</p>
                </div>
              </td>
              <td>
                <div className={style.symbol}>{coin.symbol}</div>
              </td>
              <td>{coin.current_price}</td>
              <td
                style={
                  coin.price_change_percentage_24h < 0
                    ? negetiveStyle
                    : positiveStyle
                }
              >
                {coin.price_change_percentage_24h}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Crypto;
