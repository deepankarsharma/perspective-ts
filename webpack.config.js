
const { resolve } = require('path');
let webpack = require('webpack');

module.exports = {
  entry: {
    parallel: './src/index.ts',
    worker: './src/worker.ts'
  },
  output: {
    filename: 'perspective-[name].js',
    path: resolve(__dirname, 'build'),
    library: '[name]',
    libraryTarget: 'umd',
    publicPath: './'
  },
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.ts', '.js'],
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /psp\.(asmjs|async|sync).js$/,
        loader: "wrap-loader",
        options: {
          before: ";var window = window || {};exports.load_perspective = function(Module) {",
          //after: ";return Module;}"
          after: ";Module.preRun.push(function() { ENV.PSP_LOG_PROGRESS = '1'; }); return Module;}"
        }
      }
    ],
  },
  devtool: 'inline-source-map'
};