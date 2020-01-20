const fs = require('fs');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const nextServerless = require('next-serverless/handler');

// Load next.config.js if one exists
const nextConfig = fs.existsSync('../next.config') ? require('../next.config') : { dir: 'src' };
nextConfig.dev = process.env.NODE_ENV !== 'production'

const app = next(nextConfig);
const nextRequestHandler = app.getRequestHandler();

const requestHandler = (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;
  // Custom routing, cache headers, etc goes here…
  nextRequestHandler(req, res, parsedUrl);
}

// next-serverless takes care of exporting a handler for AWS Lambda
// (or providing a callback to start a server when running locally)
module.exports.handler = nextServerless(app, requestHandler, () => {
  // If not in AWS Lambda (e.g. locally) then it will start an HTTP server
  const port = parseInt(process.env.PORT, 10) || 3000
  createServer(requestHandler).listen(port, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});