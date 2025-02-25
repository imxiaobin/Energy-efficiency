const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    船舶信息管理: './src/pages/船舶信息管理.js',
    日报记录: './src/pages/日报记录.js',
    航次记录: './src/pages/航次记录.js',
    储氢罐记录: './src/pages/储氢罐记录.js',
    加氢记录: './src/pages/加氢记录.js',
    在线监测记录: './src/pages/在线监测记录.js',
    能耗统计: './src/pages/能耗统计.js',
    性能分析: './src/pages/性能分析.js',
    能效计算器: './src/pages/能效计算器.js',
    能效提升预测: './src/pages/能效提升预测.js',
    能耗记录表: './src/pages/能耗记录表.js',
    能效管理计划: './src/pages/能效管理计划.js',
    自定义报表: './src/pages/自定义报表.js',
    在职人员信息: './src/pages/在职人员信息.js',
    当值记录表: './src/pages/当值记录表.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/船舶信息管理.html',
      filename: '船舶信息管理.html',
      chunks: ['main', '船舶信息管理']
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/日报记录.html',
      filename: '日报记录.html',
      chunks: ['main', '日报记录']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  }
}; 