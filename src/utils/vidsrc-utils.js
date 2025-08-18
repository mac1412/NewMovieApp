import axios from 'axios';

/**
 * General VidSrc URL builders and latest content fetch helpers
 */

/**
 * Build VidSrc movie embed URL
 * @param {Object} params - Parameters
 * @param {string} [params.imdb] - IMDB ID
 * @param {number} [params.tmdb] - TMDB ID
 * @param {string} [params.sub_url] - Subtitle URL (must be CORS-enabled)
 * @param {string} [params.ds_lang] - Display language
 * @param {number} [params.autoplay] - Autoplay setting
 * @returns {string} VidSrc embed URL
 */
export const buildMovieEmbed = ({ imdb, tmdb, sub_url, ds_lang, autoplay }) => {
  const params = new URLSearchParams();
  
  if (imdb) params.append('imdb', imdb);
  if (tmdb) params.append('tmdb', tmdb.toString());
  if (sub_url) params.append('sub_url', sub_url);
  if (ds_lang) params.append('ds_lang', ds_lang);
  if (autoplay !== undefined) params.append('autoplay', autoplay.toString());
  
  return `https://vidsrc.xyz/embed/movie?${params.toString()}`;
};

/**
 * Build VidSrc TV show embed URL
 * @param {Object} params - Parameters
 * @param {string} [params.imdb] - IMDB ID
 * @param {number} [params.tmdb] - TMDB ID
 * @param {string} [params.ds_lang] - Display language
 * @returns {string} VidSrc embed URL
 */
export const buildTvEmbed = ({ imdb, tmdb, ds_lang }) => {
  const params = new URLSearchParams();
  
  if (imdb) params.append('imdb', imdb);
  if (tmdb) params.append('tmdb', tmdb.toString());
  if (ds_lang) params.append('ds_lang', ds_lang);
  
  return `https://vidsrc.xyz/embed/tv?${params.toString()}`;
};

/**
 * Build VidSrc episode embed URL
 * @param {Object} params - Parameters
 * @param {string} [params.imdb] - IMDB ID
 * @param {number} [params.tmdb] - TMDB ID
 * @param {number} params.season - Season number
 * @param {number} params.episode - Episode number
 * @param {string} [params.sub_url] - Subtitle URL (must be CORS-enabled)
 * @param {string} [params.ds_lang] - Display language
 * @param {number} [params.autoplay] - Autoplay setting
 * @param {number} [params.autonext] - Auto-next episode setting
 * @returns {string} VidSrc embed URL
 */
export const buildEpisodeEmbed = ({ 
  imdb, 
  tmdb, 
  season, 
  episode, 
  sub_url, 
  ds_lang, 
  autoplay, 
  autonext 
}) => {
  const params = new URLSearchParams();
  
  if (imdb) params.append('imdb', imdb);
  if (tmdb) params.append('tmdb', tmdb.toString());
  params.append('season', season.toString());
  params.append('episode', episode.toString());
  if (sub_url) params.append('sub_url', sub_url);
  if (ds_lang) params.append('ds_lang', ds_lang);
  if (autoplay !== undefined) params.append('autoplay', autoplay.toString());
  if (autonext !== undefined) params.append('autonext', autonext.toString());
  
  return `https://vidsrc.xyz/embed/tv?${params.toString()}`;
};

/**
 * Fetch latest movies from VidSrc
 * @param {number} [page=1] - Page number
 * @returns {Promise<Object>} Latest movies data
 */
export const fetchLatestMovies = async (page = 1) => {
  try {
    const response = await axios.get(`https://vidsrc.xyz/movies/page-${page}.json`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    throw new Error(`Failed to fetch latest movies: ${error.message}`);
  }
};

/**
 * Fetch latest TV shows from VidSrc
 * @param {number} [page=1] - Page number
 * @returns {Promise<Object>} Latest TV shows data
 */
export const fetchLatestTvShows = async (page = 1) => {
  try {
    const response = await axios.get(`https://vidsrc.xyz/tv/page-${page}.json`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    throw new Error(`Failed to fetch latest TV shows: ${error.message}`);
  }
};

/**
 * Fetch latest episodes from VidSrc
 * @param {number} [page=1] - Page number
 * @returns {Promise<Object>} Latest episodes data
 */
export const fetchLatestEpisodes = async (page = 1) => {
  try {
    const response = await axios.get(`https://vidsrc.xyz/episodes/page-${page}.json`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest episodes:', error);
    throw new Error(`Failed to fetch latest episodes: ${error.message}`);
  }
};

/**
 * Validate VidSrc URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether URL is valid VidSrc URL
 */
export const isValidVidSrcUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const allowedHosts = ['vidsrc.xyz', 'vidsrc.in', 'vid-src.xyz', 'vid-src.in'];
    return allowedHosts.includes(urlObj.hostname);
  } catch {
    return false;
  }
};