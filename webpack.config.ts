import path from 'path';
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import ThreeMinifierPlugin from "@yushijinhun/three-minifier-webpack";
const threeMinifier = new ThreeMinifierPlugin();

const MODE: 'development' | 'production' = 'production';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
  mode: MODE,
  context: path.join(__dirname, 'src'),
  entry: './scripts/index.tsx',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: ''
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: 'es2020'
            }
          }
        ]
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2020'
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'js',
              target: 'es2020'
            }
          }
        ]
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'jsx',
              target: 'es2020'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp|dat|patt)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ]
      }
    ]
  },

  optimization: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    minimize: MODE === 'development' ? false : true,
    minimizer: [
      new ESBuildMinifyPlugin()
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './pages/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    threeMinifier
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [
      threeMinifier.resolver
    ],
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  },

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  devtool: MODE === 'development' ? 'inline-source-map' : 'hidden-source-map',
  devServer: {
    static: [
      { directory: path.join(__dirname, 'src') }
    ],
    open: true,
    port: 1010
  }
};

export default config;
