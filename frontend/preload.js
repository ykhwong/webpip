global.chrome = {
	"app" : "_",
	"csi" : "_",
	"embeddedSearch" : "_",
	"loadTimes": "_",
	"runtime": "_",
	"constructor": "_",
	"hasOwnProperty" : "_",
	"isPrototypeOf" : "_",
	"propertyIsEnumerable" : "_",
	"toLocaleString" : "_",
	"toString" : "_",
	"valueOf" : "_",
	"__defineGetter__" : "_",
	"__defineSetter__" : "_",
	"__lookupGetter__" : "_",
	"__lookupSetter__" : "_",
	"__proto__" : "_"
};

function getChromeVersion () {
	var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
	return raw ? parseInt(raw[2], 10) : false;
}

if (getChromeVersion () < 70) {
	global.chrome.webstore = "_";
}
