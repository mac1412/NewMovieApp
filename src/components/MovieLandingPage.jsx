import React, { useState, useEffect, useRef } from 'react';
import { fetchTMDBMovieDetails, tmdbPosterUrl } from '../utils/vidsrc-tmdb-utils';
import { buildMovieEmbedWithTMDB } from '../utils/vidsrc-tmdb-utils';

const MovieLandingPage = ({ tmdbApiKey, tmdbId = 385687, proxyUrl }) => {
  const [movieData, setMovieData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef(null);
  const playButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (tmdbApiKey && tmdbId) {
      fetchTMDBMovieDetails(tmdbId, tmdbApiKey)
        .then(setMovieData)
        .catch(console.error);
    }
  }, [tmdbApiKey, tmdbId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isPlaying) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isPlaying]);

  const handlePlay = async () => {
    setLoading(true);
    try {
      // Build VidSrc URL
      const vidsrcUrl = buildMovieEmbedWithTMDB({ 
        tmdb: tmdbId, 
        autoplay: 1 
      });

      // Use proxy if provided, otherwise direct URL
      const finalUrl = proxyUrl 
        ? `${proxyUrl}/api/embed?url=${encodeURIComponent(vidsrcUrl)}`
        : vidsrcUrl;

      setIframeSrc(finalUrl);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIframeSrc('');
    setIsPlaying(false);
    if (playButtonRef.current) {
      playButtonRef.current.focus();
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const posterUrl = movieData?.poster_path 
    ? tmdbPosterUrl(movieData.poster_path, 'w500')
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">t</span>
          </div>
          <span className="text-xl font-bold">tMovies</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-white hover:text-red-400 transition-colors">Home</a>
          <a href="#" className="text-white hover:text-red-400 transition-colors">Movies</a>
          <a href="#" className="text-white hover:text-red-400 transition-colors">TV Series</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: movieData?.backdrop_path 
              ? `url(${tmdbPosterUrl(movieData.backdrop_path, 'original')})`
              : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Movie Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 max-w-4xl">
            {movieData?.title || 'Featured Movie'}
          </h1>
          
          {/* Player Container */}
          <div className="relative w-full max-w-4xl mx-auto">
            <div 
              className="bg-gray-700 rounded-2xl shadow-2xl overflow-hidden"
              style={{ height: '480px' }}
            >
              {!isPlaying ? (
                /* Placeholder with Play Button */
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800">
                  {posterUrl && (
                    <img 
                      src={posterUrl}
                      alt={movieData?.title || 'Movie poster'}
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                  )}
                  
                  <button
                    ref={playButtonRef}
                    onClick={handlePlay}
                    onKeyDown={(e) => handleKeyDown(e, handlePlay)}
                    disabled={loading}
                    className="relative z-10 w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Play ${movieData?.title || 'movie'}`}
                  >
                    {loading ? (
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg 
                        className="w-8 h-8 text-white ml-1" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                /* Video Player */
                <div className="relative w-full h-full">
                  <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    loading="lazy"
                    title={`${movieData?.title || 'Movie'} Player`}
                  />
                  
                  {/* Close Button */}
                  <button
                    ref={closeButtonRef}
                    onClick={handleClose}
                    onKeyDown={(e) => handleKeyDown(e, handleClose)}
                    className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    aria-label="Close player"
                  >
                    <svg 
                      className="w-6 h-6 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Movie Description */}
          {movieData?.overview && (
            <p className="text-lg text-gray-300 text-center max-w-3xl mt-8 leading-relaxed">
              {movieData.overview}
            </p>
          )}

          {/* CTA Text */}
          <p className="text-xl text-gray-400 text-center mt-6">
            Click play to start watching instantly
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 tMovies. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Do not embed content you are not licensed to stream. Confirm VidSrc terms and copyright laws before embedding.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MovieLandingPage;