<template>
	<div id="app">
		<div style="background-color: #FFFFFF; margin-bottom: 1rem; position: relative; padding: 0.5rem; text-align: left;">
			<span style="font-size: 1rem; font-weight: bold;">视频列表</span>
			<div style="position: absolute; right: 1rem; top: 0.3rem;">
				<el-button icon="el-icon-refresh-right" circle size="mini" @click="getVideoList()"></el-button>
			</div>
		</div>
		<div class="videoList">
			<div class="video-item" v-for="(item, index) in videoList">
				<video class="video-js vjs-default-skin vjs-big-play-centered" :id="genVideoId(index, item)" style="width: 15rem; height: 10rem;" controls>
					<!-- <source src="rtmp://218.59.173.214/rtp/0BEBC202" type="rtmp/flv"> -->
				</video>
				<div class="video-item-title">
					{{ item.stream }}
					<el-button icon="el-icon-search" circle size="mini" style="float: right;" @click="showVideoInfo(item)"></el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'videojs-flash';
export default {
	name: 'app',
	components: {},
	data() {
		return {
			videoList: [],
			videoComponentList: []
		};
	},
	mounted() {
		this.getVideoList();
	},
	destroyed() {
		this.$destroy('videojs');
		//释放视频播放器空间
		this.videoList.forEach(item => {
			if(typeof item.video!='undefined'){
				item.video.dispose();
			}
			clearTimeout(item.delay);
		});
	},
	methods: {
		genVideoId: function(position, stream) {
			let that = this;
			var story_sources = [
				{
					type: 'rtmp/flv',
					src: that.$global.baseMediaUrl + stream.app + '/' + stream.stream
				}
			];
			//延迟1s执行，给dom生成一定的时间
			stream.delay=setTimeout(function() {
				let player = videojs('video-' + position); 
				player.ready(function() {
					var obj = this;
					obj.src(story_sources);
					stream.video=player;
					console.log(JSON.stringify(stream));
				});
			}, 1000);
			return 'video-' + position;
		},
		getVideoList: function() {
			let that = this;
			this.$axios({
				method: 'get',
				url: this.$global.genApiUrl('/getMediaList') + '&schema=rtmp'
			}).then(function(res) {
				console.log(JSON.stringify(res.data));
				if (res.data.code == 0) {
					that.videoList = res.data.data;
				}
			});
		},
		showVideoInfo: function(videoData) {
			let msg = '所属应用：' + videoData.app + '\n' + '数据流类型：' + videoData.schema + '\n' + '流名称：' + videoData.stream + '\n';
			this.$alert(msg, '视频信息', {
				confirmButtonText: '确定'
			});
		}
	}
};
</script>

<style>
.videoList {
	display: flex;
	flex-wrap: wrap;
	align-content: flex-start;
}
.video-item {
	width: 15rem;
	margin-right: 1rem;
}
.video-item-title {
	color: #000000;
	background-color: #ffffff;
	line-height: 1.5rem;
	padding: 0.3rem;
}
</style>
