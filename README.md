# tMovies - VidSrc Integration

A React + Tailwind movie landing page with VidSrc embed integration and serverless proxy for ad-free video streaming.

## 🚀 Features

- **Movie Landing Page**: Responsive React component matching the provided design
- **VidSrc Integration**: Helper utilities for building VidSrc embed URLs from TMDB IDs
- **TMDB Integration**: Fetch movie/TV metadata and poster images
- **Serverless Proxy**: Ad-blocking proxy for clean VidSrc embeds
- **Security**: Rate limiting, hostname whitelisting, and content sanitization

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tmovies-vidsrc

# Install dependencies
npm install

# Start development server
npm start
```

## 🛠️ Dependencies

```json
{
  "axios": "^1.3.0",
  "cheerio": "^1.0.0-rc.12",
  "react": "^18.2.0",
  "react-dom": "^18.2.0"
}
```

## 🎬 Usage Examples

### Basic Movie Landing Page

```jsx
import MovieLandingPage from './components/MovieLandingPage';

function App() {
  return (
    <MovieLandingPage 
      tmdbApiKey="your-tmdb-api-key"
      tmdbId={385687}
      proxyUrl="https://your-vercel-app.vercel.app"
    />
  );
}
```

### Building VidSrc URLs

```javascript
import { buildMovieEmbedWithTMDB } from './utils/vidsrc-tmdb-utils';

// Build movie embed URL
const vidsrcUrl = buildMovieEmbedWithTMDB({ 
  tmdb: 385687, 
  autoplay: 1 
});

// Use with proxy
const proxiedUrl = `https://your-app.vercel.app/api/embed?url=${encodeURIComponent(vidsrcUrl)}`;
```

### TMDB Integration

```javascript
import { fetchTMDBMovieDetails, tmdbPosterUrl } from './utils/vidsrc-tmdb-utils';

// Fetch movie details
const movieData = await fetchTMDBMovieDetails(385687, 'your-api-key');

// Get poster URL
const posterUrl = tmdbPosterUrl(movieData.poster_path, 'w500');
```

### TV Shows and Episodes

```javascript
import { buildTvEmbedWithTMDB, buildEpisodeEmbedWithTMDB } from './utils/vidsrc-tmdb-utils';

// TV Show
const tvUrl = buildTvEmbedWithTMDB({ tmdb: 1399 });

// Specific Episode
const episodeUrl = buildEpisodeEmbedWithTMDB({
  tmdb: 1399,
  season: 1,
  episode: 1,
  autoplay: 1
});
```

## 🚀 Vercel Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to configure your deployment
```

### 2. Environment Variables

Set up environment variables in your Vercel dashboard:

```
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3. Vercel Configuration

Create `vercel.json`:

```json
{
  "functions": {
    "api/embed.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        }
      ]
    }
  ]
}
```

## 🔧 Local Development

```bash
# Start React development server
npm start

# Test serverless functions locally (requires Vercel CLI)
vercel dev
```

## 🔒 Security Features

### Proxy Security
- **Hostname Whitelist**: Only allows VidSrc domains
- **Rate Limiting**: 20 requests per minute per IP
- **Content Sanitization**: Removes ads and malicious scripts
- **Secure Headers**: Implements security best practices

### Content Security
- **Ad Removal**: Strips advertisement elements and scripts
- **Script Sanitization**: Removes inline event handlers
- **Iframe Sandboxing**: Secure iframe attributes

## 📚 API Reference

### VidSrc Utils

#### `buildMovieEmbedWithTMDB(params)`
- `tmdb` (number): TMDB movie ID
- `sub_url` (string, optional): Subtitle URL (must be CORS-enabled)
- `ds_lang` (string, optional): Display language
- `autoplay` (number, optional): Autoplay setting (default: 1)

#### `buildTvEmbedWithTMDB(params)`
- `tmdb` (number): TMDB TV show ID
- `ds_lang` (string, optional): Display language

#### `buildEpisodeEmbedWithTMDB(params)`
- `tmdb` (number): TMDB TV show ID
- `season` (number): Season number
- `episode` (number): Episode number
- `sub_url` (string, optional): Subtitle URL
- `ds_lang` (string, optional): Display language
- `autoplay` (number, optional): Autoplay setting
- `autonext` (number, optional): Auto-next episode setting

### TMDB Utils

#### `fetchTMDBMovieDetails(tmdbId, apiKey)`
Fetches movie details from TMDB API.

#### `fetchTMDBTvDetails(tmdbId, apiKey)`
Fetches TV show details from TMDB API.

#### `tmdbPosterUrl(path, size)`
Generates TMDB poster URL with specified size.

### Proxy API

#### `GET /api/embed?url=<encoded_vidsrc_url>`
Proxies and sanitizes VidSrc embed pages.

**Parameters:**
- `url` (required): URL-encoded VidSrc embed URL

**Response:** Sanitized HTML page ready for iframe embedding

## ⚠️ Legal Notice

**IMPORTANT**: This proxy is intended for educational purposes only.

- Do not embed content you are not licensed to stream
- Confirm VidSrc terms and copyright laws before embedding
- Users are responsible for ensuring compliance with all applicable laws
- Respect content creators and copyright holders

## 🔧 Technical Notes

### Browser Compatibility
- **Autoplay**: Modern browsers require muted autoplay or user interaction
- **Mixed Content**: Site must be HTTPS to load HTTPS embeds
- **CORS**: Subtitle URLs must be CORS-enabled

### Performance
- **Caching**: Proxy responses are cached for 5 minutes
- **CDN**: Consider adding CDN caching for better performance
- **Rate Limiting**: Implement additional rate limiting for production use

## 🐛 Troubleshooting

### Common Issues

1. **Video not loading**: Check if VidSrc URL is valid and accessible
2. **CORS errors**: Ensure your site is served over HTTPS
3. **Rate limiting**: Wait before making additional requests
4. **Autoplay blocked**: Most browsers block autoplay without user interaction

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=true vercel dev
```

## 📄 License

This project is for educational purposes only. Please respect copyright laws and terms of service of all integrated services.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review VidSrc and TMDB documentation
3. Open an issue on GitHub

---

**Remember**: Always ensure you have the right to stream content and comply with all applicable laws and terms of service.