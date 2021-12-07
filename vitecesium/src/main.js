import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCesium from 'vue-cesium'
import 'vue-cesium/dist/index.css'
import App from './App.vue'


const app = createApp(App)

app.use(ElementPlus)
app.use(VueCesium)

app.mount('#app')
