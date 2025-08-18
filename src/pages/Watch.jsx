import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Watch.scss';

const Watch = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [embedHtml, setEmbedHtml] = useState('');

    const url = searchParams.get('url');
    const title = searchParams.get('title');
    const year = searchParams.get('year');
    const poster = searchParams.get('poster');
    const backdrop = searchParams.get('backdrop');
    const overview = searchParams.get('overview');
    const genres = searchParams.get('genres');

    useEffect(() => {
        if (!url) {
            setError('No video URL provided');
            setLoading(false);
            return;
        }

        const fetchEmbed = async () => {
            try {
                setLoading(true);
                setError(null);

                const decodedUrl = decodeURIComponent(url);
                
                if (!decodedUrl.includes('vidsrc.xyz')) {
                    throw new Error('Invalid video source');
                }

                // Call the embed proxy endpoint
                const proxyUrl = `/api/embed?url=${encodeURIComponent(decodedUrl)}`;
                const response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const htmlContent = await response.text();
                setEmbedHtml(htmlContent);
                setLoading(false);
            } catch (err) {
                console.error('Embed fetch error:', err);
                setError(err.message || 'Failed to load video');
                setLoading(false);
            }
        };

        fetchEmbed();
    }, [url]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const genresList = genres ? JSON.parse(decodeURIComponent(genres)) : [];

    return (
        <div className="watch-page">
            {/* Hero Section */}
            <div 
                className="watch-hero" 
                style={{
                    backgroundImage: backdrop ? `url(${backdrop})` : 'none'
                }}
            >
                <div className="watch-hero__overlay">
                    <div className="watch-hero__content container">
                        <div className="watch-hero__poster">
                            {poster && (
                                <img src={poster} alt={title} />
                            )}
                        </div>
                        <div className="watch-hero__info">
                            <div className="watch-toolbar">
                                <button 
                                    className="back-button" 
                                    onClick={handleGoBack} 
                                    aria-label="Go back"
                                >
                                    <i className="bx bx-arrow-back"></i>
                                    Back
                                </button>
                                <div className="watch-status">
                                    <span>Playing</span>
                                </div>
                            </div>
                            
                            <h1 className="watch-title">
                                {title}
                                {year && <span className="year">({year})</span>}
                            </h1>
                            
                            <div className="watch-genres">
                                {genresList.map((genre, i) => (
                                    <span key={i} className="genre-tag">{genre}</span>
                                ))}
                            </div>
                            
                            {overview && (
                                <p className="watch-overview">{overview}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Player Section */}
            <div className="watch-player-section">
                <div className="container">
                    <div 
                        className="watch-player" 
                        role="region" 
                        aria-label={`Video player for ${title}`}
                    >
                        {loading && (
                            <div className="player-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading player...</p>
                            </div>
                        )}

                        {error && (
                            <div className="player-error">
                                <i className="bx bx-error-circle"></i>
                                <h3>Unable to load video</h3>
                                <p>{error}</p>
                                <div className="error-actions">
                                    <button className="retry-button" onClick={handleRetry}>
                                        <i className="bx bx-refresh"></i>
                                        Try Again
                                    </button>
                                    <button className="back-button-error" onClick={handleGoBack}>
                                        <i className="bx bx-arrow-back"></i>
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        )}

                        {!loading && !error && embedHtml && (
                            <div 
                                className="player-embed" 
                                dangerouslySetInnerHTML={{ __html: embedHtml }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Trailer Section */}
            <div className="watch-extras">
                <div className="container">
                    <div className="extras-section">
                        <h3>International Trailer</h3>
                        <div className="trailer-placeholder">
                            <div className="trailer-thumb">
                                <i className="bx bx-play-circle"></i>
                                <span>Trailer Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;