import { useState, useCallback } from "react";
import style from "./style.module.css";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { useGetCryptoNews } from "../../Hooks/ReactQueryHooks";

const Home = () => {
    const [imageErrors, setImageErrors] = useState(new Set());

    const { data, isLoading, isError } = useGetCryptoNews();

    const handleCardClick = useCallback(
        (url, event) => {
            // Prevent click if it's on an image that failed to load
            if (
                event?.target?.tagName === "IMG" &&
                imageErrors.has(event.target.src)
            ) {
                return;
            }

            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
        },
        [imageErrors]
    );

    const handleImageError = useCallback((imageSrc) => {
        setImageErrors((prev) => new Set([...prev, imageSrc]));
    }, []);

    const handleImageLoad = useCallback((imageSrc) => {
        setImageErrors((prev) => {
            const newSet = new Set(prev);
            newSet.delete(imageSrc);
            return newSet;
        });
    }, []);

    if (isLoading) {
        return <Loader text="Loading Latest Articles..." />;
    }

    if (isError) {
        return (
            <div className={style.container}>
                <Error message={isError} />
                <button
                    className={style.retryButton}
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={style.container}>
            <header className={style.header}>
                <h1>Latest Articles</h1>
                <p className={style.subtitle}>
                    Stay updated with the latest news and insights
                </p>
            </header>

            {data?.results.length > 0 ? (
                <section className={style.grid} role="main">
                    {data?.results.map((article, index) => (
                        <article
                            className={style.card}
                            key={article.article_id || `article-${index}`}
                            onClick={(e) => handleCardClick(article.url, e)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleCardClick(article.url, e);
                                }
                            }}
                            aria-label={`Read article: ${
                                article.title || "Untitled article"
                            }`}
                        >
                            <div className={style.imageContainer}>
                                <img
                                    src={
                                        article.thumbnail &&
                                        !imageErrors.has(article.thumbnail)
                                            ? article.thumbnail
                                            : "https://via.placeholder.com/300x200/1a1a1a/ffffff?text=No+Image"
                                    }
                                    alt={article.title || "Article thumbnail"}
                                    className={style.cardImage}
                                    onError={() =>
                                        handleImageError(article.thumbnail)
                                    }
                                    onLoad={() =>
                                        handleImageLoad(article.thumbnail)
                                    }
                                    loading="lazy"
                                />
                                {article.source?.name && (
                                    <div className={style.sourceOverlay}>
                                        {article.source.name}
                                    </div>
                                )}
                            </div>

                            <div className={style.cardContent}>
                                <h3 className={style.cardTitle}>
                                    {article.title || "Untitled Article"}
                                </h3>

                                {article.description && (
                                    <p className={style.cardDescription}>
                                        {article.description.length > 120
                                            ? `${article.description.substring(
                                                  0,
                                                  120
                                              )}...`
                                            : article.description}
                                    </p>
                                )}

                                <div className={style.cardMeta}>
                                    <span className={style.source}>
                                        {article.source?.name ||
                                            "Unknown Source"}
                                    </span>
                                    {article.publishedAt && (
                                        <span className={style.date}>
                                            {new Date(
                                                article.publishedAt
                                            ).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <div className={style.emptyState}>
                    <div className={style.emptyIcon}>📰</div>
                    <h2>No Articles Available</h2>
                    <p>
                        We couldn't find any articles at the moment. Please try
                        again later.
                    </p>
                    <button
                        className={style.retryButton}
                        onClick={() => window.location.reload()}
                    >
                        Refresh
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
