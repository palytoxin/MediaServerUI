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
				<!-- <video class="video-js vjs-default-skin vjs-big-play-centered" :id="genVideoId(index, item)" style="width: 15rem; height: 10rem;" controls>
				</video> -->
				<img src="../assets/play.png" @click="showVideo(item)"/>
				<div class="video-item-title">
					{{ item.stream }}
					<el-button icon="el-icon-search" circle size="mini" style="float: right;" @click="showVideoInfo(item)"></el-button>
				</div>
			</div>
		</div>
		
		<el-dialog title="视频播放" :visible.sync="showVideoDialog" :destroy-on-close="true">
			<iframe :src="getPlayerPath" style="width:100%; height:35rem;" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {
	},
	data() {
		return {
			videoUrl: '',
			showVideoDialog:false,
			videoList: [],
			videoComponentList: []
		};
	},
	computed:{
		getPlayerPath:function(){
			return '/video/video.html?url='+this.videoUrl;
		}
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
		// genVideoId: function(position, stream) {
		// 	let that = this;
		// 	var story_sources = [
		// 		{
		// 			type: 'rtmp/flv',
		// 			src: that.$global.baseMediaUrl + stream.app + '/' + stream.stream
		// 		}
		// 	];
		// 	//延迟1s执行，给dom生成一定的时间
		// 	stream.delay=setTimeout(function() {
		// 		let player = videojs('video-' + position); 
		// 		player.ready(function() {
		// 			var obj = this;
		// 			obj.src(story_sources);
		// 			stream.video=player;
		// 			console.log(JSON.stringify(stream));
		// 		});
		// 	}, 1000);
		// 	return 'video-' + position;
		// },
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
			let msg = '所属应用：' + videoData.app  + ' 数据流类型：' + videoData.schema + ' 流名称：' + videoData.stream +' 观看人数：'+videoData.readerCount;
			this.$alert(msg, '视频信息', {
				confirmButtonText: '确定'
			});
		},
		showVideo:function(streamInfo){
			this.showVideoDialog=true;
			this.videoUrl=this.$global.baseMediaUrl + streamInfo.app + '/' + streamInfo.stream;
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
	position: relative;
	width: 15rem;
	height: 10rem;
	margin-right: 1rem;
	background-color: #000000;
}
.video-item img {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	width: 3rem;
	height: 3rem;
}
.video-item-title {
	position: absolute;
	bottom: 0;
	color: #000000;
	background-color: #ffffff;
	line-height: 1.5rem;
	padding: 0.3rem;
	width: 14.4rem;
}
</style>
