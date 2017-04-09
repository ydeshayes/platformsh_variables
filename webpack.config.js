var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.env;

var libraryName = 'platformsh_variables';
function createConfig(appRoot, platformBuildFolder) {
  return {
    entry: __dirname + '/src/index.js',
    output: {
      path: appRoot + '/' + platformBuildFolder,
      filename: 'platformvar.[chunkhash].js',
      library: libraryName,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    resolve: {
      modules: [
        path.resolve(__dirname + '/src')
      ],
      extensions: ['.js']
    },
    plugins: [
      new UglifyJsPlugin({ minimize: true }),
      new webpack.DefinePlugin({
        'APP_ROOT': JSON.stringify(appRoot),
        __DEV__: false
      })
    ]
  };
}

module.exports = createConfig;
