module.exports = {
    filenameHashing: false,
    productionSourceMap: false,
    parallel: false,
    css: {
      extract: false
    },
    configureWebpack: {
        optimization: {
            splitChunks: false
        }
    }
}