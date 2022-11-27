## 介绍
###基于 ECMAScript 6.0 封装 Cesium 基础架构。

```bash

# 使用 cnpm 安装依赖，或者如下：
npm install --registry=https://registry.npm.taobao.org


# 使用地图

# html 定义div,需要设置id
<div class="fullSize" id="cesiumContainer"></div>


# 初始化地图
const map3d = new South.GLMap('cesiumContainer');
