<template>
	<div id="app">
		<div style="background-color: #FFFFFF; margin-bottom: 1rem; position: relative; padding: 0.5rem; text-align: left;">
			<span style="font-size: 1rem; font-weight: bold;">视频列表</span>
			<div style="position: absolute; right: 1rem; top: 0.3rem;"><el-button icon="el-icon-refresh-right" circle size="mini" @click="getVideoList()"></el-button></div>
		</div>
		<div class="videoList">
			<div class="video-item" v-for="(item, index) in videoList">
				<!-- <video class="video-js vjs-default-skin vjs-big-play-centered" :id="genVideoId(index, item)" style="width: 15rem; height: 10rem;" controls>
				</video> -->
				<img src="../assets/play.png" @click="showVideo(item)" />
				<div class="video-item-title">
					{{ item.stream }}
					<el-button icon="el-icon-search" circle size="mini" style="float: right;" @click="showVideoInfo(item)"></el-button>
				</div>
			</div>
		</div>

		<el-dialog title="视频播放" :visible.sync="showVideoDialog" :destroy-on-close="true">
			<iframe
				:src="getPlayerPath"
				style="width:100%; height:35rem;"
				frameborder="no"
				border="0"
				marginwidth="0"
				marginheight="0"
				scrolling="no"
				allowtransparency="yes"
			></iframe>
			<div id="shared">
				<div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
					<span style="width: 5rem; line-height: 2.5rem; text-align: right;">播放地址：</span>
					<el-input v-model="getPlayerShared.sharedUrl" :disabled="true" v-on:click.native="copySharedInfo(getPlayerShared.sharedUrl)"></el-input>
				</div>
				<div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
					<span style="width: 5rem; line-height: 2.5rem; text-align: right;">iframe：</span>
					<el-input v-model="getPlayerShared.sharedIframe" :disabled="true" v-on:click.native="copySharedInfo(getPlayerShared.sharedIframe)"></el-input>
				</div>
				<div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
					<span style="width: 5rem; line-height: 2.5rem; text-align: right;">rtmp：</span>
					<el-input v-model="getPlayerShared.sharedRtmp" :disabled="true" v-on:click.native="copySharedInfo(getPlayerShared.sharedRtmp)"></el-input>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {},
	data() {
		return {
			videoUrl: '',
			showVideoDialog: false,
			videoList: [],
			videoComponentList: [],
			currentPlayerInfo: {}, //当前播放对象
			updateLooper:0,//数据刷新轮训标志
		};
	},
	computed: {
		getPlayerPath: function() {
			return '/video/video.html?url=' + this.videoUrl;
		},
		getPlayerShared: function() {
			let info = {
				sharedUrl: window.location.host + '/video/video.html?url=' + this.videoUrl,
				sharedIframe: '<iframe src="'+window.location.host + '/video/video.html?url=' + this.videoUrl+'"></iframe>',
				sharedRtmp: this.videoUrl
			};
			return info;
		}
	},
	mounted() {
		this.initData();
		this.updateLooper=setInterval(this.initData,3000);
	},
	destroyed() {
		this.$destroy('videojs');
		clearTimeout(this.updateLooper);
	},
	methods: {
		initData:function(){
			this.getVideoList();
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
			let msg = '所属应用：' + videoData.app + ' 数据流类型：' + videoData.schema + ' 流名称：' + videoData.stream + ' 观看人数：' + videoData.readerCount;
			this.$alert(msg, '视频信息', {
				confirmButtonText: '确定'
			});
		},
		showVideo: function(streamInfo) {
			this.showVideoDialog = true;
			this.videoUrl = this.$global.baseMediaUrl + streamInfo.app + '/' + streamInfo.stream;
			this.currentPlayerInfo = streamInfo;
		},
		copySharedInfo: function(data) {
			console.log('复制内容：' + data);
			let _this = this;
			this.$copyText(data).then(
				function(e) {
					_this.$message({
						showClose: true,
						message: '复制成功',
						type: 'success'
					});
				},
				function(e) {
					_this.$message({
						showClose: true,
						message: '复制失败，请手动复制',
						type: 'error'
					});
				}
			);
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
