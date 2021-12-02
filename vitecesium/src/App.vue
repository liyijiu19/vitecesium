

<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from '@vue/runtime-core'
import * as Cesium from 'cesium'
onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMDAzNWRkOS0yNDIzLTQ2M2ItOWZjNS00NjM0N2E4ZjBlM2QiLCJpZCI6NTc5NTcsImlhdCI6MTYyMjcxNzYzNH0.ZvIx1jc3OymUOVaeXy-Eg-fxTEkm_IHJizaAOjcUKjQ'
  const custom = new Cesium.ArcGisMapServerImageryProvider({
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
  })
  const viewer = new Cesium.Viewer('cesiumContainer', {
    //不创建baseLayerPicker小部件
    baseLayerPicker: false,
    //不创建infoBox小部件
    //infoBox: false,
    //不创建fullscreenButton小部件
    //fullscreenButton: false,
    //不创建timeline小部件
    //timeline: false,
    //设置图像提供的程序
    imageryProvider: custom,
    //设置cesium世界地形
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    }),
  })

  viewer.scene.globe.depthTestAgainstTerrain = true
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
  viewer.camera.setView({
    destination: new Cesium.Cartesian3(1332761, -4662399, 4137888),
    orientation: {
      heading: 0.6,
      pitch: -0.66,
    },
  })
  //加载3d模型
  // 加载纽约建筑物模型
  var citytileset = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343),
    })
  )
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

  citytileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle)
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
}
</style>
