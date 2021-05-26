import mongoose from "mongoose";

import { config } from "./config";

console.log("config.MONGO_URI", config.MONGO_URI);

export const connectDatabase = () =>
  new Promise((resolve, reject) => {
    mongoose.connection
      // Reject if an error ocurred when trying to connect to MongoDB
      .on("error", (error) => {
        // eslint-disable-next-line
        console.log("ERROR: Connection to MongoDB failed");
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
      .on("close", () => {
        // eslint-disable-next-line
        console.log("ERROR: Connection to MongoDB lost");
        process.exit(1);
      })
      // Connected to DB
      .once("open", () => {
        // Display connection information
        const infos = mongoose.connections;
        // eslint-disable-next-line
        infos.map((info) =>
          console.log(`Connected to ${info.host}:${info.port}/${info.name}`)
        );
        // Return sucessfull promisse
        resolve();
      });

    console.log("config.MONGO_URI", config.MONGO_URI);

    mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });
