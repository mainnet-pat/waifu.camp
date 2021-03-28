module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      compress: true,
      inline: true,
      public: 'localhost',
      host: 'localhost'
    },
    target: "web",
    resolve: {
      alias: {
        // crypto: false
      }
    }
  }
};
