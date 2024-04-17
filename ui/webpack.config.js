import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browserConfig = {
  entry: './src/ui/index.jsx',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist', 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        include: path.resolve(__dirname, 'src/ui'),
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                "targets": "defaults"
              }],
              '@babel/preset-react'
            ]
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.json$/i,
        type: 'json',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['', '.jsx', '.js', '.css', '.json'],
    // Typescript now requires the extension when using file imports. Typescript understands
    // that .js also means .ts, but webpack does not. To fix this we need to use the extensionAlias
    // To tell Webpack that .js also means .ts
    // See: https://webpack.js.org/configuration/resolve/#resolveextensionalias
    extensionAlias: {
      '.js': ['.ts', '.jsx', '.js'],
    },
    fallback: {
      path: false,
      util: false,
      crypto: false,
      fs: false,
      assert: false,
    }
  },
  plugins: [
    /*
    new HtmlWebpackPlugin({
      title: 'Hassen Admin',
      template: 'src/ui/index.ejs'
    }),
     */
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new webpack.DefinePlugin({
      __isBrowser__: "true"
    })
  ]
}

export default [
  browserConfig,
]
