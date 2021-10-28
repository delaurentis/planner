// This will redirect any HTTP to HTTPS
const redirectToHttps = (app) => {

  // This method will be used below to force HTTPS on any requests
  function checkHttpsAndRedirectIfNeeded(request, response, next) {
    // Check the protocol — if http, redirect to https.
    if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
      return next();
    } else {
      response.redirect("https://" + request.hostname + request.url);
    }
  }

  // Force HTTPS
  app.all("*", checkHttpsAndRedirectIfNeeded);
}

module.exports = { redirectToHttps };