const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = [
  {
    name: 'unminified',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pryprtkits.js',
      library: {
        name: 'PryprtKits',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not dead'],
                  },
                }],
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
    },
  },
  {
    name: 'minified',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'pryprtkits.min.js',
      library: {
        name: 'PryprtKits',
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not dead'],
                  },
                }],
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    resolve: {
      extensions: ['.js'],
    },
  },
];
