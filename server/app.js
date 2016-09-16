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

if (config.is.dev) {
  // Webpack
  const webpack = require('webpack'); // eslint-disable-line
  const WebpackDevServer = require('webpack-dev-server'); // eslint-disable-line
  const webpackConfig = require('../webpack.dev.client'); // eslint-disable-line
  const webpackServer = new WebpackDevServer(webpack(webpackConfig), {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    headers: { 'Access-Control-Allow-Origin': '*' },
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false,
    },
  });
  webpackServer.listen(8080, config.HOST, () => {
    console.log(`Webpack server listening at ${config.HOST}:8080`);
  });
}
