const path = require('path');

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    chainWebpack: config => {
        // 为src下的文件取别名
        config.resolve.alias
            .set('@', resolve('src'))
            .set('components', resolve('src/components'))
            .set('util', resolve('src/utils'))

        /** 设置处理svg的router，使svg可直接用名称调用，无需路径 */
        // svg rule loader
        const svgRule = config.module.rule('svg') // 找到svg-loader
        svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
    devServer: {
        disableHostCheck: true,
        // 不设置代理时，直接看页面  接入后台加代理 不能直接访问页面
        // // 设置代理
        // proxy: {
        //     '/': {
        //         // 目标IP 后台
        //         // target: 'http://192.168.30.74:9998/',
        //         target: 'http://192.168.61.47:8080/',
        //         ws: false,
        //         changeOrigin: true
        //     }
        // }
    },
    productionSourceMap: false,

}