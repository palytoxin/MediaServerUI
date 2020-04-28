const host = 'http://218.59.173.214:801/index/api';
const secret = '035c73f7-bb6b-4889-a715-d9eb2d1925cc';
const baseMediaUrl='rtmp://218.59.173.214/';
function genApiUrl(method){
	return "/bpi"+method+"?secret="+secret;
}
export default{
    host,
    secret,
	genApiUrl,
	baseMediaUrl
}