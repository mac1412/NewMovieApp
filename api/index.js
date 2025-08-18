module.exports = async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Video Embed Proxy</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          background-color: #0f0f0f;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .content-wrapper {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(255, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          margin: 20px;
          border: 1px solid #333;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #ff0000;
          font-weight: 700;
        }

        .script-info p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: #ccc;
        }

        .script-info code {
          background-color: #333;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
          color: #ff0000;
        }

        .script-info a {
          color: #ff0000;
          text-decoration: none;
          font-weight: 600;
        }

        .script-info a:hover {
          text-decoration: underline;
        }

        .logo {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #fff;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="content-wrapper">
        <div class="logo">tMovies</div>
        <h1 class="section-title">Video Embed Proxy</h1>
        <div class="script-info">
          <p>This proxy removes advertisements from video embed players for a clean viewing experience.</p>
          <p>To use it, append the target embed URL to the <strong>/embed?url=</strong> endpoint.</p>
          <p>Example: <code>/embed?url=https://vidsrc.xyz/embed/movie/123456</code></p>
          <p>This service only works with <strong>vidsrc.xyz</strong> embed URLs for security reasons.</p>
        </div>
      </div>
    </body>
    </html>
  `);
};