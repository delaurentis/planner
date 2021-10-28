const setupApi = (app) => {

  // A test route to make sure the server is up.
  app.get("/api/ping", async (request, response) => {
    response.send("pong!");
  });

};

module.exports = { setupApi };