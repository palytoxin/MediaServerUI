import Vue from 'vue';
import App from './App.vue';
import global from '../global.js';
Vue.config.productionTip = false;
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index.js';
import axios from 'axios';
import echarts from 'echarts';
Vue.use(ElementUI);
Vue.prototype.$global = global;
Vue.prototype.$axios = axios;



new Vue({
	router: router,
	render: h => h(App),
}).$mount('#app')
