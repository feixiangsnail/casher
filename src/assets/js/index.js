var routeList = {
    id: 'mainRouter',
    routes: [
        {
            path: '/', pageUrl: 'pages/cashPage.html',
        },

        {
            path: '/orderList', pageUrl: 'pages/orderList.html',
        },
    ]
}

init();

function init() {
    initStyle()
    route = new RouterMix(routeList);
    $(window).resize(function ()// 绑定到窗口的这个事件中
    {
        initStyle()
    });
}





























function initStyle() {
    var whdef = 100 / 1280;// 表示1920的设计图,使用100PX的默认值
    var wH = window.innerHeight;// 当前窗口的高度
    var wW = window.innerWidth;// 当前窗口的宽度
    var rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
    $('html').css('font-size', rem + "px");



}








function gGet(url, params) {
    return axios({
        method: 'get',
        url: url,
        params,
        withCredentials: true,
        timeout: 30000
    })
}
function gPost(url, data) {
    return axios({
        method: 'post',
        url: url,
        data: data,
        timeout: 30000,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
