/*
 * @Author: ZhangShuai 
 * @Date: 2018-01-31 10:45:54 
 * @Last Modified by: ZhangShuai
 * @Last Modified time: 2018-02-01 09:38:03
 */
function RouterMix(routeConfig) {
    this.currentUrl = '';
    this.routes = {};
    this.routeConfig = routeConfig;
    this.init(this.routeConfig);
}
RouterMix.prototype.init = function () {
    var that = this;
    this.routeConfig.routes.parent = this.routeConfig;
    this.relusiveToRoutes(this.routeConfig.routes, this.routeConfig.rootId);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
    window.addEventListener('load', this.refresh.bind(this), false);
}
RouterMix.prototype.relusiveToRoutes = function (routeArr) {
    var that = this;
    var time = routeArr.length;
    while (time > 0) {
        time--;
        that.routes[routeArr[time].path] = that.toPage.bind(this, routeArr[time]) || function () { }
        routeArr[time].parent = routeArr.parent;
        if (routeArr[time].isDefault) {
            this.push(routeArr[time].path)
        }
        if (routeArr[time].child) {
            routeArr[time].child.parent = routeArr[time];
            that.relusiveToRoutes(routeArr[time].child)
        }
    }
}
RouterMix.prototype.toPage = function (routeItem) {
    var _selfRoute = routeItem;
    var stackArr = [];
    while (_selfRoute.parent) {
        stackArr.push(_selfRoute);
        _selfRoute = _selfRoute.parent;
    }
    this.relusiveLoad(stackArr)
}
RouterMix.prototype.relusiveLoad = function (arr) {
    var that = this;
    if (arr.length > 0) {
        var item = arr.pop();
        $.ajax({
            type: "GET",
            url: item.pageUrl,
            data: null,
            success: function (data) {
                $("#" + item.parent.id).html(data);
                that.relusiveLoad(arr)
            }
        });
    }
}
RouterMix.prototype.refresh = function () {
    this.currentUrl = location.hash.slice(1) || '/';
    try {
        this.routes[this.currentUrl]();
    }
    catch (err) {
       
        console.error(err, 'err')
        this.push('/')
    }
}
RouterMix.prototype.push = function (path) {
    var currLocation = location.href.split('#')[0] || location.href;
    location.href = currLocation + '#' + path;
}
