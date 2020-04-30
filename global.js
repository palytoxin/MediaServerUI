const host = 'http://localhost/index/api';
const secret = '035c73f7-bb6b-4889-a715-d9eb2d1925cc';
const baseMediaUrl='ws://localhost/';
function genApiUrl(method){
	return host+method+"?secret="+secret;
}
export default{
    host,
    secret,
	genApiUrl,
	baseMediaUrl
}