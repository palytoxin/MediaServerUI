<template>
	<div id="app">
		<div style="background-color: #FFFFFF; margin-bottom: 1rem; position: relative; padding: 0.5rem; text-align: left;">
			<span style="font-size: 1rem; font-weight: bold;">视频回放</span>
			<div style="position: absolute; right: 1rem; top: 0.3rem;"><el-button icon="el-icon-refresh-right" circle size="mini" @click="getVideoList()"></el-button></div>
		</div>
		<div class="videoList">
			<div class="video-item" v-for="(item, index) in videoList">
				<img src="../assets/play.png" @click="showVideo(item)" />
				<div class="video-item-title">
					{{ item.stream }}
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
		this.updateLooper=setInterval(this.initData,10000);
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
				if (res.data.code == 0) {
					that.videoList = res.data.data;
				}
			});
		},
		showVideo: function(streamInfo) {
			this.showVideoDialog = true;
			this.videoUrl = this.$global.baseMediaUrl + streamInfo.app + '/' + streamInfo.stream+".flv";
			this.currentPlayerInfo = streamInfo;
		},
		recordList:function(){
			let that = this;
			let streamInfo=this.currentPlayerInfo;

			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			if (month < 10) {
				month = "0" + month;
			}
			if (day < 10) {
				day = "0" + day;
			}
			let nowDate = year + "-" + month + "-" + day;

			let stopURL=this.$global.genApiUrl('/getMp4RecordFile') + '&vhost='+streamInfo.vhost+"&app="+streamInfo.app+"&stream="+streamInfo.stream+'&period='+nowDate;


			console.log(stopURL);
			this.$axios({
				method: 'get',
				url: stopURL
			}).then(function(res) {
				console.log(JSON.stringify(res.data));
				if (res.data.code == 0&&res.data) {
					let mp4files = res.data.data.paths;
					let rootPath  = res.data.data.rootPath;
					let weburltemp = rootPath.substr(rootPath.indexOf("record"));
					let weburl = "http://" + that.$global.serverip + "/" + weburltemp;
					for(let i in mp4files) {
						let fullMp4file = weburl + mp4files[i]
						console.log(fullMp4file);
					};
					that.$message({
						showClose: true,
						message: '列表获取成功',
						type: 'success'
					});
				}else{
					that.$message({
						showClose: true,
						message: res.data.msg,
						type: 'error'
					});
				}
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
