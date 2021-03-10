import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import Router from 'koa-router';
import cors from 'koa-cors';

const app = new Koa();

const router = new Router();

import { version } from '../package.json';

app.use(logger());
app.use(cors({ maxAge: 86400 }));
app.use(bodyParser());

//Open APIS (APIs that dont need to Authenticate)
router.get('/api/version', (ctx) => {
    ctx.status = 200;
    ctx.body = {
        status: 'OK',
        version,
    };
});

app.use(router.routes());

// Default not found 404
app.use((ctx) => {
    ctx.status = 404;
});

export default app;