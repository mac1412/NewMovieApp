const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("https://vidsrc.xyz/embed/")) {
    return res.status(400).send("Invalid or missing URL");
  }

  // Basic rate limiting (simple in-memory approach)
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const rateLimit = global.rateLimitMap || (global.rateLimitMap = new Map());
  const clientRequests = rateLimit.get(clientIP) || [];
  
  // Remove requests older than 1 minute
  const recentRequests = clientRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return res.status(429).send("Rate limit exceeded. Please try again later.");
  }
  
  recentRequests.push(now);
  rateLimit.set(clientIP, recentRequests);
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    const $ = cheerio.load(response.data);

    // Remove all script tags to eliminate ads
    $('script').remove();
    
    // Remove ad-related elements
    $('.ad, .ads, [class*="ad-"], [id*="ad-"], [class*="advertisement"]').remove();
    
    // Find the main video iframe
    const iframe = $("iframe").first();
    const pageTitle = $("title").text().trim() || "Video Player";

    if (!iframe.length) {
      return res.status(404).send("Video player not found.");
    }

    // Set secure iframe attributes
    iframe.attr("sandbox", "allow-scripts allow-same-origin allow-presentation");
    iframe.attr("allowfullscreen", "true");
    iframe.attr("frameborder", "0");
    iframe.attr("referrerpolicy", "no-referrer");

    res.setHeader("Content-Type", "text/html");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'self'; default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Content-Type-Options", "nosniff");
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            background: #000;
            overflow: hidden;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
          }
          /* Hide any potential ad containers */
          .ad, .ads, [class*="ad-"], [id*="ad-"], [class*="advertisement"] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${$.html(iframe)}
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Embed proxy error:", error.message);
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
            font-family: Arial, sans-serif;
            background: #000;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div>
          <h2>Unable to load video</h2>
          <p>There was an error processing the video URL.</p>
        </div>
      </body>
      </html>
    `);
  }
};