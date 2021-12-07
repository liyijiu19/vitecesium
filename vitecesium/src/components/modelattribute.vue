<template>
  <main v-show="showWindow">
    <div class="attributeTitle">属性信息</div>
    <div class="tableinfo">
      <table id="att_table"></table>
    </div>
  </main>
</template>

<script setup>
import {
  watch,
  watchEffect,
  defineProps,
  defineEmits,
  defineExpose,
  ref,
} from 'vue'
import getInfo from '../config/getInfo'
import attinfo from '../config/attinfo'
const props = defineProps({
  id: 0,
  showWindow: false,
})
function getZh(cnName) {
  let rowdata = attinfo.psline.filter((row) => {
    return row.name == cnName
  })
  if (rowdata.length > 0) {
    return rowdata[0].txt
  } else {
    return cnName
  }
}

watch(props, (newVal, oldVal) => {
  getInfo.getInfoById(newVal.id).then((data) => {
    var att_table = document.getElementById('att_table')
    att_table.innerHTML = ''
    for (let key in data) {
      var tr = document.createElement('tr')
      var td1 = document.createElement('td')
      td1.innerHTML = getZh(key)
      var td2 = document.createElement('td')
      td2.innerHTML = data[key]
      tr.appendChild(td1)
      tr.appendChild(td2)
      att_table.appendChild(tr)
    }
  })
})
</script>

<style>
main {
  position: absolute;
  width: 14vw;
  height: 40vh;
  bottom: 6vh;
  right: 1vw;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 0.1vw;
  border: 1px solid #0096ff;
  font-size: 0.8vw;
}
.attributeTitle {
  height: 4vh;
  line-height: 4vh;
  width: 13.8vw;
  font-size: 0.9vw;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px dotted #fff;
}
.tableinfo {
  height: 36vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.tableinfo table {
  width: 100%;
  border-left: 1px dotted #fff;
  border-top: 1px dotted #fff;
}
.tableinfo table td {
  border-bottom: 1px dotted #fff;
  border-right: 1px dotted #fff;
  font-size: 0.7vw;
  height: 3vh;
  line-height: 3vh;
}
.tableinfo table td:first-child {
  text-align: center;
}
</style>