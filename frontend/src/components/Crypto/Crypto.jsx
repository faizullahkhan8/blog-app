import style from "./style.module.css";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { useGetCryptoData } from "../../Hooks/ReactQueryHooks";

const Crypto = () => {
    const { data, isLoading, isError } = useGetCryptoData();

    if (isError) {
        return <Error message={isError.message} />;
    }

    if (isLoading) {
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
                                    <img
                                        src={coin.image}
                                        width={40}
                                        height={40}
                                        alt="coin-logo"
                                    />
                                    <p>{coin.name}</p>
                                </div>
                            </td>
                            <td>
                                <div className={style.symbol}>
                                    {coin.symbol}
                                </div>
                            </td>
                            <td>{coin.current_price}</td>
                            <td
                                style={
                                    coin.price_change_percentage_24h < 0
                                        ? { color: "red" }
                                        : { color: "green" }
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
