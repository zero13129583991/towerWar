
//返回唯一标识符，仅用于事件定义
var __uuid = 0;
function getUID () {
    __uuid = __uuid + 1;
    return __uuid;
}

var ET = {};

// game Module

//应用逻辑协议 start//
ET.NET_CONNECT_REQ = getUID();
ET.NET_CONNECT_RSP = getUID();
ET.NET_LOGIN_REQ = getUID();
ET.NET_LOGIN_RSP = getUID();

module.exports = ET;