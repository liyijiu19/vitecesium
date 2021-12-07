<template>
  <div id="header">
    <div class="title">{{ title }}</div>
    <div class="navbar">
      <ul>
        <li
          v-for="(item, index) in navitems"
          :key="index"
          @click="clickitem(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div id="exit">退出</div>
  </div>
</template>

<script setup>
import config from '../config/config'
import { defineProps, defineEmits, defineExpose, ref } from 'vue'
const title = config.title
const navitems = config.navitems
const emit = defineEmits(['chooseNav'])
function clickitem(idx) {
  emit('chooseNav', idx)
}
</script>

<style>
#header {
  position: absolute;
  left: 0;
  top: 0;
  height: 10.5vh;
  line-height: 10.5vh;
  width: 100vw;
  background: url('src/assets/biaotikuang.png') no-repeat;
  background-size: 100% 100%;
  z-index: 9999;
  color: #fff;
  text-align: center;
}
.title {
  font-size: 1.4vw;
  text-align: left;
  padding-left: 1vw;
  letter-spacing: 0.3vw;
  font-weight: bold;
}
.navbar {
  position: absolute;
  top: 0;
  right: 20vw;
}
.navbar ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.navbar ul li {
  float: left;
  width: 6vw;
  height: 6vh;
  line-height: 7vh;
  font-size: 0.9vw;
  border-right: 1px solid #2c3e50;
}
.navbar ul li:last-child {
  border-right: none;
}
.navbar ul li:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.6);
  color: #f60;
}

#exit {
  position: absolute;
  top: 0;
  right: 1vw;
  height: 6vh;
  line-height: 6vh;
  width: 4.2vw;
  background: url('src/assets/exit.png') no-repeat;
  background-position-x: 0;
  background-position-y: 2vh;
  cursor: pointer;
  color: #0099cc;
  font-weight: bold;
}
#exit:hover {
  color: #ff6600;
}
</style>