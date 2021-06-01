import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import Router from "koa-router";
import cors from "koa-cors";

import { version } from "../package.json";
import { userGet } from "./api/user/userGet";
import { userPost } from "./api/user/userPost";
import { userGetAll } from "./api/user/userGetAll";
import { userDelete } from "./api/user/userDelete";

import { authLogin } from "./api/auth/authLogin";
const app = new Koa();

const router = new Router();

app.use(logger());
app.use(cors({ maxAge: 86400 }));
app.use(bodyParser());

//Open APIS (APIs that dont need to Authenticate)
router.get("/api/version", (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: "OK",
    version,
  };
});

// auth routes
router.post("/api/auth/login", authLogin);

// user api routes
router.post("/api/user", userPost);
router.get("/api/user", userGetAll);
router.get("/api/user/:id", userGet);
router.delete("/api/user/:id", userDelete);

app.use(router.routes());

// Default not found 404
app.use((ctx) => {
  ctx.status = 404;
});

export default app;
