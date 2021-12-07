<template>
  <!-- 图层控制 -->
  <div class="layerscontrol" v-show="showlayerscontrol">
    <div class="layercontroltitle">
      {{ layercontriltitle }}
      <div class="layercontrolclose" @click="closeLayerControl">X</div>
    </div>
    <el-tree
      :props="defaultprops"
      :data="loadNode"
      show-checkbox
      :default-checked-keys="checkKeys"
      @check-change="handleCheckChange"
    />
  </div>
</template>

<script setup>
import config from '../config/config'
import { watchEffect, defineProps, defineEmits, defineExpose, ref } from 'vue'
const emit = defineEmits(['parentChooseLayer'])

var props = defineProps({
  showlayerscontrol: {
    type: Boolean,
    defalut: false,
  },
})
watchEffect(() => {
  console.log(props)
})

function closeLayerControl() {
  emit('closeLayerControl')
}

// defineProps({
//   checkKeys: [],
// })

let checkKeys = []

let layercontriltitle = '图层控制'
config.layerUrls.map((item) => {
  checkKeys.push(item.id)
})

const defaultprops = {
  label: 'name',
}
let loadNode = config.layerUrls

function handleCheckChange(data, checked, indeterminate) {
  data['visible'] = checked
  emit('parentChooseLayer', data)

  //console.log(data, checked, indeterminate)
}

defineExpose({
  handleCheckChange,
})
</script>

<style>
.layerscontrol {
  position: absolute;
  left: 0.5vw;
  top: 13.5vh;
  z-index: 9999;
  width: 15vw;
  height: 50vh;
  background: rgba(2, 19, 54, 0.5);
  border: 1px solid #0096ff;
  padding: 1vh;
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: center;
}
.layercontroltitle {
  width: 13vw;
  height: 4vh;
  line-height: 4vh;
  color: #fff;
  font-size: 0.9vw;
  font-weight: bold;
  border-bottom: 1px dotted #fff;
  position: relative;
}
.layercontrolclose {
  position: absolute;
  right: -1.2vw;
  top: -1vh;
  width: 1vw;
  height: 2vh;
  line-height: 2vh;
  border: 1px dotted #fff;

  background-size: 100% 100%;
}
.layercontrolclose:hover {
  cursor: pointer;
}
</style>