module.exports = {
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      compress: true,
      inline: true,
      public: 'waifu.camp'
    },
    target: "web",
    resolve: {
      alias: {
        // crypto: false
      }
    }
  }
};
