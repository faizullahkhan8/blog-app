import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <style jsx>{`
                .footer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    background: linear-gradient(
                        135deg,
                        rgba(15, 15, 15, 0.95),
                        rgba(30, 30, 30, 0.95)
                    );
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .footer::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        #3861fb,
                        #00d4ff,
                        transparent
                    );
                    animation: shimmer 3s ease-in-out infinite;
                }

                .content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    position: relative;
                    z-index: 1;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #3861fb, #00d4ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    transition: all 0.3s ease;
                }

                .brand:hover {
                    transform: scale(1.05);
                    filter: drop-shadow(0 4px 8px rgba(56, 97, 251, 0.3));
                }

                .logo {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #3861fb, #00d4ff);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 1.2rem;
                    box-shadow: 0 4px 12px rgba(56, 97, 251, 0.3);
                    transition: all 0.3s ease;
                }

                .brand:hover .logo {
                    transform: rotate(5deg);
                    box-shadow: 0 6px 16px rgba(56, 97, 251, 0.5);
                }

                .copyright {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 0.95rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .year {
                    color: rgba(255, 255, 255, 0.8);
                    font-weight: 600;
                }

                .tagline {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.85rem;
                    font-style: italic;
                    margin-top: 0.5rem;
                }

                .socialLinks {
                    display: flex;
                    gap: 1rem;
                    margin-top: 0.5rem;
                }

                .socialLink {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(5px);
                }

                .socialLink:hover {
                    background: rgba(56, 97, 251, 0.2);
                    border-color: #3861fb;
                    color: #3861fb;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(56, 97, 251, 0.2);
                }

                @keyframes shimmer {
                    0% {
                        opacity: 0;
                        transform: translateX(-100%);
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .footer {
                        padding: 1.5rem 1rem;
                    }

                    .brand {
                        font-size: 1.3rem;
                    }

                    .socialLinks {
                        gap: 0.8rem;
                    }

                    .socialLink {
                        width: 36px;
                        height: 36px;
                    }
                }

                @media (max-width: 480px) {
                    .content {
                        gap: 0.8rem;
                    }

                    .brand {
                        font-size: 1.2rem;
                        gap: 0.6rem;
                    }

                    .logo {
                        width: 28px;
                        height: 28px;
                        font-size: 1rem;
                    }

                    .copyright {
                        font-size: 0.9rem;
                        text-align: center;
                    }

                    .tagline {
                        font-size: 0.8rem;
                        text-align: center;
                    }
                }
            `}</style>

            <footer className="footer">
                <div className="content">
                    <div className="brand">
                        <div className="logo">B</div>
                        <span>blogbook</span>
                    </div>

                    <div className="copyright">
                        <span>&copy;</span>
                        <span className="year">{currentYear}</span>
                        <span>blogbook. All rights reserved.</span>
                    </div>

                    <div className="tagline">
                        Share your stories with the world
                    </div>

                    <div className="socialLinks">
                        <a href="#" className="socialLink" title="Twitter">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="#" className="socialLink" title="GitHub">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="#" className="socialLink" title="LinkedIn">
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
