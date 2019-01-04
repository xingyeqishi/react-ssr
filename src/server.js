require('@babel/register');
// require('@babel/polyfill');

import Koa from 'koa';
import path from 'path';
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import koaStatic from 'koa-static';
import config from '../conf/webpack.config.js';
const app = new Koa();

import router from './router';
app.use(
    process.env.NODE_ENV !== 'PRODUCTION'
        ? koaWebpack({
              config: config,
              dev: {
                  serverSideRender: true,
                  publicPath: '/assets',
                  //writeToDisk: true,
                  progress: true,
              },
              hot: {
                  host: 'localhost',
                  hot: true,
              },
          })
        : koaStatic(path.resolve(__dirname, '../dist/'), {
              maxage: 30 * 24 * 60 * 60 * 1000,
              gzip: true,
          })
)
    .use(async (ctx, next) => {
        if (ctx.cookies.get('lang') !== undefined) {
            ctx.lang = ctx.cookies.get('lang');
        } else {
            let userLang = ctx.acceptsLanguages(['en', 'zh-CN']);
            if (userLang === 'zh-CN') {
                ctx.lang = 'CN';
            } else {
                ctx.lang = 'EN';
            }
        }
        await next();
    })
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(8004);

console.log('Listening on port 8004');
