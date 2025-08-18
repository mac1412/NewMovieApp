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

                // In a real implementation, this would call your /embed?url= endpoint
                // For now, we'll create a sanitized iframe directly
                const decodedUrl = decodeURIComponent(url);
                
                // Basic URL validation
                if (!decodedUrl.includes('vidsrc.xyz')) {
                    throw new Error('Invalid video source');
                }

                // Use the embed proxy to get ad-free content
                const proxyUrl = `/embed?url=${encodeURIComponent(decodedUrl)}`;
                
                const sanitizedIframe = `
                    <iframe 
                        src="${proxyUrl}" 
                        width="100%" 
                        height="100%" 
                        frameborder="0" 
                        allowfullscreen
                        sandbox="allow-scripts allow-same-origin allow-presentation"
                        referrerpolicy="origin"
                        title="Video Player"
                    ></iframe>
                `;

                setEmbedHtml(sanitizedIframe);
                setLoading(false);
            } catch (err) {
                setError(err.message || 'Failed to load video');
                setLoading(false);
            }
        };

        fetchEmbed();
    }, [url]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="watch-page">
                <div className="watch-header">
                    <button className="back-button" onClick={handleGoBack} aria-label="Go back">
                        <i className="bx bx-arrow-back"></i>
                        Back
                    </button>
                    <div className="watch-title">
                        <h1>{title || 'Loading...'}</h1>
                        {year && <span className="year">({year})</span>}
                    </div>
                </div>
                <div className="watch-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading video player...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="watch-page">
                <div className="watch-header">
                    <button className="back-button" onClick={handleGoBack} aria-label="Go back">
                        <i className="bx bx-arrow-back"></i>
                        Back
                    </button>
                    <div className="watch-title">
                        <h1>{title || 'Error'}</h1>
                        {year && <span className="year">({year})</span>}
                    </div>
                </div>
                <div className="watch-container">
                    <div className="error-state">
                        <i className="bx bx-error-circle"></i>
                        <h2>Unable to load video</h2>
                        <p>{error}</p>
                        <button className="retry-button" onClick={() => window.location.reload()}>
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="watch-page">
            <div className="watch-header">
                <button className="back-button" onClick={handleGoBack} aria-label="Go back">
                    <i className="bx bx-arrow-back"></i>
                    Back
                </button>
                <div className="watch-title">
                    <h1>{title}</h1>
                    {year && <span className="year">({year})</span>}
                </div>
            </div>
            <div className="watch-container">
                <div 
                    className="video-embed" 
                    dangerouslySetInnerHTML={{ __html: embedHtml }}
                />
            </div>
        </div>
    );
};

export default Watch;