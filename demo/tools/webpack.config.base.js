var packageJSON = require('../../package.json');
var name = packageJSON["name"];
var version = packageJSON["version"];

module.exports = {
  entry: {
    js:'./demo/IconApp.js'
  },
  output: {
    path: "./docs/"+name+"/"+version+"/constructor",
    filename: "IconApp.js"
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
    'react':'React',
    'react-dom':'ReactDOM'
  }
};
