var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var rimraf = require('rimraf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var mode = process.env.mode || 'development';

function addHash(template, hash){
  return mode != 'development' ?
    template.replace(/\.[^.]+$/, `.[${hash}]$&`) : template;
}

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: {
    main: './main'
  },

   resolve:{
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js'],
  },

  output: {
    path: mode == 'development' ? path.join(__dirname, 'dist') : path.join(__dirname, 'public'),
    //publicPath: '/dist/',
  	filename: addHash('[name].js', 'chunkhash:6'),
    library: '[name]',
    chunkFilename: addHash('[id].[name].js', 'chunkhash:6')
  },

  module:{
    loaders: [
      {test: /\.coffee$/, loader: 'coffee'},
      {test: /\.jade$/, loader: 'jade'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 versions')},
      {test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 versions!stylus?resolve url')},
      {test: /\.(png|jpg|svg|ttf)$/, loader: addHash('url?name=[path][name].[ext]&limit=4096', 'hash:6')}
    ]
  },

  watch: mode == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: mode == 'development' ? 'eval' : null,

  noParse: wrapRegexp(/\/node_modules\/(jquery)/),

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin(addHash('[name].css', 'contenthash:6'), {allChunks: true}),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'default.jade',
      chunks: '[index]'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main',
      chunks: []
    }),
    new webpack.DefinePlugin({
      mode: JSON.stringify(mode)
    }),
    new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
    }),
    new CopyWebpackPlugin([
      { from: 'img', to: 'img' },
      { from: 'styles', to: 'styles' },
    ])
    /*{
      apply: function(compiler){
        rimraf.sync(compiler.options.output.path);
      }
    }*/
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    outputPath: './dist',
    contentBase: `${__dirname}/dist`
  }
};

function wrapRegexp(regexp, label){
  regexp.test = function(path) {
    console.log(label, path);
    return RegExp.prototype.test.call(this, path);
  };
  return regexp;
}

if (mode != 'development'){
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  );
}
