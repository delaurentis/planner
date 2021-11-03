const { createProxyMiddleware } = require("http-proxy-middleware");

// This proxy redirects requests to /api endpoints to
// the Express server running on port 3001 when we're
// in `NODE_ENV=development` mode.
module.exports = function(app) {
  app.use(
    '/login/oauth/access_token', 
    createProxyMiddleware({ 
      target: 'https://github.com', 
      changeOrigin: true 
    })
  );
  app.use(
    '/graphql', 
    createProxyMiddleware({ 
      target: 'https://api.github.com', 
      changeOrigin: true 
    })
  );
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001"
    })
  );
};


