const path = require('path');

module.exports = {
  entry: './src/main.tsx',
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
  static: {
    directory: path.join(__dirname, 'dist'),
  },
  compress: true,
  port: 5173,
  proxy: [
    {
      context: ['/explain'],
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  ],
},
};

