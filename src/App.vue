<template>
	<div id="app">
		<el-container>
			<el-header>
				<el-menu router :default-active="this.$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" mode="horizontal">
					<el-menu-item index="/">控制台</el-menu-item>
					<el-menu-item index="/videoList">视频广场</el-menu-item>
					<el-menu-item index="3">录像回看</el-menu-item>
					<el-menu-item index="4">通道配置</el-menu-item>
				</el-menu>
			</el-header>
			<el-main><router-view></router-view></el-main>
			<el-footer style="position: absolute; bottom: 0; width: 100%;">Binsso-MediaKit v1</el-footer>
		</el-container>
	</div>
</template>

<script>
export default {
	name: 'app',
	components: {}
};
</script>

<style>
html,
body,
#app {
	margin: 0 0;
	background-color: #e9eef3;
	height: 100%;
}
#app {
	margin: 0 0;
}
.el-header,
.el-footer {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
	line-height: 60px;
}
.el-main {
	background-color: #e9eef3;
	color: #333;
	text-align: center;
}
</style>
