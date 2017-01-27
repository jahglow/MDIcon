var packageJSON = require('../package.json');
var name = packageJSON["name"];

module.exports = {
  entry: {
    "MDIcon.bundle":"./src/main.js",
    "constructor.bundle": "./src/constructor/IconApp.js"
  },
  output: {
    path: "./dist",
    filename: "[name].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(bower_components)/,
      loader: 'babel',
    }],
  },
  resolve: {
    extensions: [
      '',
      '.js',
    ],
  },
  externals:{
    'react':'React'
  }
};
