//路由配置信息
var routeList = {
    id: 'mainRouter',
    routes: [{
            path: '/',
            pageUrl: 'pages/cash_page.html',
        },
        {
            path: '/orderList',
            pageUrl: 'pages/order_list.html',
        },
    ]
}

var route = new RouterMix(routeList);
var appVm = new Vue({
    el: '#app',
    data: {
        route: route,
        leftBarList: [{
                path: '#/',
                imgUrl: '//pic.iidingyun.com/file/2452/icn_shouyin.png',
                name: '收银'
            },
            {
                path: '#/orderList',
                imgUrl: '//pic.iidingyun.com/file/2452/icn_dingdan.png',
                name: '订单'
            },
            {
                path: '#/',
                imgUrl: '//pic.iidingyun.com/file/2452/icn_waimai.png',
                name: '外卖'
            },
            {
                path: '#/',
                imgUrl: '//pic.iidingyun.com/file/2452/icn_jiaoban.png',
                name: '交班结算'
            },

        ],
        selectMenu: 0,

    },
    mounted() {
        this.getCurPath()

    },
    methods: {
        menuChange(index) {
            this.selectMenu = index;
        },
        getCurPath() {
            var curPath = '#' + location.href.split('#')[1];
           
            for (var i = 0; i < this.leftBarList.length; i++) {
                if (this.leftBarList[i].path == curPath) this.selectMenu = i;

            }
           
            return curPath;
        }

    }
})

