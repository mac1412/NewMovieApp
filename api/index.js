/**
 * Health check and landing page for the VidSrc proxy API
 */

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>VidSrc Embed Proxy</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content-wrapper {
          background: #1a1a1a;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(255, 0, 0, 0.1);
          max-width: 700px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          margin: 20px;
          border: 1px solid #333;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          gap: 0.5rem;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: #ff0000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .logo-text {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
        }

        .section-title {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          color: #ff0000;
          font-weight: 700;
        }

        .description {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #ccc;
          margin-bottom: 2rem;
        }

        .api-info {
          background: #222;
          padding: 2rem;
          border-radius: 12px;
          margin: 2rem 0;
          text-align: left;
        }

        .api-info h3 {
          color: #ff0000;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .api-info p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: #ccc;
        }

        .api-info code {
          background-color: #333;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          color: #ff0000;
          font-size: 0.9rem;
        }

        .api-info pre {
          background: #111;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
          border-left: 4px solid #ff0000;
        }

        .api-info pre code {
          background: none;
          padding: 0;
          color: #fff;
        }

        .warning {
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid #ffc107;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 2rem 0;
          color: #ffc107;
        }

        .warning strong {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .status {
          display: inline-flex;
          align-items: center;
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          margin-top: 1rem;
        }

        .status::before {
          content: "●";
          margin-right: 0.5rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .content-wrapper {
            padding: 2rem;
            margin: 10px;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .api-info {
            padding: 1.5rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="content-wrapper">
        <div class="logo">
          <div class="logo-icon">t</div>
          <div class="logo-text">Movies</div>
        </div>
        
        <h1 class="section-title">VidSrc Embed Proxy</h1>
        
        <p class="description">
          A secure proxy service that sanitizes VidSrc embed pages by removing advertisements 
          and providing a clean viewing experience while maintaining security standards.
        </p>

        <div class="api-info">
          <h3>🚀 API Usage</h3>
          <p>To use the proxy, make a GET request to the embed endpoint:</p>
          <pre><code>GET /api/embed?url=&lt;encoded_vidsrc_url&gt;</code></pre>
          
          <h3>📝 Example</h3>
          <pre><code>const vidsrcUrl = 'https://vidsrc.xyz/embed/movie?tmdb=385687';
const proxyUrl = '/api/embed?url=' + encodeURIComponent(vidsrcUrl);

// Use in iframe
&lt;iframe src="{proxyUrl}" allowfullscreen&gt;&lt;/iframe&gt;</code></pre>

          <h3>🔒 Security Features</h3>
          <p>• Hostname whitelist (vidsrc.xyz, vidsrc.in, vid-src.xyz, vid-src.in)</p>
          <p>• Ad removal and content sanitization</p>
          <p>• Rate limiting (20 requests per minute per IP)</p>
          <p>• Secure headers and iframe sandboxing</p>

          <h3>📊 Supported Parameters</h3>
          <p><code>url</code> - The VidSrc embed URL to proxy (required, must be URL-encoded)</p>
        </div>

        <div class="warning">
          <strong>⚠️ Legal Notice</strong>
          This proxy is intended for educational purposes only. Do not embed content you are not 
          licensed to stream. Confirm VidSrc terms and copyright laws before embedding. Users are 
          responsible for ensuring compliance with all applicable laws and terms of service.
        </div>

        <div class="status">
          Service Online
        </div>
      </div>
    </body>
    </html>
  `);
};