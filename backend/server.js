import { createServer } from "http";
import app from "./src/app.js";
import { env } from "./src/config/env.js";

const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`API server running on port ${env.PORT}`);
});
