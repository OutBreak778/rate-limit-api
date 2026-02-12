import http from "http";
import app from "./app.js";
import ConnectToDB from "./config/connection.js";

let PORT = process.env.PORT || 5001;

const server = http.createServer(app);

const startServer = async () => {
  try {
    await ConnectToDB()
    server.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
  } catch (error) {
    console.error(`Error in server startup: ${error.message}`);
  }
};

startServer();
