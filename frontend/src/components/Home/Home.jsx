import React, { useEffect, useState } from "react";
import { getNews } from "../../API/external";
import style from "./style.module.css";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async function newsApiCall() {
            try {
                const response = await getNews();

                if (Array.isArray(response)) {
                    setArticles(response);
                } else {
                    setError("Unexpected response format");
                }
            } catch (err) {
                setError("Failed to fetch news");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleCardClick = (url) => {
        if (url) {
            window.open(url, "_blank");
        }
    };

    if (loading) {
        return <Loader text="Loading Home Page..." />;
    }

    if (error) {
        return <Error message={error} />;
    }

    return (
        <>
            <div className={style.header}>Latest Articles</div>
            <div className={style.grid}>
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <div
                            className={style.card}
                            key={article.article_id}
                            onClick={() => handleCardClick(article.url)}
                        >
                            <img
                                src={
                                    article.thumbnail ||
                                    "https://via.placeholder.com/300x200?text=No+Image"
                                }
                                alt={article.title || "Article Image"}
                            />
                            <h3>{article.title || "No Title Available"}</h3>
                            <p className={style.source}>
                                {article.source?.name || "Unknown Source"}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No articles available.</p>
                )}
            </div>
        </>
    );
};

export default Home;
