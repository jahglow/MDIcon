var packageJSON = require('../package.json');
var name = packageJSON["name"];

module.exports = {
  entry: {
    "MDIcon.bundle":"./src/main.js"
  },
  output: {
    path: "./dist",
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  externals:{
    'react':'react',
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
};
