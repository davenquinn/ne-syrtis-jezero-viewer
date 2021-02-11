const path = require("path");
const { DefinePlugin, EnvironmentPlugin } = require("webpack");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
//UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const historyApiFallback = require("connect-history-api-fallback");
const CopyPlugin = require("copy-webpack-plugin");
const DotenvPlugin = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const pkg = require("./package.json");

let mode = process.env.NODE_ENV || "development";

const outputDir = process.env.BUNDLE_DIR || path.join(__dirname, "dist");

const gitRevisionPlugin = new GitRevisionPlugin({
  lightweightTags: true,
  commithashCommand: "rev-parse --short HEAD",
});
const GITHUB_LINK = "https://github.com/davenquinn/ne-syrtis-jezero-viewer";

let browserSync = new BrowserSyncPlugin({
  server: { baseDir: "./dist" },
  middleware: [historyApiFallback()],
});

const cesiumSource = "node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";
const cesiumBase = (process.env.PUBLIC_URL || "") + "/";

//uglify = new UglifyJsPlugin()

let babelLoader = {
  loader: "babel-loader",
  options: {
    sourceMap: mode == "development",
  },
};

const cssModuleLoader = {
  loader: "css-loader",
  options: {
    modules: {
      mode: "local",
      localIdentName: "[path][name]__[local]--[hash:base64:5]",
    },
  },
};

let exclude = /node_modules/;

module.exports = {
  mode: mode,
  module: {
    unknownContextCritical: false,
    rules: [
      { test: /\.(js|jsx|ts|tsx)$/, use: [babelLoader], exclude },
      {
        test: /\.styl$/,
        use: ["style-loader", cssModuleLoader, "stylus-loader"],
        exclude,
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      { test: /\.css$/, use: ["style-loader", cssModuleLoader], exclude },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              useRelativePath: true,
              outputPath: "sections/assets/",
              name: "[name].[ext]",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      // CesiumJS module name
      cesiumSource: path.resolve(__dirname, cesiumSource),
      "cesium-viewer": path.resolve(
        __dirname,
        "bundledDeps",
        "cesium-viewer",
        "src"
      ),
      "~": path.resolve(__dirname, "src"),
    },
  },
  entry: {
    index: "./src/index.ts",
  },
  node: {
    fs: "empty",
  },
  output: {
    path: outputDir,
    filename: "[name].js",
    sourcePrefix: "",
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true,
  },
  plugins: [
    browserSync,
    new CopyPlugin([
      { from: path.join(cesiumSource, cesiumWorkers), to: "Workers" },
      { from: path.join(cesiumSource, "Assets"), to: "Assets" },
      { from: path.join(cesiumSource, "Widgets"), to: "Widgets" },
    ]),
    new HtmlWebpackPlugin({ title: "Syrtis – Jezero explorer" }),
    new DefinePlugin({
      GITHUB_LINK: JSON.stringify(GITHUB_LINK),
      CESIUM_BASE_URL: JSON.stringify(cesiumBase),
      NPM_VERSION: JSON.stringify(pkg.version),
      GIT_VERSION: JSON.stringify(gitRevisionPlugin.version()),
      GIT_COMMIT_HASH: JSON.stringify(gitRevisionPlugin.commithash()),
      COMPILE_DATE: JSON.stringify(
        new Date().toLocaleString("en-US", { month: "long", year: "numeric" })
      ),
      GITHUB_REV_LINK: JSON.stringify(
        GITHUB_LINK + "/tree/" + gitRevisionPlugin.commithash()
      ),
    }),
    new EnvironmentPlugin({
      API_BASE_URL: "http://localhost:8080",
      PUBLIC_URL: "/",
    }),
  ],
};
