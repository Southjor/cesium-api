/**
 * Created by southejor on 2022年11月1日11:27:33.
 */
// 公共路径
const path = require('path');
// webpack对象
const webpack = require('webpack');
// 用于编译layui图片
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 指定HtmlWebpackPlugin路径
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 压缩代码
const CompressionPlugin = require("compression-webpack-plugin");
//压缩混淆加密
const TerserWebpackPlugin = require("terser-webpack-plugin");

// 三维必要设置  start ===================================================================================
// 指定cesium的路径
const cesiumSource = 'node_modules/cesium/Source';
// 指定cesium workers路径
const cesiumWorkers = '../Build/Cesium/Workers';
// 三维必要设置  end ===================================================================================

// 最外层文件夹，根据项目调整
const parentFolderName = 'southMap';
const folderName = 'staticForMap';

module.exports = {

    entry: {
        //生成模式,多个页面
        'south': "/src/south/south.js",//已多次提及的唯一入口文件
    },
    output: {
        path: __dirname + "/build/" + parentFolderName + "/",//打包后的文件存放的地方
        publicPath: "./",
        sourcePrefix: '',
        filename: folderName + "/js/[name].cesium.js",//打包后输出文件的文件名
    },
    resolve: {
        // 必要，否则是打包失败
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
            title: "三维地图示例",
            template: './src/south/index.html',
            filename: './index.html',
            chunksSortMode: 'manual',
            // 必须设置，否则读取不到暴露对象
            scriptLoading: 'blocking',
        }),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        // 这里指定存放路径
        new CopyWebpackPlugin({
            patterns: [
                {from: path.join(cesiumSource, cesiumWorkers), to: folderName + '/sphere/Workers'},
                {from: path.join(cesiumSource, 'Assets'), to: folderName + '/sphere/Assets'},
                {from: path.join(cesiumSource, 'Widgets'), to: folderName + '/sphere/Widgets'},
                // 配置文件路径
                {from: path.join('./src/south', 'config.js'), to: folderName + '/js/config.js'},
            ]
        }),

        // 配合上边的路径，指定 cesium 使用资源路径
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('/' + parentFolderName + "/" + folderName + '/sphere/')
        }),

        // 开启 GZIP 压缩
        new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            threshold: 10240,// 大于10kb的才被压缩
            // minRatio: 0.8,//压缩比例
            // test: /\.js$|\.css$|\.html$/,
            test: /\.js$|\.css$/,
            // 不压缩 cesium 资源
            exclude: /\/sphere/,
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                minify: TerserWebpackPlugin.uglifyJsMinify,
                // `terserOptions` options will be passed to `uglify-js`
                // Link to options - https://github.com/mishoo/UglifyJS#minify-options
                terserOptions: {
                    annotations: false,
                    // ie:  false,
                },
            }),
        ],
        /* 分割 js，一般用于 ES5 使用三维地图插件的情况。 */
        // splitChunks: {
        //
        //     chunks: 'initial',// 必须三选一： "initial" | "all"(默认就是all) | "async"
        //     minSize: 600000,
        //     maxSize: 1000000,
        //     minChunks: 1,// 最小 chunk ，默认1
        //     maxAsyncRequests: 10,
        //     maxInitialRequests: 3,
        //     // automaticNameDelimiter: '~',
        //     name: 'commons.cesium', // 名称，此选项课接收 function,
        //
        //     cacheGroups: {
        //         commons: {   // 抽离第三方插件
        //             test: /node_modules/,   // 指定是node_modules下的第三方包
        //             chunks: 'initial',
        //             name: 'commons',  // 打包后的文件名，任意命名
        //             enforce: true,
        //             // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        //             priority: 10,
        //             // test: '/\.css$/',  // 只提取公共css ，命名可改styles
        //             //             minChunks: 2, //表示提取公共部分最少的文件数
        //             //             minSize: 0, //表示提取公共部分最小的大小
        //         },
        //         default: {
        //             minChunks: 2,
        //             priority: -20,
        //             reuseExistingChunk: true
        //         },
        //     }
        // }
    },
};
