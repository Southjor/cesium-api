import * as Cesium from "cesium";

import "cesium/Build/Cesium/Widgets/widgets.css";

/**
 * @todo 初始化地图
 * @author Southejor Zhao <zf2008e57@buaa.edu.cn>
 * @blog https://blog.csdn.net/linzi19900517
 * @date 2022/11/27 12:55
 * @description
 */
class GLMap {

    constructor(target, options) {

        if (!target || !document.getElementById(target)) {
            throw '地图容器不存在！';
        }

        const opt = {
            fullscreenButton: false,
            terrain: false,
            infoBox: false
        };

        options = Object.assign({}, opt, options);

        // 请更换自己的 tk
        // 注意：此 tk 只能在 openlayers.vip 域名下使用
        const token = '2b7cbf61123cbe4e9ec6267a87e7442f';
        const tdtUrl = 'https://t{s}.tianditu.gov.cn/';

        const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

        const viewer = new Cesium.Viewer(target, {
            imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
                //影像底图
                url: "http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
                    "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
                    "&style=default&format=tiles&tk=" + token,
                subdomains: subdomains,
                layer: "tdtImgLayer",
                style: "default",
                format: "image/jpeg",
                tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
                show: true
            }),
            scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            animation: false, //是否显示动画控件
            baseLayerPicker: false, //是否显示图层选择控件
            geocoder: false, //是否显示地名查找控件
            timeline: false, //是否显示时间线控件
            homeButton: false, // 初始按钮
            sceneModePicker: false, //是否显示投影方式控件
            selectionIndicator: false, // 是否显示绿色聚焦框
            navigationHelpButton: false, //是否显示帮助信息控件
            infoBox: options.infoBox, //是否显示点击要素之后显示的信息
            fullscreenButton: options.fullscreenButton, // 全屏按钮
            shouldAnimate: true // 启用动画效果(飞机飞行)
        });

        this.viewer = viewer;
        this.Cesium = Cesium;

        viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
            //影像注记
            url: "http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&" +
                "tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + token,
            subdomains: subdomains,
            layer: "tdtCiaLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: true
        }));

        // 叠加国界服务
        const iboMap = new Cesium.UrlTemplateImageryProvider({
            url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
            subdomains: subdomains,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            maximumLevel: 10
        });

        viewer.imageryLayers.addImageryProvider(iboMap);

        viewer._cesiumWidget._creditContainer.style.display = "none";
        // viewer.scene.fxaa = false;

        options.inspector && viewer.extend(Cesium.viewerCesiumInspectorMixin);

    }


    /**
     * @todo 飞行定位到一个矩形
     * @param {Rectangle} RectangleCD - 矩形对象
     * @param {Function} func - 回调函数
     */
    flyToRectangle(rectangle, func) {

        // 添加定位信息
        rectangle = rectangle || [
            Cesium.Cartesian3.fromDegrees(
                67.83746196341815,
                17.00352500800621,
                0
            ),
            Cesium.Cartesian3.fromDegrees(
                137.2400439980721,
                53.97424956088774,
                0
            ),
        ];

        const rec = Cesium.Rectangle.fromCartesianArray(rectangle);
        const boundingSphere = Cesium.BoundingSphere.fromRectangle3D(rec);
        viewer.camera.flyToBoundingSphere(boundingSphere, {
            duration: 3,
            complete: function (e) {
                func && func(e);
            },
            offset: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-90),
                range: 0.0,
            },
        });
    }


    destroy() {
        this.viewer;
    }
}

export default GLMap;
