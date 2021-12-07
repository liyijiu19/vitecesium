export default {
  add3DTileLayer(Cesium, viewer, url) {
    var layer = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: url,
        show: true,
        modelMatrix: Cesium.Matrix4.fromArray([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
        ]),
      }),
    )
    viewer.flyTo(layer)

    // layer.style = new Cesium.Cesium3DTileStyle({
    //   color: new new Cesium.Color(255, 0, 0, 1)(),
    // })
    return layer
  },
}
