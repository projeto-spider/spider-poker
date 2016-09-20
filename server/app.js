import Koa from 'koa';
const app = new Koa();
import config from './config/';
import path from 'path';

// Error handler for production
if (config.is.prod) {
  app.on('error', err => {
    console.error('Server Error:', err);
  });
}

// General
import compress from 'koa-compress';
import bodyParser from 'koa-bodyparser';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import mount from 'koa-mount';
import serve from 'koa-static';

app.use(compress());
app.use(bodyParser());
app.use(conditional());
app.use(etag());
app.use(mount('/public', serve(path.join(__dirname, '../public'), {
  maxage: config.is.prod ? 1000 * 60 * 60 * 24 * 7 : 0,
})));

// Views
import views from 'koa-views';
app.use(views(path.join(__dirname, 'views/'), {
  extension: 'pug',
}));

if (config.is.dev) {
  // Webpack
  const webpack = require('webpack'); // eslint-disable-line
  const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'); // eslint-disable-line
  const WebpackDevServer = require('webpack-dev-server'); // eslint-disable-line
  const webpackConfig = require('../webpack.dev.client'); // eslint-disable-line
  const compiler = webpack(webpackConfig);
  app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  app.use(hotMiddleware(compiler, {
  }));
  app.use((ctx, next) => {
    if (!/^\/webpack/.test(ctx.request.url)) {
      return next();
    }
  });
}
// Routes
import routes from './routes/';
routes.map(
  route => app
    .use(route.middleware())
    .use(route.allowedMethods())
);

app.listen(config.PORT, config.HOST, () => {
  console.log(`Server listening at ${config.HOST}:${config.PORT}`);
});

