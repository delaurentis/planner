const express = require("express");
const path = require("path");
const {setupApi} = require("./api");
const {redirectToHttps} = require("./util");

// Setup our database and API and express server
const setupServer = async () => {

  // Create our server
  const app = express();
  
  // Force HTTPs in production, but avoid needing a certificate for development
  if ( process.env.NODE_ENV === "production" ) {
    redirectToHttps(app);
  }

  // Setup the API endpoints (see api/index.js)
  setupApi(app);

  // Express port-switching logic, which helps this CRA apps run on Glitch.
  // To learn more about this neat trick, please read: 
  // https://dev.to/glitch/create-react-app-and-express-together-on-glitch-28gi
  let port;
  if (process.env.NODE_ENV === "production") {
    port = process.env.PORT ? +process.env.PORT : 3000;
    app.use(express.static(path.join(__dirname, "../build")));
    app.get("*", (request, response) => {
      response.sendFile(path.join(__dirname, "../build", "index.html"));
    });
  } else {
    port = 3001;
    console.log("⚠️ Not seeing your changes as you develop?");
    console.log(
      "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
    );
  }

  // Start the listener!
  const listener = app.listen(port, () => {
    console.log("❇️ Express server is running on port", listener.address().port);
  });
}

// Run it now
setupServer();


