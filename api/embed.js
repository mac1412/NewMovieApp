const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Serverless proxy + sanitizer for VidSrc embed pages
 * 
 * IMPORTANT: This proxy is intended for educational purposes only.
 * Do not embed content you are not licensed to stream.
 * Confirm VidSrc terms and copyright laws before embedding.
 */

// Allowed VidSrc hostnames for security
const ALLOWED_HOSTS = ['vidsrc.xyz', 'vidsrc.in', 'vid-src.xyz', 'vid-src.in'];

// Ad-related patterns to remove (case-insensitive)
const AD_PATTERNS = [
  /\bad\b/i, /\bads\b/i, /\badvert/i, /\bbanner/i, /\bpopup/i,
  /\boverlay/i, /\bsponsor/i, /\bskip/i, /\bgooglead/i, /\bdoubleclick/i,
  /\bgooglesyndication/i, /\badsystem/i, /\badnxs/i, /\bprebid/i
];

// Rate limiting map (simple in-memory approach)
const rateLimitMap = new Map();

/**
 * Check if hostname is allowed
 */
function isAllowedHost(url) {
  try {
    const urlObj = new URL(url);
    return ALLOWED_HOSTS.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

/**
 * Rate limiting check
 */
function checkRateLimit(clientIP) {
  const now = Date.now();
  const clientRequests = rateLimitMap.get(clientIP) || [];
  
  // Remove requests older than 1 minute
  const recentRequests = clientRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 20) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(clientIP, recentRequests);
  return true;
}

/**
 * Check if element matches ad patterns
 */
function isAdElement(element, $) {
  const id = $(element).attr('id') || '';
  const className = $(element).attr('class') || '';
  const src = $(element).attr('src') || '';
  
  return AD_PATTERNS.some(pattern => 
    pattern.test(id) || pattern.test(className) || pattern.test(src)
  );
}

/**
 * Sanitize HTML content
 */
function sanitizeHTML(html, baseUrl) {
  const $ = cheerio.load(html);
  
  // Remove script and noscript tags
  $('script, noscript').remove();
  
  // Remove inline event handlers
  $('*').each((i, element) => {
    const attributes = element.attribs || {};
    Object.keys(attributes).forEach(attr => {
      if (attr.startsWith('on')) {
        $(element).removeAttr(attr);
      }
    });
  });
  
  // Remove ad-related elements
  $('*').each((i, element) => {
    if (isAdElement(element, $)) {
      $(element).remove();
    }
  });
  
  // Remove ad iframes specifically
  $('iframe').each((i, element) => {
    const src = $(element).attr('src') || '';
    if (AD_PATTERNS.some(pattern => pattern.test(src))) {
      $(element).remove();
    }
  });
  
  // Inject base tag for relative URLs
  if (!$('base').length && baseUrl) {
    $('head').prepend(`<base href="${baseUrl}">`);
  }
  
  // Inject CSS to hide ad elements
  const adBlockCSS = `
    <style>
      .ad, .ads, [id*="ad"], [class*="ad"], [id*="banner"], [class*="banner"],
      [id*="popup"], [class*="popup"], [id*="overlay"], [class*="overlay"] {
        display: none !important;
      }
    </style>
  `;
  $('head').append(adBlockCSS);
  
  return $.html();
}

/**
 * Main serverless function
 */
module.exports = async (req, res) => {
  const { url } = req.query;
  
  // Get client IP for rate limiting
  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'unknown';
  
  // Rate limiting check
  if (!checkRateLimit(clientIP)) {
    return res.status(429).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Rate Limited</title></head>
      <body>
        <h1>Rate limit exceeded</h1>
        <p>Please try again later.</p>
      </body>
      </html>
    `);
  }
  
  // Validate URL parameter
  if (!url) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Bad Request</title></head>
      <body>
        <h1>Missing URL parameter</h1>
        <p>Please provide a valid VidSrc URL.</p>
      </body>
      </html>
    `);
  }
  
  // Check if URL is from allowed host
  if (!isAllowedHost(url)) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Invalid URL</title></head>
      <body>
        <h1>Invalid URL</h1>
        <p>Only VidSrc URLs are allowed.</p>
      </body>
      </html>
    `);
  }
  
  try {
    // Fetch the embed page
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 15000,
      maxRedirects: 5
    });
    
    let htmlContent = response.data;
    let baseUrl = url;
    
    // Check if the page contains an iframe that we should fetch instead
    const $ = cheerio.load(htmlContent);
    const mainIframe = $('iframe').first();
    
    if (mainIframe.length) {
      const iframeSrc = mainIframe.attr('src');
      if (iframeSrc) {
        // Resolve relative URLs
        const iframeUrl = new URL(iframeSrc, url).href;
        
        // Fetch iframe content if it's from allowed host
        if (isAllowedHost(iframeUrl)) {
          try {
            const iframeResponse = await axios.get(iframeUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': url
              },
              timeout: 15000
            });
            htmlContent = iframeResponse.data;
            baseUrl = iframeUrl;
          } catch (iframeError) {
            console.warn('Failed to fetch iframe content:', iframeError.message);
            // Continue with original content
          }
        }
      }
    }
    
    // Sanitize the HTML
    const sanitizedHTML = sanitizeHTML(htmlContent, baseUrl);
    
    // Set security headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes cache
    
    // Return sanitized HTML
    res.status(200).send(sanitizedHTML);
    
  } catch (error) {
    console.error('Embed proxy error:', error.message);
    
    // Return error page
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Error Loading Video</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
          }
          .error-container {
            max-width: 500px;
          }
          h1 { color: #ff4444; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; line-height: 1.5; }
          .error-details {
            background: #222;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            font-family: monospace;
            font-size: 0.9rem;
            color: #ccc;
          }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1>Unable to load video</h1>
          <p>There was an error processing the video URL. This could be due to:</p>
          <ul style="text-align: left; display: inline-block;">
            <li>Network connectivity issues</li>
            <li>The video source is temporarily unavailable</li>
            <li>The requested content was not found</li>
          </ul>
          <div class="error-details">
            Error: ${error.message}
          </div>
          <p style="margin-top: 2rem;">
            <button onclick="window.history.back()" style="background: #ff4444; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
              Go Back
            </button>
          </p>
        </div>
      </body>
      </html>
    `);
  }
};