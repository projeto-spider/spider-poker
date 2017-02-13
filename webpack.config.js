const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const environment = process.env.NODE_ENV

module.exports = {
  entry: './web/static/js/app.js',

  output: {
    path: './priv/static',
    filename: 'js/app.js'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              loader: 'css-loader',
              fallbackLoader: 'vue-style-loader'
            }),

            sass: ExtractTextPlugin.extract({
              loader: ['css-loader', 'sass-loader?indentedSyntax'],
              fallbackLoader: 'vue-style-loader'
            })
          }
        }
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },

      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract(['style-loader', 'css-loader'])
      },

      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        query: {
          outputPath: 'fonts/',
          publicPath: '../fonts/'
        }
      },

      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${environment}"`
      }
    }),

    new ExtractTextPlugin('css/app.css')
  ],

  resolve: {
    extensions: ['.js', '.json', '.vue'],

    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },

  stats: environment === 'production' ? 'verbose' : 'errors-only',

  devServer: {
    historyApiFallback: true,
    noInfo: true
  },

  performance: {
    hints: false
  },

  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
