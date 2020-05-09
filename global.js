const host = 'http://10.168.1.22/index/api';
const secret = '035c73f7-bb6b-4889-a715-d9eb2d1925cc';
const baseMediaUrl='http://10.168.1.22/';
function genApiUrl(method){
	return host+method+"?secret="+secret;
}
export default{
    host,
    secret,
	genApiUrl,
	baseMediaUrl
}