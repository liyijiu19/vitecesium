<template>
  <vc-viewer
    ref="vcViewer"
    :animation="animation"
    :baseLayerPicker="baseLayerPicker"
    :timeline="timeline"
    :fullscreenButton="fullscreenButton"
    :infoBox="infoBox"
    :showCredit="showCredit"
    @cesiumReady="onCesiumReady"
    @ready="onViewerReady"
    @leftClick="onLeftClick"
  >
    <Header @chooseNav="chooseNav"></Header>
    <!-- 图层控制 -->
    <LayerControl
      @parentChooseLayer="parentChooseLayer"
      :showlayerscontrol="showlayerscontrol"
      @closeLayerControl="closeLayerControl"
    ></LayerControl>
    <!-- 天地图 -->
    <!-- 注记层 -->
    <vc-layer-imagery
      :alpha="alpha"
      :brightness="brightness"
      :contrast="contrast"
      :sortOrder="20"
    >
      <vc-provider-imagery-tianditu
        mapStyle="cva_c"
        token="436ce7e50d27eede2f2929307e6b33c0"
      ></vc-provider-imagery-tianditu>
    </vc-layer-imagery>
    <vc-layer-imagery
      :alpha="alpha"
      :brightness="brightness"
      :contrast="contrast"
      :sortOrder="10"
    >
      <vc-provider-imagery-tianditu
        :mapStyle="mapStyle"
        token="436ce7e50d27eede2f2929307e6b33c0"
        ref="provider"
      ></vc-provider-imagery-tianditu>
    </vc-layer-imagery>
    <!-- navigation 工具 -->
    <vc-navigation
      :offset="offset"
      @compass-evt="onNavigationEvt"
      :otherOpts="otherOpts"
      @zoom-evt="onNavigationEvt"
    ></vc-navigation>

    <!-- 测量工具 -->
    <vc-measurements
      ref="measurementsRef3"
      position="bottom-left"
      :mainFabOpts="measurementFabOptions3"
      :distanceMeasurementOpts="distanceMeasurementOpts3"
      :componentDistanceMeasurementOpts="componentDistanceMeasurementOpts3"
      :pointMeasurementOpts="pointMeasurementOpts3"
      :editable="true"
      :offset="[20, 20]"
    >
    </vc-measurements>
    <!-- 模型属性 -->
    <Modelattribute
      :id="modelId"
      :showWindow="showWindowAttribute"
    ></Modelattribute>
  </vc-viewer>
</template>

<script setup>
import { DistanceUnits, AngleUnits } from 'vue-cesium'
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import config from './config/config'
import addLayers from './config/addLayers'
import LayerControl from './components/layerControl.vue'
import Header from './components/header.vue'
import Modelattribute from './components/modelattribute.vue'

const { proxy } = getCurrentInstance()
//图层控制变量
const showlayerscontrol = ref(false)
let identify = false
const modelId = ref(0)
const showWindowAttribute = ref(false)

var Cesium = null
var viewer = null

let loading = true
let animation = false
let timeline = false
let baseLayerPicker = false
let fullscreenButton = false
let infoBox = false
let showCredit = false

let point = {
  pixelSize: 28,
  color: 'red',
}

let offset = [10, 125]
let otherOpts = {
  offset: [0, 32],
  position: 'bottom-right',
}

//测量工具变量
let measurementFabOptions3 = {
  direction: 'right',
  autoExpand: false,
  color: 'primary',
}
let distanceMeasurementOpts3 = {
  direction: 'right',
  autoExpand: false,
  color: 'primary',
}
let componentDistanceMeasurementOpts3 = {
  measureUnits: {
    distanceUnits: DistanceUnits.KILOMETERS,
    angleUnits: AngleUnits.RADIANS,
  },
  decimals: {
    distance: 4,
    angle: 3,
  },
}
let pointMeasurementOpts3 = {
  measureUnits: {
    distanceUnits: DistanceUnits.METERS,
    angleUnits: AngleUnits.DEGREES_MINUTES_SECONDS,
    slopeUnits: AngleUnits.DEGREES,
  },
  decimals: {
    lng: 3,
    lat: 3,
    height: 2,
    slope: 3,
  },
}

