const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {DefinePlugin} = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin")
//指定cesium的路径
const cesiumSource = 'node_modules/cesium/Source';
//指定cesium workers路径
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    /**
     * webpack 打包为什么打包的
     * target值内容：web、node
     */
    // target: "web",
    mode: "development",
    devtool: "source-map",
    entry: "./src/south/south.js",//已多次提及的唯一入口文件
    // entry: ['babel-polyfill', __dirname + "/src/mapSharp/mapSharp_cesium.js"],//已多次提及的唯一入口文件
    output: {
        path: __dirname + "/build",//打包后的文件存放的地方
        filename: "south.js"//打包后输出文件的文件名
    },
    devServer: {
        //自动打包编译
        static: path.resolve(__dirname, 'build'),
        /**
         * 某些资源在webpak打包中加载不到的资源，就可以在contentBase中去指定加载的文件夹地址中去查找
         * 配置这个的时候 webpack-dev-server 使用  3.11.2 的版本，没有问题，使用最近的会报错，我没解决
         * CopyWebpackPlugin 没有这个的时候，使用上面的 就可以加载到，因为我没有拷贝，所以 就加载不到了（在开发过程中，使用CopyWebpackPlugin 他会浪费资源，所以就可以 使用contentBase，所以 在开发过程中 就可以注销掉下面的CopyWebpackPlugin配置，但是在生产资源时，依然要拷贝的）
         */
        // contentBase: "./",
        /**
         * 模块的热替换：
         * 模块热替换是指在 应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个页面
         * 比如：你在使用计算器的时候，你不想修改代码之后，计算器的结果也丢失的情况下 使用
         *
         */
        hot: true,
        //g压缩
        compress: true,
        //端口号
        // port: 8080,
        //第一次运行自动打开浏览器，true默认，'Chrome'谷歌
        // open:'Google Chrome'
        // "open":true
    },
    resolve: {
        fallback: {"https": false, "zlib": false, "http": false, "url": false},
        mainFiles: ['index', 'Cesium']
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
            use: ['url-loader']
        }]
    },
    plugins: [

        new HtmlWebpackPlugin({
            title: "三维地图",
            template: './src/south/index.html',
            // 现代浏览器加载js的方式,使用defer来提高页面启动性能。
            // 必须设置，否则读取不到暴露对象
            scriptLoading: 'blocking',
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new CopyWebpackPlugin({
            patterns: [
                {from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'},
                {from: path.join(cesiumSource, 'Assets'), to: 'Assets'},
                {from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'},
                // 配置文件路径
                {from: path.join('./src/south', 'config.js'), to: './staticForMap/js/config.js'}
            ]
        }),
        new DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        })
    ],
}
