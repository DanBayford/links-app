const path = require("path");

const inputDir = path.resolve(__dirname, "./frontend/src");
const outputDir = path.resolve(__dirname, "./core/static/js");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: [inputDir + "/index.js"],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  output: {
    // needs to be absolute
    path: outputDir,
    filename: "app.js",
  },
};
