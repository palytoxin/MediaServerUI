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
				<img class="video-item-img" :src="getSnap(item)" @click="showVideo(item)" />
				<div class="video-item-title">
					{{ item.stream }}
					<el-button icon="el-icon-search" circle size="mini" style="float: right;" @click="showVideoInfo(item)"></el-button>
				</div>
			</div>
		</div>

		<el-dialog title="视频播放" :visible.sync="showVideoDialog" :destroy-on-close="true">
			<iframe :src="getPlayerPath" ref="videoRender" style="width:100%; height:35rem;" frameborder="no" border="0"
			 marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
			<div id="shared" style="text-align: right;">
				<el-tabs>
					<el-tab-pane label="媒体流信息" name="media">
						<div style="margin-bottom: 0.5rem;">
							<el-button type="primary" size="small" @click="playRecord(true,'')">播放</el-button>
							<el-button type="primary" size="small" @click="startRecord()">录制</el-button>
							<el-button type="primary" size="small" @click="stopRecord()">停止录制</el-button>
						</div>
						<div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
							<span style="width: 5rem; line-height: 2.5rem; text-align: right;">播放地址：</span>
							<el-input v-model="getPlayerShared.sharedUrl" :disabled="true" v-on:click.native="copySharedInfo(getPlayerShared.sharedUrl)"></el-input>
						</div>
						<div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
							<span style="width: 5rem; line-height: 2.5rem; text-align: right;">iframe：</span>
							<el-input v-model="getPlayerShared.sharedIframe" :disabled="true" v-on:click.native="copySharedInfo(getPlayerShared.sharedIframe)"></el-input>
						</div>
						<div style="display: flex; margin-bottom: 0.5rem; height: 2.5rem;">
							<span style="width: 5rem; line-height: 2.5rem; text-align: right;">资源地址：</span>
							<el-input v-model="getPlayerShared.sharedRtmp" :disabled="true" v-on:click.native="copySharedInfo(getPlayerShared.sharedRtmp)"></el-input>
						</div>
					</el-tab-pane>
					<!--{"code":0,"data":{"paths":["22-29-30.mp4"],"rootPath":"/home/kkkkk/Documents/ZLMediaKit/release/linux/Debug/www/record/hls/kkkkk/2020-05-11/"}}-->
					<el-tab-pane label="录像查询" name="second">
						<el-table :data="videoHistory.searchHistoryResult" style="width: 100%">
							<el-table-column label="文件" prop="path" width="500">
							</el-table-column>
							<el-table-column align="right" width="300">
								<template slot="header" slot-scope="scope">
									<el-date-picker v-model="videoHistory.searchHistoryParam" type="date" placeholder="选择日期" @change="recordList()">
									</el-date-picker>
								</template>
							</el-table-column>
							<el-table-column label="">
								<template slot-scope="scope">
									<el-button type="primary" size="mini" @click="playRecord(false,scope.row)">播放</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>

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
				showVideoDialog: false, //控制在线监控实时流窗口的开关
				videoList: [],
				videoComponentList: [],
				currentPlayerInfo: {}, //当前播放对象
				updateLooper: 0, //数据刷新轮训标志
				videoHistory: {
					searchHistoryParam: "",
					searchHistoryResult: [], //媒体流历史记录搜索结果
				}
			};
		},
		computed: {
			getPlayerPath: function() {
				if (!this.showVideoDialog) { //防止出现流断开不彻底的问题
					return '';
				} else {
					return '/video/video.html?url=' + encodeURIComponent(this.videoUrl);
				}
			},
			getPlayerShared: function() {
				let info = {
					sharedUrl: window.location.host + '/video/video.html?url=' + this.videoUrl,
					sharedIframe: '<iframe src="' + window.location.host + '/video/video.html?url=' + this.videoUrl + '"></iframe>',
					sharedRtmp: this.videoUrl
				};
				return info;
			},
		},
		mounted() {
			this.initData();
			this.updateLooper = setInterval(this.initData, 10000);
		},
		destroyed() {
			this.$destroy('videojs');
			clearTimeout(this.updateLooper);
		},
		methods: {
			initData: function() {
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
			showVideoInfo: function(videoData) {
				let msg = '所属应用：' + videoData.app + ' 数据流类型：' + videoData.schema + ' 流名称：' + videoData.stream + ' 观看人数：' +
					videoData.readerCount;
				this.$alert(msg, '视频信息', {
					confirmButtonText: '确定'
				});
			},
			showVideo: function(streamInfo) {
				this.showVideoDialog = true;
				this.videoUrl = this.$global.baseMediaUrl + streamInfo.app + '/' + streamInfo.stream + ".flv?st="+new Date().getTime();
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
			},
			startRecord: function() {
				let that = this;
				let streamInfo = this.currentPlayerInfo;
				let startURL = this.$global.genApiUrl('/startRecord') + '&type=1&vhost=' + streamInfo.vhost + "&app=" + streamInfo
					.app + "&stream=" + streamInfo.stream;
				console.log(startURL);
				this.$axios({
					method: 'get',
					url: startURL
				}).then(function(res) {
					console.log(JSON.stringify(res.data));
					if (res.data.code == 0 && res.data.result) {
						that.$message({
							showClose: true,
							message: '开始录制',
							type: 'success'
						});
					} else {
						that.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error'
						});
					}
				});
			},
			stopRecord: function() {
				let that = this;
				let streamInfo = this.currentPlayerInfo;
				let stopURL = this.$global.genApiUrl('/stopRecord') + '&type=1&vhost=' + streamInfo.vhost + "&app=" + streamInfo.app +
					"&stream=" + streamInfo.stream;
				console.log(stopURL);
				this.$axios({
					method: 'get',
					url: stopURL
				}).then(function(res) {
					console.log(JSON.stringify(res.data));
					if (res.data.code == 0 && res.data.result) {
						that.$message({
							showClose: true,
							message: '结束录制',
							type: 'success'
						});
					} else {
						that.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error'
						});
					}
				});
			},
			recordList: function() {
				let that = this;
				let streamInfo = this.currentPlayerInfo;

				var date = this.videoHistory.searchHistoryParam;
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

				let stopURL = this.$global.genApiUrl('/getMp4RecordFile') + '&vhost=' + streamInfo.vhost + "&app=" + streamInfo.app +
					"&stream=" + streamInfo.stream + '&period=' + nowDate;


				console.log(stopURL);
				this.$axios({
					method: 'get',
					url: stopURL
				}).then(function(res) {
					console.log(JSON.stringify(res.data));
					if (res.data.code == 0 && res.data) {
						let mp4files = res.data.data.paths;
						let rootPath = res.data.data.rootPath;
						let weburltemp = rootPath.substr(rootPath.indexOf("record"));
						let weburl = "http://" + that.$global.serverip + "/" + weburltemp;
						for (let i in mp4files) {
							let fullMp4file = weburl + mp4files[i]
							console.log(fullMp4file);
							that.videoHistory.searchHistoryResult.push({
								"path": fullMp4file
							});
						};
						that.$message({
							showClose: true,
							message: '列表获取成功',
							type: 'success'
						});
					} else {
						that.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error'
						});
					}
				});
			},
			getSnap: function(streamInfo) {

				let videoUrl = this.$global.baseMediaUrl + streamInfo.app + '/' + streamInfo.stream + ".flv";
				console.log("videoUrl:\t" + videoUrl);

				let snapUrl = videoUrl.replace(/^ws/, "http");
				console.log('snapUrl:\t' + snapUrl);

				let fullSnapRequest = this.$global.genApiUrl('/getSnap') + '&timeout_sec=10&expire_sec=30&url=' + snapUrl + "&st=" +
					new Date().getTime();
				console.log('fullSnapRequest:\t' + fullSnapRequest);

				return fullSnapRequest;
			},
			playRecord: function(isBackLive,rowData) {
				console.log("当前行：" + JSON.stringify(rowData));
				this.$refs.videoRender.contentWindow.postMessage({
					cmd: 'switchUrl',
					params: isBackLive?{"path":this.videoUrl,"live":isBackLive}:{"path":rowData.path,"live":isBackLive}
				}, '*')
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

	.video-item-img {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: 100%;
		height: 100%;
	}

	.video-item-img:after {
		content: "";
		display: inline-block;
		position: absolute;
		z-index: 2;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: 3rem;
		height: 3rem;
		background-image: url("../assets/loading.png");
		background-size: cover;
		background-color: #000000;
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
