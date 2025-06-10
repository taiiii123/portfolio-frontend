module.exports = {
  devServer: {
    open: true
  },
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/styles/_variables.scss";
          @import "@/styles/_mixins.scss";
          @import "@/styles/_animations.scss";
          @import "@/styles/_fonts.scss";
        `
      }
    }
  }
}
