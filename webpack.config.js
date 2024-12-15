const path = require('path');

module.exports = {
  plugins: [
    // Add this plugin for Fast Refresh (hot reloading)
    new ReactRefreshWebpackPlugin()
  ],
  // Other webpack config...
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "util": require.resolve("util/"),
      "zlib": require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/")
    }
  },
  // Other configurations like entry, output, etc.
};
