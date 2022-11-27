import GLMap from "./base/glMap";

const South = {

    /**
     * 初始化地图
     * @param target
     * @param url
     * @param id
     * @param layerName
     * @returns {TileMap}
     */
    GLMap: function (target, optional) {
        return new GLMap(target, optional);
    },

    /**
     * 地图控制器
     */
    control: {
        /**
         * 缩放尺
         * @returns {ZoomSlider}
         */
        'zoomSlider': function () {
            return null;
        }
    },
    source: {}
};

window.South = South;

export default South;

