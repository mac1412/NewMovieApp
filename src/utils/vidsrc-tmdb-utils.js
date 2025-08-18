import axios from 'axios';

/**
 * TMDB-aware VidSrc helper functions and TMDB metadata fetch helpers
 */

// TMDB API base URLs
const TMDB_API_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

/**
 * Build VidSrc movie embed URL with TMDB ID
 * @param {Object} params - Parameters
 * @param {number} params.tmdb - TMDB movie ID
 * @param {string} [params.sub_url] - Subtitle URL (must be CORS-enabled)
 * @param {string} [params.ds_lang] - Display language
 * @param {number} [params.autoplay=1] - Autoplay setting
 * @returns {string} VidSrc embed URL
 */
export const buildMovieEmbedWithTMDB = ({ tmdb, sub_url, ds_lang, autoplay = 1 }) => {
  const params = new URLSearchParams();
  params.append('tmdb', tmdb.toString());
  
  if (sub_url) params.append('sub_url', sub_url);
  if (ds_lang) params.append('ds_lang', ds_lang);
  if (autoplay !== undefined) params.append('autoplay', autoplay.toString());
  
  return `https://vidsrc.xyz/embed/movie?${params.toString()}`;
};

/**
 * Build VidSrc TV show embed URL with TMDB ID
 * @param {Object} params - Parameters
 * @param {number} params.tmdb - TMDB TV show ID
 * @param {string} [params.ds_lang] - Display language
 * @returns {string} VidSrc embed URL
 */
export const buildTvEmbedWithTMDB = ({ tmdb, ds_lang }) => {
  const params = new URLSearchParams();
  params.append('tmdb', tmdb.toString());
  
  if (ds_lang) params.append('ds_lang', ds_lang);
  
  return `https://vidsrc.xyz/embed/tv?${params.toString()}`;
};

/**
 * Build VidSrc episode embed URL with TMDB ID
 * @param {Object} params - Parameters
 * @param {number} params.tmdb - TMDB TV show ID
 * @param {number} params.season - Season number
 * @param {number} params.episode - Episode number
 * @param {string} [params.sub_url] - Subtitle URL (must be CORS-enabled)
 * @param {string} [params.ds_lang] - Display language
 * @param {number} [params.autoplay=1] - Autoplay setting
 * @param {number} [params.autonext=0] - Auto-next episode setting
 * @returns {string} VidSrc embed URL
 */
export const buildEpisodeEmbedWithTMDB = ({ 
  tmdb, 
  season, 
  episode, 
  sub_url, 
  ds_lang, 
  autoplay = 1, 
  autonext = 0 
}) => {
  const params = new URLSearchParams();
  params.append('tmdb', tmdb.toString());
  params.append('season', season.toString());
  params.append('episode', episode.toString());
  
  if (sub_url) params.append('sub_url', sub_url);
  if (ds_lang) params.append('ds_lang', ds_lang);
  if (autoplay !== undefined) params.append('autoplay', autoplay.toString());
  if (autonext !== undefined) params.append('autonext', autonext.toString());
  
  return `https://vidsrc.xyz/embed/tv?${params.toString()}`;
};

/**
 * Fetch movie details from TMDB API
 * @param {number} tmdbId - TMDB movie ID
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Object>} Movie details
 */
export const fetchTMDBMovieDetails = async (tmdbId, apiKey) => {
  try {
    const response = await axios.get(`${TMDB_API_BASE}/movie/${tmdbId}`, {
      params: { api_key: apiKey },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TMDB movie details:', error);
    throw new Error(`Failed to fetch movie details: ${error.message}`);
  }
};

/**
 * Fetch TV show details from TMDB API
 * @param {number} tmdbId - TMDB TV show ID
 * @param {string} apiKey - TMDB API key
 * @returns {Promise<Object>} TV show details
 */
export const fetchTMDBTvDetails = async (tmdbId, apiKey) => {
  try {
    const response = await axios.get(`${TMDB_API_BASE}/tv/${tmdbId}`, {
      params: { api_key: apiKey },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TMDB TV details:', error);
    throw new Error(`Failed to fetch TV show details: ${error.message}`);
  }
};

/**
 * Generate TMDB poster URL
 * @param {string} path - Poster path from TMDB API
 * @param {string} [size='w780'] - Image size (w92, w154, w185, w342, w500, w780, original)
 * @returns {string} Full poster URL
 */
export const tmdbPosterUrl = (path, size = 'w780') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

/**
 * Generate TMDB backdrop URL
 * @param {string} path - Backdrop path from TMDB API
 * @param {string} [size='original'] - Image size (w300, w780, w1280, original)
 * @returns {string} Full backdrop URL
 */
export const tmdbBackdropUrl = (path, size = 'original') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};