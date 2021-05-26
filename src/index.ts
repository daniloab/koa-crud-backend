import "isomorphic-fetch";
import { createServer } from "http";
import app from "./app";
import { config } from "./config";
import { connectDatabase } from "./mongo";

(async () => {
  await connectDatabase();

  const server = createServer(app.callback());

  server.listen(config.PORT, () => {
    console.log(`server running at http://localhost:${config.PORT}`);
  });
})();
