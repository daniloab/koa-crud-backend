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

import { auth } from "./auth/auth";
const app = new Koa();

const router = new Router();

const routerAuth = new Router();
const routerOpen = new Router();

app.use(logger());
app.use(cors({ maxAge: 86400 }));
app.use(bodyParser());

//Open APIS (APIs that dont need to Authenticate)
routerOpen.get("/api/version", (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: "OK",
    version,
  };
});

// auth routes
routerOpen.post("/api/auth/login", authLogin);

app.use(routerOpen.routes());

//Authorized APIs
//After, APIS need to be Authenticated
routerAuth.use(auth);

// user api routes
routerAuth.post("/api/user", userPost);
routerAuth.get("/api/user", userGetAll);
routerAuth.get("/api/user/:id", userGet);
routerAuth.delete("/api/user/:id", userDelete);

app.use(routerAuth.routes());

// Default not found 404
app.use((ctx) => {
  ctx.status = 404;
});

export default app;
