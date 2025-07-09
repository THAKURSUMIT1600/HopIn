const http = require("http");
const app = require("./app");
const port = process.env.PORT || 4001;
const server = http.createServer(app);
const { initializeSocket } = require("./socket");

initializeSocket(server);

server.listen(port, () => {
  console.log(`Server is Running at Port ${port}`);
});
