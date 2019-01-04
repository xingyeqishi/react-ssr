import Router from 'koa-router';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

var router = new Router();
const reg = /routes\/(\w+)/;

if (process.env.NODE_ENV !== 'PRODUCTION') {
    fs.watch(
        './src/routes/',
        {
            recursive: true,
        },
        function(eventType, filename) {
            console.log(`${filename} need to reload, beacuse ${eventType}`);
            if (filename && filename.endsWith('index.js')) {
                try {
                    let fullFile = require.resolve(
                        __dirname + '/routes/' + filename
                    );
                    delete require.cache[fullFile];
                    const route = require(fullFile).default;
                    defineRoute(route, fullFile);
                } catch (err) {
                    console.error(err);
                }
            }
        }
    );
}

function defineRoute(route, file) {
    router.get(route.path, async (ctx, next) => {
        const data = {
            title: route.title,
            keywords: route.keywords,
            description: route.description,
        };
        const chunkName = file.match(reg)[1];
        if (process.env.NODE_ENV !== 'PRODUCTION') {
            const assets = ctx.state.webpackStats.toJson().assetsByChunkName;
            const resource = [].concat(assets[chunkName]);
            data.scripts = [].concat(
                `/assets/${resource.filter(
                    item =>
                        item.endsWith('.js') && !item.endsWith('hot-update.js')
                )}`
            );
            data.styles = [].concat(
                `/assets/${resource.filter(item => item.endsWith('.css'))}`
            );
        } else {
            const assets = require('../dist/assets.json');
            data.scripts = [assets.vendor.js].concat(`${assets[chunkName].js}`);
            data.styles = [assets.vendor.css].concat(
                `${assets[chunkName].css}`
            );
        }

        const navData = {};
        const footerData = {};
        const comp = await route.getComp.bind(ctx)({
            ...navData,
            ...footerData,
        });
        data.appData = comp[0];

        data.children = ReactDOM.renderToString(<div>{comp[1]}</div>);
        let externalCss = route.externalCss || [];
        let externalJs = route.externalJs || [];
        const html = ReactDOM.renderToStaticMarkup(
            <Html externalCss={externalCss} externalJs={externalJs} {...data} />
        );
        ctx.body = html;
        await next();
    });
}

glob.sync('./src/routes/**/index.js').forEach(file => {
    const route = require(path.resolve(file)).default;
    defineRoute(route, file);
});

let connectInfo = {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'www',
};

if (process.env.NODE_ENV === 'PRODUCTION') {
    connectInfo = {
        host: 'localhost',
        user: 'root',
        password: 'xxxx',
        database: 'www',
    };
}

const knex = require('knex')({
    client: 'mysql',
    connection: connectInfo,
});
const tableName = 'cooperation_apply_info';

router.post('/submit_apply', async (ctx, next) => {
    const data = await parseData(ctx);
    ctx.res.setHeader('Content-Type', 'application/json');
    ctx.body = await knex(tableName)
        .insert({
            company: data.company,
            name: data.name,
            position: data.position,
            email: data.email,
            telephone: data.telephone,
            cooperation_mode: data.cooperation_mode,
            apply_time: data.apply_time,
        })
        .then(function() {
            console.log('insert success');
            return { status_code: 0, msg: 'ok' };
        })
        .catch(function(err) {
            console.log('insert faild');
            return { status_code: -1, msg: err.code };
        });
});

function parseData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let result;
            ctx.req.addListener('data', data => {
                result = data;
            });
            ctx.req.on('end', () => {
                resolve(JSON.parse(result));
            });
        } catch (err) {
            reject(err);
        }
    });
}

export default router;
