var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'app'),
  entry: {
    main: './main'
  },

   resolve:{
    extensions: ['', '.web.coffee', '.web.js', '.coffee', '.js'],
  },

  output: {
    path: path.join(__dirname, 'dist'),
  	filename: '[name].js',
    library: '[name]',
    chunkFilename: '[id].[name].js',
  },

  module:{
    loaders: [
      {test: /\.coffee$/, loader: 'coffee'},
      {test: /\.jade$/, loader: 'jade'},
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 versions')},
      {test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 versions!stylus?resolve url')},
      {test: /\.(png|jpg|svg|ttf)$/, loader:'url?name=[path][name].[ext]&limit=4096',}
    ]
  },

  watch: true,

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: 'eval',

  noParse: wrapRegexp(/\/node_modules\/(jquery)/),

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css', {allChunks: true}),
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
