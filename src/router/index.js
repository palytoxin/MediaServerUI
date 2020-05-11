import Vue from 'vue'
import VueRouter from 'vue-router'

import control from '../components/control.vue'
import videoList from '../components/videoList.vue'
import HelloWorld from '../components/HelloWorld.vue'
Vue.use(VueRouter)

export default new VueRouter({
	mode:'hash',
	routes: [{
			path: '/',
			component: control,
		},
		{
			path: '/videoList',
			component: videoList,
		},
	]
})