var chooserLayers = []
//选择菜单事件
function chooseNav(e) {
  switch (e) {
    case 0: //图层控制
      showlayerscontrol.value = showlayerscontrol.value ? false : true
      break
    case 1: //属性查询
      if (!identify) {
        identifyInfo(proxy.Cesium, proxy.viewer)
        identify = true
      } else {
        //方式一
        //方式二
        proxy.viewer.screenSpaceEventHandler.removeInputAction(
          proxy.Cesium.ScreenSpaceEventType.LEFT_CLICK
        )
        // proxy.viewer.container.removeChild(
        //   document.getElementById('nameOverlay')
        // )

        identify = false
      }

      break
    case 2:
      break
    case 3:
      break
    case 4:
      break
  }
}
//关闭图层控制
function closeLayerControl() {
  showlayerscontrol.value = false
}
//加载所有被选的
function load3Dlayers(Cesium, viewer) {
  let layersCount = config.layerUrls.length
  for (let i = 0; i < layersCount; i++) {
    chooserLayers.push({
      id: config.layerUrls[i].id,
      layer: addLayers.add3DTileLayer(Cesium, viewer, config.layerUrls[i].url),
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
      }
    }
  } else {
    chooserLayers.map((lyr) => {
      if (lyr.id == e.id) {
        lyr.layer.show = false
      }
    })
  }
}
//属性查询，高亮选中的对象
function identifyInfo(Cesium, viewer) {
  //高亮选中的模型
  // HTML overlay for showing feature name on mouseover
  // if (document.getElementById('nameOverlay')) {
  //   document.getElementById('nameOverlay').innerHTML = ''
  // }
  showWindowAttribute.value = showWindowAttribute.value ? false : true

  var nameOverlay = document.createElement('div')
  nameOverlay.id = 'nameOverlay'

  viewer.container.appendChild(nameOverlay)
  nameOverlay.className = 'backdrop'
  nameOverlay.style.display = 'none'
  nameOverlay.style.position = 'absolute'
  nameOverlay.style.bottom = '0'
  nameOverlay.style.left = '0'
  nameOverlay.style['pointer-events'] = 'none'
  nameOverlay.style.padding = '4px'
  nameOverlay.style.backgroundColor = 'red'

  // Information about the currently selected feature
  var selected = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  }

  // An entity object which will hold info about the currently selected feature for infobox display
  var selectedEntity = new Cesium.Entity()

  // Get default left click handler for when a feature is not picked on left click
  var clickHandler = viewer.screenSpaceEventHandler.getInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  )

  // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
  // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
  if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
    // Silhouettes are supported
    var silhouetteBlue =
      Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE
    silhouetteBlue.uniforms.length = 0.01
    silhouetteBlue.selected = []

    var silhouetteGreen =
      Cesium.PostProcessStageLibrary.createEdgeDetectionStage()
    silhouetteGreen.uniforms.color = Cesium.Color.LIME
    silhouetteGreen.uniforms.length = 0.01
    silhouetteGreen.selected = []

    viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
        silhouetteGreen,
      ])
    )

    // Silhouette a feature blue on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // If a feature was previously highlighted, undo the highlight
      silhouetteBlue.selected = []

      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = 'none'
        return
      }

      // A feature was picked, so show it's overlay content
      nameOverlay.style.display = 'block'
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + 'px'
      nameOverlay.style.left = movement.endPosition.x + 'px'
      var id = pickedFeature.getProperty('batchId')
      modelId.value = id
      // getInfo.getInfoById(id).then((data) => {
      //   console.log(data)
      // })

      nameOverlay.textContent = id

      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        silhouetteBlue.selected = [pickedFeature]
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // Silhouette a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // If a feature was previously selected, undo the highlight
      silhouetteGreen.selected = []

      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement)
        return
      }

      // Select the feature if it's not already selected
      if (silhouetteGreen.selected[0] === pickedFeature) {
        return
      }

      // Save the selected feature's original color
      var highlightedFeature = silhouetteBlue.selected[0]
      if (pickedFeature === highlightedFeature) {
        silhouetteBlue.selected = []
      }

      // Highlight newly selected feature
      silhouetteGreen.selected = [pickedFeature]

      // Set feature infobox description

      var featureName = pickedFeature.getProperty('name')
      selectedEntity.name = featureName
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>'
      viewer.selectedEntity = selectedEntity
      selectedEntity.description =
        '<table class="cesium-infoBox-defaultTable"><tbody>' +
        '<tr><th>BIN</th><td>' +
        pickedFeature.getProperty('batchId') +
        '</td></tr>' +
        '</tbody></table>'
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK)
  } else {
    // Silhouettes are not supported. Instead, change the feature color.

    // Information about the currently highlighted feature
    var highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    }

    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // If a feature was previously highlighted, undo the highlight
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor
        highlighted.feature = undefined
      }
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = 'none'
        return
      }
      // A feature was picked, so show it's overlay content
      nameOverlay.style.display = 'block'
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + 'px'
      nameOverlay.style.left = movement.endPosition.x + 'px'
      var name = pickedFeature.getProperty('name')
      if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty('id')
      }
      nameOverlay.textContent = name
      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor)
        pickedFeature.color = Cesium.Color.YELLOW
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // If a feature was previously selected, undo the highlight
      if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor
        selected.feature = undefined
      }
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement)
        return
      }
      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) {
        return
      }
      selected.feature = pickedFeature
      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(highlighted.originalColor, selected.originalColor)
        highlighted.feature = undefined
      } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor)
      }
      // Highlight newly selected feature
      pickedFeature.color = Cesium.Color.LIME
      // Set feature infobox description
      var featureName = pickedFeature.getProperty('name')
      selectedEntity.name = featureName
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>'
      viewer.selectedEntity = selectedEntity
      selectedEntity.description =
        '<table class="cesium-infoBox-defaultTable"><tbody>' +
        '<tr><th>BIN</th><td>' +
        pickedFeature.getProperty('batchId') +
        '</td></tr>' +
        '</tbody></table>'
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}
function kwAnlyze() {
  var position = proxy.Cesium.Cartographic.toCartesian(
    new proxy.Cesium.Cartographic.fromDegrees(101.54875325, 25.31589924, 20)
  )
  var distance = -1000.0 // 开挖距离
  var boundingSphere = new proxy.Cesium.BoundingSphere(position, distance)

  proxy.viewer.scene.globe.clippingPlanes =
    new proxy.Cesium.ClippingPlaneCollection({
      modelMatrix: proxy.Cesium.Transforms.eastNorthUpToFixedFrame(position),
      planes: [
        new proxy.Cesium.ClippingPlane(
          new proxy.Cesium.Cartesian3(1.0, 0.0, 0.0),
          distance
        ),
        new proxy.Cesium.ClippingPlane(
          new proxy.Cesium.Cartesian3(-1.0, 0.0, 0.0),
          distance
        ),
        new proxy.Cesium.ClippingPlane(
          new proxy.Cesium.Cartesian3(0.0, 1.0, 0.0),
          distance
        ),
        new proxy.Cesium.ClippingPlane(
          new proxy.Cesium.Cartesian3(0.0, -1.0, 0.0),
          distance
        ),
      ],
      edgeWidth: 0.0,
      edgeColor: proxy.Cesium.Color.WHITE,
    })

  proxy.viewer.camera.viewBoundingSphere(
    boundingSphere,
    new proxy.Cesium.HeadingPitchRange(0.5, 1.0, boundingSphere.radius * 5.0)
  )
  proxy.viewer.camera.lookAtTransform(proxy.Cesium.Matrix4.IDENTITY)
}
onMounted(() => {
  proxy.$refs.vcViewer.createPromise.then(({ Cesium, viewer }) => {})
})
function onViewerReady({ Cesium, viewer }) {
  proxy.Cesium = Cesium
  proxy.viewer = viewer
  //去掉cesium icon
  viewer._cesiumWidget._creditContainer.style.display = 'none'
  //视角定位到牟定
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      101.54875325,
      25.31589924,
      5000.0
    ),
  })
  //加载管网模型
  load3Dlayers(Cesium, viewer)
  //高亮显示选中的模型
  // identifyInfo(Cesium, viewer)
  //开挖
  kwAnlyze()
  //画图工具
}
function onCesiumReady(e) {}
function onNavigationEvt(e) {}
function onEntityClick(e) {}
function onLeftClick(e) {}
function load() {
  // proxy.$refs.vcViewer.load().then((e) => {
  //   console.log(e)
  //   proxy.loading = false
  // })
}
function unload() {
  // proxy.$refs.vcViewer.unload().then((e) => {
  //   console.log(e)
  //   proxy.loading = true
  // })
}
function reload() {
  // proxy.loading = true
  // proxy.$refs.vcViewer.reload().then((e) => {
  //   console.log(e)
  //   proxy.loading = false
  // })
}
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}
vc-viewer {
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
