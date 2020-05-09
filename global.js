const serverip="127.16.63.208"
const host = 'http://' + serverip + '/index/api';
const secret = '035c73f7-bb6b-4889-a715-d9eb2d1925cc';
const baseMediaUrl='ws://' + serverip + '/';
function genApiUrl(method){
	return host+method+"?secret="+secret;
}
export default{
	serverip,
    host,
    secret,
	genApiUrl,
	baseMediaUrl
}