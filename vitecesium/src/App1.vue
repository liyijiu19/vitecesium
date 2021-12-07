

<template>
  <div id="cesiumContainer">
    <Header @chooseNav="chooseNav"></Header>
    <LayerControl
      @parentChooseLayer="parentChooseLayer"
      :showlayerscontrol="showlayerscontrol"
      @closeLayerControl="closeLayerControl"
    ></LayerControl>
  </div>
</template>
<script setup>
import { onMounted } from '@vue/runtime-core'
import * as Cesium from 'cesium'
import config from './config/config'
import addLayers from './config/addLayers'
import { ref, getCurrentInstance } from 'vue'

import LayerControl from './components/layerControl.vue'
import Header from './components/header.vue'
import CesiumNavigation from 'cesium-navigation-es6'

Array.prototype.remove = function (val) {
  var index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1)
  }
}
// 获取当前组件实例

const { proxy } = getCurrentInstance()

const showlayerscontrol = ref(false)
var viewer = ref()

var chooserLayers = []
//选择菜单事件
function chooseNav(e) {
  switch (e) {
    case 0:
      showlayerscontrol.value = showlayerscontrol.value ? false : true
      break
  }
}
//关闭图层控制
function closeLayerControl() {
  showlayerscontrol.value = false
}
//加载所有被选的
function load3Dlayers() {
  let layersCount = config.layerUrls.length
  for (let i = 0; i < layersCount; i++) {
    chooserLayers.push({
      id: config.layerUrls[i].id,
      layer: addLayers.add3DTileLayer(viewer, config.layerUrls[i].url),
    })
  }
}
function parentChooseLayer(e) {
  if (e.visible) {
    if (chooserLayers.length > 0) {
      let clyers = chooserLayers.filter((lyr) => {
        return lyr.id == e.id
      })
      if (clyers.length > 0) {
        clyers[0].layer.show = true
      } else {
        chooserLayers.push({
          id: e.id,
          layer: addLayers.add3DTileLayer(viewer, e.url),
        })
      }
    } else {
      chooserLayers.push({
        id: e.id,
        layer: addLayers.add3DTileLayer(viewer, e.url),
      })
    }

    //显示所有被选中的
    // if (curentLayer == null) {
    //   curentLayer = addLayers.add3DTileLayer(viewer, e.url)
    // } else {
    //   curentLayer.show = true
    // }
    // viewer.flyTo(curentLayer)
  } else {
    chooserLayers.map((lyr) => {
      if (lyr.id == e.id) {
        lyr.layer.show = false
      }
    })
    //隐藏所有没有选中
    // if (curentLayer != null) {
    //   curentLayer.show = false
    //   curentLayer = null
    // }
  }
  console.log(chooserLayers)

  //console.log(viewer.scene.primitives)

  // if (cesium.layer3DList.length > 0) {
  //   for (var i = 0; i < cesium.layer3DList.length; i++) {
  //     if (cesium.layer3DList[i].id == id) {
  //       cesium.cesiumViewer.scene.imageryLayers.remove(
  //         cesium.layer3DList[i].layer
  //       )
  //     }
  //   }
  // }
}
//cesium-navigation-es6
function addNavigation() {
  var options = {
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是经纬度数组[lon,lat,height]或者 rectangle[west,south,east,north]
    defaultResetView: [101.54875325, 25.31589924, 35],
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    enableCompass: true,
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    enableZoomControls: true,
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    enableDistanceLegend: true,
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    enableCompassOuterRing: true,
  }
  let cesiumNavigation = new CesiumNavigation(viewer, options)
}

onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDAzNWRkOS0yNDIzLTQ2M2ItOWZjNS00NjM0N2E4ZjBlM2QiLCJpZCI6NTc5NTcsImlhdCI6MTYyMjcxNzYzNH0.ZvIx1jc3OymUOVaeXy-Eg-fxTEkm_IHJizaAOjcUKjQ'
  const custom = new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
  })
  viewer = new Cesium.Viewer('cesiumContainer', {
    //不创建baseLayerPicker小部件
    animation: false, // 动画部件
    baseLayerPicker: false, // 基础图层部件
    fullscreenButton: false, // 全屏按钮部件
    vrButton: false, // vr部件
    geocoder: false, // 位置搜索部件
    homeButton: false, // home按钮
    infoBox: false, // 消息框部件
    sceneModePicker: false, // 二三维切换部件
    selectionIndicator: false,
    timeline: false, // 时间轴部件
    navigationHelpButton: false, // 导航帮助按钮
    navigationInstructionsInitiallyVisible: false, // 导航说明显示
    scene3DOnly: false, // 当设置为true时，每个几何图形实例将仅以3D形式呈现，以节省GPU内存。

    //设置图像提供的程序
    imageryProvider: custom,

    //设置cesium世界地形
    // terrainProvider: Cesium.createWorldTerrain({
    //   requestWaterMask: true,
    //   requestVertexNormals: true,
    // }),
  })
  //去掉cesium icon
  viewer._cesiumWidget._creditContainer.style.display = 'none'
  load3Dlayers() //默认加载全部

  addNavigation()

  //测量工具

  //viewer.scene.globe.depthTestAgainstTerrain = true

  //开挖

  // var position = Cesium.Cartographic.toCartesian(
  //   new Cesium.Cartographic.fromDegrees(101.54875325, 25.31589924, 0.8)
  // )
  // var distance = -600.0 // 开挖距离
  // var boundingSphere = new Cesium.BoundingSphere(position, distance)

  // viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
  //   modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
  //   planes: [
  //     new Cesium.ClippingPlane(new Cesium.Cartesian3(1.0, 0.0, 0.0), distance),
  //     new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), distance),
  //     new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), distance),
  //     new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, -1.0, 0.0), distance),
  //   ],
  //   edgeWidth: 0.0,
  //   edgeColor: Cesium.Color.WHITE,
  // })

  // viewer.camera.viewBoundingSphere(
  //   boundingSphere,
  //   new Cesium.HeadingPitchRange(0.5, 1.0, boundingSphere.radius * 5.0)
  // )
  // viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)

  //获取坐标
  // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // handler.setInputAction(function (event) {
  //   var earthPosition = viewer.camera.pickEllipsoid(
  //     event.position,
  //     viewer.scene.globe.ellipsoid
  //   )
  //   var cartographic = Cesium.Cartographic.fromCartesian(
  //     earthPosition,
  //     viewer.scene.globe.ellipsoid,
  //     new Cesium.Cartographic()
  //   )
  //   var lat = Cesium.Math.toDegrees(cartographic.latitude)
  //   var lng = Cesium.Math.toDegrees(cartographic.longitude)
  //   var height = cartographic.height
  //   console.log('[Lng=>' + lng + ',Lat=>' + lat + ',H=>' + height + ']')
  //   //开挖

  //   //方式一
  //   //handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK) //移除事件

  //   //方式二
  //   viewer.screenSpaceEventHandler.removeInputAction(
  //     Cesium.ScreenSpaceEventType.LEFT_CLICK
  //   )
  // }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  //设置查看器 昆明翠湖
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(102.703689, 25.048474, 5000),
  //   //方向、俯视和仰视的视角
  //   orientation: {
  //     heading: Cesium.Math.toRadians(90),
  //     pitch: Cesium.Math.toRadians(-45),
  //   },
  // })
  //设置查看器 到纽约
  // viewer.camera.setView({
  //   destination: new Cesium.Cartesian3(1332761, -4662399, 4137888),
  //   orientation: {
  //     heading: 0.6,
  //     pitch: -0.66,
  //   },
  // })
  //加载3d模型
  // 加载纽约建筑物模型
  // var citytileset = viewer.scene.primitives.add(
  //   new Cesium.Cesium3DTileset({
  //     url: Cesium.IonResource.fromAssetId(75343),
  //   })
  // )
  //定义3D样式
  // var heightStyle = new Cesium.Cesium3DTileStyle({
  //   color: {
  //     conditions: [
  //       ['${floor}>=9', 'rgba(45, 0, 75, 0.5)'],
  //       ['${floor}>=7', 'rgb(102, 71, 151)'],
  //       ['${floor}>=6', 'rgb(170, 162, 204)'],
  //       ['${floor}>=5', 'rgb(224, 226, 238)'],
  //       ['${floor}>=4', 'rgb(252, 230, 200)'],
  //       ['${floor}>=3', 'rgb(248, 176, 87)'],
  //       ['${floor}>=2', 'rgb(198, 106, 11)'],
  //       ['true', 'rgb(127, 59, 8)'],
  //     ],
  //   },
  // })

  //citytileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle)
})
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html,
body,
#cesiumContainer {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  position: relative;
}
.el-tree {
  background: rgba(2, 19, 54, 0.1);
  color: #fff;
}
.el-tree-node {
  height: 3.4vh;
  line-height: 3.4vh;
}
.el-tree-node:hover {
  background: rgba(2, 19, 54, 0.5);
}
.el-tree-node__content {
  height: 4vh;
  line-height: 4vh;
}
.el-tree-node__content:hover {
  background: rgba(2, 19, 54, 0.5);
}
/* //使用的地方  不要加scoped */
.el-tree-node.is-current > .el-tree-node__content {
  background-color: rgba(2, 19, 54, 0.5) !important;
}

/* 定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #0096ff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  border-radius: 10px;
  background-color: rgba(240, 240, 240, 0.5);
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  background-color: rgba(240, 240, 240, 0.5);
}
</style>
