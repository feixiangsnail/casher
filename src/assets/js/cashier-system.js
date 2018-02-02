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
var cashierSystemContainer = new Vue({
    el: "#contaniner",
    data: {
        //充值相关数据
        chargeR: {
            postData: {
                "userid": '',
                "buyer_payment_type": '',
                "pay": '',
                "barcode": '',
                "auth_code": '',
            },
            chargeList: [
                {
                    code: 1,
                    name: '现金'
                },
                {
                    code: 2,
                    name: '刷卡'
                },
                {
                    code: 4,
                    name: '微信'
                },
                {
                    code: 5,
                    name: '支付宝'
                },
                {
                    code: 6,
                    name: '签单'
                },
            ],
            hideChargeDg: true,
        },
        //蒙版数据
        maskData:{
            showMasking:false,
            toastMessage:'正在提交请稍后...'
        },
        // p1 不是套餐界面
        p1Show: true,
        p1ShowChild: false,
        p2Show: false,
        // p2套餐界面
        // p1Show: false,
        // p1ShowChild: true,
        // p2Show: true,
        // 收银，支付方式界面
        // p1Show: true,
        // p1ShowChild: false,
        // p2Show: false,
        pageNum: 0, //菜品默认选择
        payWayIndex: 0, //默认支付方式选择
        tickIndex: 1000,//默认优惠券索引
        keyBoardNumList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00', '.', '<img src="//pic.iidingyun.com/file/2452/keyboard_icn_eliminate_normal.png">', '货币汇率'],
        smallKeyBoardList: ['A', '1', '2', '3', 'B', '4', '5', '6', 'C', '7', '8', '9', 'D', '0', '00', '.', '<img src="//pic.iidingyun.com/file/2452/keyboard_icn_eliminate_normal.png">', '关闭'],
        discountList: [
            {
                name: "桌号",
                nameValue: "A5"
            },
            {
                name: "人数",
                nameValue: '1'
            }],
        isShowDiscount: false,
        setDiscount: 10,
        getDiscountList: [],
        smalllKeyboard: false,
        disCountIndex: 0,
        allProductList: [], //所有产品
        packAllProductList: [], //套餐内所有产品
        shopProductList: [], //单品点餐
        shopProductIndex: null,
        packProductIndex: null,
        packProductList: [], //套餐点餐
        packName: '', //套餐名称
        site_product_pack_productid: '',
        packPrice: '', //套餐价格
        totalPackPrice: '', //选定套餐后价格
        tempArr: [],
        getPayWayList: [],
        PayWayList: [],
        memberMsgList: [],
        userTicketData: [],  //会员优惠券信息
        userScoresData: [],// 会员余额信息
        userBalanceVal: '',
        memberCardNo: "",
        isShow: false, //遮罩层设置
        isTasteShow: false,//口味设置是否弹窗
        isShowToast: false, //toast设置
        tasteSelectStr: '',//口味下标
        tasteSelectArr: [],//口味数组
        tasteList: [],
        toastContent: '',
        scorePriceStr1: '',//支付方式优惠金额
        scorePriceStr2: '',//优惠券优惠金额
        discount_value: 0,
        tempInputIndex: 0,
        scorePrice: 0,
        getProductTaste: [],
        getProductTypeTaste: [],
        isCanShowTaste: true
    },
    created: function () {
        var that = this;
        //    获取店铺折扣   获取门店折扣设置：
        axios.get('/api/shop_set/shop_discount_list.vm', {
            params: {
                shopid: shop_id,
            }
        }).then(function (res) {
            if (res.data.code == "success") {
                that.getDiscountList = res.data.data;
            } else {
                console.log(res.data.msg);
            }
        })
            .catch(function (error) {
                console.log(error);
            });
        //    产品接口
        axios.get('/api/shop/shop_product_cashier_select.vm', {
            params: {
                shopid: shop_id,
            }
        }).then(function (res) {
            if (res.data.code == "success") {
                that.allProductList = res.data.data;
            } else {
                console.log(res.data.msg);
            }
        })
            .catch(function (error) {
                console.log(error);
            });
        //      获取门店支付方式
        axios.post('/api/shop_set/shop_pay_type_list_select.vm', {
            shopid: shop_id,
        }).then(function (res) {
            if (res.data.code == "success") {
                cashierSystemContainer.getPayWayList = res.data.data;
            } else {
                console.log(res.data.msg);
            }
        })
            .catch(function (error) {
                console.log(error);
            });
        //     获取产品口味
        axios.get('/api/product/site_product_taste_select_map.vm').then(function (res) {
            if (res.data.code == "success") {
                cashierSystemContainer.getProductTaste = res.data.data;
            } else {
                console.log(res.data.msg);
            }
        })
            .catch(function (error) {
                console.log(error);
            });
        //获取产品分类口味
        axios.get('/api/product/site_product_type_taste_select_map.vm').then(function (res) {
            if (res.data.code == "success") {
                cashierSystemContainer.getProductTypeTaste = res.data.data;
            } else {
                console.log(res.data.msg);
            }
        })
            .catch(function (error) {
                console.log(error);
            });
    },
    
    methods: {
        //打开充值弹框
        openChargeDg() {          
            if (isNaN(this.memberMsgList.storage)) {
                alert('请输入有效预存金额')
                return;
            }
            else{
                console.log(this.memberMsgList.storage,'this.memberMsgList.storage')
            }
            this.chargeR.postData.userid = this.memberMsgList.userid;
            this.chargeR.postData.pay = this.memberMsgList.storage;
            this.chargeR.postData.barcode = this.memberCardNo;
            this.chargeR.hideChargeDg = false;
        },
        closeChargeDg() {
            this.chargeR.postData.buyer_payment_type='';
            this.chargeR.hideChargeDg = true;
        },
        chooseChargeWay(index) {
            var that = this;
            if( this.chargeR.postData.buyer_payment_type===index){
               
                return;
            }
            this.chargeR.postData.buyer_payment_type = index;
            if (index !== 4 && index !== 5) {
                this.chargePost();
            }
            else {
                setTimeout(function () {
                    that.$refs.chargeInput.focus();
                }, 100)
            }
        },
        chargePost() {
            var that=this;
            console.log(this.chargeR.postData, 'postdata')
            this.maskData.showMasking=true;
            this.maskData.toastMessage='正在支付请稍后...'
            $.ajax({
                type: "POST",
                data: this.chargeR.postData,
                url: "/api/member/shop_buyer_balance_recharge.vm",
                dataType: "json",
                success: function (d) {
                    console.log(d, '充值数据')
                    that.maskData.toastMessage="充值成功"
                    setTimeout(function () {
                        that.maskData.showMasking=false;
                        that.maskData.toastMessage=''
                        that.closeChargeDg();
                    }, 1300)
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('操作失败，状态码:' + XMLHttpRequest.status)
                }
            });
            // gPost('/api/member/shop_buyer_balance_recharge.vm',this.chargeR.postData).then(d => {
            //     this.maskData.showMasking=false;
            //     this.maskData.toastMessage=''
            // }).catch(function (error) {
            //     this.maskData.showMasking=false;
            //     this.maskData.toastMessage=''
            // });
           
           
            
        },
        // 选择折扣
        selectDiscount: function (index) {
            this.setDiscount = this.getDiscountList[index].discount;
            this.isShowDiscount = false;
        },
        //折扣框输入
        showDiscount: function () {
            //console.log(this.getDiscountList)
            this.isShowDiscount = true;
            this.smalllKeyboard = false;
        },
        //桌号 人数
        disCountInput: function (index) {
            this.disCountIndex = index;
            this.smalllKeyboard = true;
            this.isShowDiscount = false;
            this.discountList[index].nameValue = '';
        },
        smalllKeyboardSelect: function (index) {
            var num = this.smallKeyBoardList[index];
            var tempStr = this.discountList[this.disCountIndex].nameValue;
            if (num >= 0 || num == "." || num == "A" || num == "B" || num == "C" || num == "D") {
                tempStr += String(num);
                this.discountList[this.disCountIndex].nameValue = tempStr;
            } else if (num.indexOf("img") > -1) {
                tempStr = String(tempStr).substring(0, tempStr.length - 1);
                this.discountList[this.disCountIndex].nameValue = tempStr;
            } else {
                this.smalllKeyboard = false;
            }
        },
        // 确认选择的口味
        tasteMakeSure: function () {
            if (this.packProductIndex || this.packProductIndex == 0) {
                //packProductIndex
                this.shopProductList[this.shopProductIndex].site_product_accessory[this.packProductIndex].remark = this.tasteSelectArr.join();
            } else {
                this.shopProductList[this.shopProductIndex].remark = this.tasteSelectArr.join();
            }
            this.tasteSelectArr = [];
            this.tasteSelectStr = '';
            this.hideMask()
        },
        //选择口味
        selectTaste: function (index) {
            if (this.tasteSelectStr.indexOf(index + '|') < 0) {
                this.tasteSelectStr = this.tasteSelectStr + index + "|";
                this.tasteSelectArr.push(this.tasteList[index])
            } else {
                this.tasteSelectStr = this.tasteSelectStr.replace(index + '|', "");
                var temNa = this.tasteList[index];
                this.tasteSelectArr = removeArrElement(this.tasteSelectArr, temNa)
                //      删除已知元素
                function removeArrElement(arr, bArr) {
                    var newArr = [];
                    for (var m = 0; m < arr.length; m++) {
                        if (arr[m] == bArr) {
                            continue;
                        } else {
                            newArr.push(arr[m]);
                        }
                    }
                    return newArr
                }
            }
        },
        // 点击标题弹出口味选择
        selectProductTaste: function (tap1index, tap2index) {
            if (this.isCanShowTaste) {
                this.shopProductIndex = tap1index;
                var tempName;
                if (tap2index || tap2index == 0) {
                    this.packProductIndex = tap2index;
                    var tempName = this.shopProductList[tap1index].site_product_accessory[tap2index].accessory_name;
                    this.searchFoodTasteName(tempName);
                } else {
                    var tempName = this.shopProductList[tap1index].product_name;
                    this.searchFoodTasteName(tempName);
                }
            }
        },
        //关闭遮罩
        hideMask: function () {
            this.isShow = false;
            this.isTasteShow = false;
        },
        //选择产品口味
        searchFoodTasteName: function (tempName) {
            for (var i = 0; i < this.getProductTaste.length; i++) {
                if (this.getProductTaste[i].food == tempName) {
                    this.tasteList = this.getProductTaste[i].taste.split(",");
                    this.isTasteShow = true;
                    this.isShow = true;
                }
            }
            for (var m = 0; m < this.getProductTypeTaste.length; m++) {
                if (this.getProductTypeTaste[m].food == tempName) {
                    this.tasteList = this.getProductTypeTaste[m].taste.split(",");
                    this.isTasteShow = true;
                    this.isShow = true;
                }
            }
        },
        //优惠券
        selectCoupons: function (index) {
            var use_condition = this.userTicketData[index].use_condition;
            if (this.totalPrice(1) >= use_condition) {
                this.tickIndex = index;
                if (this.userTicketData[index].discount_value > 0) {
                    //  this.scorePrice = Number(this.userTicketData[index].discount_value);
                }
                var typeid = this.userTicketData[index].pay_type;
                var type_name = this.userTicketData[index].ticket_name;
                var ticketNo = this.userTicketData[index].ticket_code;
                var price = this.userTicketData[index].discount_value;
                var modifyData = cashierSystemContainer.PayWayList;
                if (cashierSystemContainer.scorePriceStr2.indexOf(index + '|') == -1) {
                    if (this.zero() == 0) {
                        this.isShowToastFn("找零已为0，请先取消其他支付方式");
                        return false;
                    }
                    for (var i = 0; i < modifyData.length; i++) {
                        if (modifyData[i].index2 != "-1") {
                            cashierSystemContainer.scorePriceStr2 = cashierSystemContainer.scorePriceStr2.replace(modifyData[i].index2 + '|', "");
                            modifyData.splice(i, 1);
                        }
                    }
                    var OneData = {};
                    OneData.typeid = typeid;
                    OneData.type_name = type_name;
                    OneData.ticketNo = ticketNo;
                    OneData.index = "-1";
                    OneData.index2 = index;
                    OneData.price = price;
                    modifyData.push(OneData);
                    cashierSystemContainer.scorePriceStr2 = cashierSystemContainer.scorePriceStr2 + index + '|';
                }
                else {
                    for (var i = 0; i < modifyData.length; i++) {
                        if (modifyData[i].index2 == index) {
                            modifyData.splice(i, 1);
                        }
                    }
                    cashierSystemContainer.scorePriceStr2 = cashierSystemContainer.scorePriceStr2.replace(index + '|', "");
                }
            }
            else {
                this.isShowToastFn("需最低消费 " + use_condition);
                return false;
            }
        },
        getMemberMsgFn: function (cardno) {
            if (cardno) {
                //  会员卡号查询接口
                axios.post('/api/member/site_buyer_ticket_balance_list.vm', {
                    cardno: cardno,//会员卡号
                }).then(function (res) {
                    if (res.data.code == "success") {
                        cashierSystemContainer.userTicketData = [];
                        cashierSystemContainer.userScoresData = [];
                        cashierSystemContainer.memberMsgList = res.data.userData[0];//会员基础信息
                        if (res.data.userTicketData.length > 0) {
                            cashierSystemContainer.userTicketData = res.data.userTicketData;//会员优惠券信息
                        }
                        if (res.data.userScoresData.length > 0) {
                            cashierSystemContainer.userScoresData = res.data.userScoresData[0];//用户余额信息
                            var price = 0 - Number(cashierSystemContainer.zero()); //应付
                            var modifyData = cashierSystemContainer.PayWayList;
                            for (var i = 0; i < modifyData.length; i++) {
                                if (modifyData[i].typeid == -1) {
                                    if (cashierSystemContainer.userScoresData.balance < price) {
                                        modifyData[i].price = cashierSystemContainer.userScoresData.balance;
                                    }
                                    else {
                                        modifyData[i].price = price;
                                    }
                                }
                            }
                        }
                    } else {
                        cashierSystemContainer.memberMsgList = [];//会员基础信息
                        cashierSystemContainer.userTicketData = [];//会员优惠券信息
                        cashierSystemContainer.userScoresData = [];//用户余额信息
                        console.log(res.data.msg);
                    }
                })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        //当选择堂食时 支付方式中有支付宝微信是 扫码框自动获得焦点
        payMoney: function () {
            //点击堂食 扫码框获取焦点
            var sweepNum = document.getElementById("sweepNum");
            // sweepNum.focus();
            if (this.zero() < 0) {
                this.isShowToastFn("找零必须大于或等于0");
                return false;
            }
            var modifyData = cashierSystemContainer.PayWayList;
            for (var i = 0; i < modifyData.length; i++) {
                if (modifyData[i].typeid == "-1") {
                    if (typeof (this.userScoresData.balance) == "undefined") {
                        this.isShowToastFn("请搜索会员后使用余额支付");
                        return false;
                    }
                    else {
                        if (modifyData[i].price > Number(this.userScoresData.balance)) {
                            this.isShowToastFn("余额支付的金额不能大于会员余额");
                            return false;
                        }
                    }
                }
            }
            var tempArr = this.PayWayList;
            var lock = 0;
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].typeid == "-2" || tempArr[i].typeid == "-3") {
                    lock++;
                }
            }
            if (lock > 0) {
                sweepNum.focus();
            }
            else {
                this.payMoneyCheckOut();
            }
        },
        selectfood: function (allIndex, foodIndex, type) {
            //      套餐
            if (type == 2) {
                var pack = cashierSystemContainer.packProductList;
                var packid = this.packAllProductList[allIndex].packid;
                var min_quantity = this.packAllProductList[allIndex].min_quantity;
                var max_quantity = this.packAllProductList[allIndex].max_quantity;
                var title = this.packAllProductList[allIndex].title;//套餐名称
                var is_multiple = this.packAllProductList[allIndex].is_multiple;// 选项类型 0:停用 1：必选配制 2：可选配制
                var temNum = 0;
                for (var h = 0; h < pack.length; h++) {
                    if (packid == pack[h].packid) {
                        temNum++;
                    }
                }
                if (is_multiple == 0) {
                    this.isShowToastFn(title + " 的配餐已被停用");
                    return false;
                }
                if (temNum > max_quantity) {
                    this.isShowToastFn(title + " 的配餐项不能大于 " + max_quantity);
                    return false;
                }
                if (temNum < min_quantity && is_multiple == 1) {
                    this.isShowToastFn(title + " 的配餐项不能小于 " + min_quantity);
                    return false;
                }
                var packData = cashierSystemContainer.packAllProductList[allIndex].site_product_accessory[foodIndex];
                var id = packData.accessoryid;
                //        去重
                var lock = 0;
                for (var i = 0; i < cashierSystemContainer.packProductList.length; i++) {
                    var accessoryid = cashierSystemContainer.packProductList[i].accessoryid;//配餐ID
                    if (accessoryid == id) {
                        var num = cashierSystemContainer.packProductList[i].num + 1;//已选数量数量 
                        var max_quantity2 = cashierSystemContainer.packProductList[i].max_quantity;//配餐可选最大数量
                        var title2 = cashierSystemContainer.packProductList[i].accessory_name;//配餐名称
                        if (num > max_quantity2 && max_quantity2 != "")//如果大于限制数量  
                        {
                            this.isShowToastFn(title2 + " 数量不能大于 " + max_quantity2);
                            return false;
                        }
                    }
                    if (cashierSystemContainer.packProductList[i].accessoryid == packData.accessoryid) {
                        lock++;
                    }
                };
                if (lock == 0) {
                    cashierSystemContainer.packProductList.push(packData);
                }
                cashierSystemContainer.packAllProductList[allIndex].site_product_accessory[foodIndex].num++; //点产品加数量
            }
            //          单品
            if (type == 1) {
                var isPackage = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].site_product_pack.length;
                cashierSystemContainer.packName = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].product_name;
                cashierSystemContainer.site_product_pack_productid = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].productid;
                cashierSystemContainer.packPrice = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].price;
                if (isPackage > 0) {
                    //      套餐
                    this.p1Show = false;
                    this.p1ShowChild = true;
                    this.p2Show = true;
                    cashierSystemContainer.packAllProductList = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].site_product_pack;
                } else {
                    var foodData = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex];
                    //        单品
                    cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].num++; //点产品加数量
                    var count = 0;
                    for (var i = 0; i < cashierSystemContainer.shopProductList.length; i++) {
                        if (cashierSystemContainer.shopProductList[i].productid == foodData.productid) {
                            count++;
                        }
                    };
                    if (count == 0) {
                        cashierSystemContainer.shopProductList.push(foodData);
                    }
                }
            };
        },
        foodSwitch: function (index) {
            this.pageNum = index;
        },
        add: function (index, type) {
            if (type == 1) {
                if (this.shopProductList[index].num < 100) {
                    this.shopProductList[index].num++;
                };
            };
            if (type == 2) {
                if (this.packProductList[index].num < 100) {
                    var num = this.packProductList[index].num + 1;//已选数量数量 
                    var max_quantity2 = this.packProductList[index].max_quantity;//配餐可选最大数量
                    var title2 = this.packProductList[index].accessory_name;//配餐名称
                    if (num > max_quantity2 && max_quantity2 != "")//如果大于限制数量  
                    {
                        this.isShowToastFn(title2 + " 数量不能大于 " + max_quantity2);
                        return false;
                    }
                    this.packProductList[index].num++;
                };
            };
        },
        minus: function (index, type) {
            if (type == 1) {
                if (this.shopProductList[index].num > 0) {
                    this.shopProductList[index].num--;
                };
                if (this.shopProductList[index].num == 0) {
                    setTimeout(function () {
                        cashierSystemContainer.shopProductList.splice(index, 1)
                    }, 100)
                }
            };
            if (type == 2) {
                if (this.packProductList[index].num > 0) {
                    this.packProductList[index].num--;
                };
                if (this.packProductList[index].num == 0) {
                    setTimeout(function () {
                        cashierSystemContainer.packProductList.splice(index, 1)
                    }, 100)
                }
            };
        },
        totalNumber: function () {
            var totalNum = 0;
            for (var i = 0; i < this.shopProductList.length; i++) {
                totalNum += this.shopProductList[i].num;
            };
            return totalNum;
        },
        totalPrice: function (type) {
            //套餐总价
            if (type == 2) {
                var totalPriceNum = 0;
                for (var j = 0; j < this.packProductList.length; j++) {
                    totalPriceNum += this.packProductList[j].price * this.packProductList[j].num;
                };
                //      console.log(totalPriceNum)
                this.totalPackPrice = totalPriceNum;
                return totalPriceNum;
            };
            if (type == 1) {
                //单品总价
                var totalPriceNum = 0;
                for (var j = 0; j < this.shopProductList.length; j++) {
                    totalPriceNum += this.shopProductList[j].price * this.shopProductList[j].num;
                };
                //      console.log(totalPriceNum)
                return totalPriceNum;
            };
        },
        clearSelected: function (type) {
            //      清空套餐
            if (type == 1) {
                //        alert(1)
                for (var i = 0; i < this.shopProductList.length; i++) {
                    this.shopProductList[i].num = 0;
                };
                this.shopProductList = []; //单品点餐
            };
            //      清空选择的单品
            if (type == 2) {
                for (var i = 0; i < this.packProductList.length; i++) {
                    this.packProductList[i].num = 0;
                };
                this.packProductList = []; //套
            };
        },
        //找零
        zero: function () {
            var amount = 0;
            var modifyData = this.PayWayList;
            for (var i = 0; i < modifyData.length; i++) {
                // if(modifyData[i].typeid < 0 )  //优惠方式除外
                // {
                amount += Number(modifyData[i].price);
                //  }
            }
            amount -= Number(this.finalPrice());
            return amount + cashierSystemContainer.discount_value;
        },
        //优惠    //点优惠券加优惠
        promotionPrice: function () {
            var amount = 0;
            var selectData = this.shopProductList;//已选产品列表
            var discount = this.setDiscount; //选择折扣
            if (discount == "") {
                discount = 10;
            }
            for (var i = 0; i < selectData.length; i++) {
                if (selectData[i].discount_way == 0) //0：参与折扣 1：不参与折扣
                {
                    amount += Number(selectData[i].price) * Number(10 - discount) * 0.1;//累计折扣金额
                }
            }
            return amount;
        },
        //实收
        finalPrice: function () {
            var finalNum = 0;
            for (var n = 0; n < this.shopProductList.length; n++) {
                finalNum += Number(this.shopProductList[n].price) * Number(this.shopProductList[n].num);
            };
            finalNum = Number(finalNum) - Number(this.promotionPrice());//实收=总价-优惠
            return finalNum;
        },
        //    确认套餐
        packMakeSure: function () {
            if (this.packProductList.length > 0) {
                var isTrue = [];
                // packAllProductList
                var pack = cashierSystemContainer.packProductList;
                for (var i = 0; i < this.packAllProductList.length; i++) {
                    var packid = this.packAllProductList[i].packid;
                    var min_quantity = this.packAllProductList[i].min_quantity;
                    var max_quantity = this.packAllProductList[i].max_quantity;
                    var title = this.packAllProductList[i].title;//套餐名称
                    var is_multiple = this.packAllProductList[i].is_multiple;// 选项类型 0:停用 1：必选配制 2：可选配制
                    console.log(this.packAllProductList)
                    console.log(this.packProductList)
                    var temNum = 0;
                    for (var h = 0; h < pack.length; h++) {
                        if (packid == pack[h].packid) {
                            temNum++;
                        }
                    }
                    for (var j = 0; j < this.packAllProductList[i].site_product_accessory.length; j++) {
                        var num = this.packAllProductList[i].site_product_accessory[j].num;//已选数量数量 
                        var max_quantity2 = this.packAllProductList[i].site_product_accessory[j].max_quantity;//配餐可选最大数量
                        var title2 = this.packAllProductList[i].site_product_accessory[j].accessory_name;//配餐名称
                        console.log(title2 + num)
                        console.log(title2 + max_quantity2)
                        if (num > max_quantity2 && max_quantity2 != "")//如果大于限制数量  
                        {
                            this.isShowToastFn(title2 + " 数量不能大于 " + max_quantity2);
                            return false;
                        }
                    }
                    if (is_multiple == 0) {
                        this.isShowToastFn(title + " 的配餐已被停用");
                        return false;
                    }
                    if (temNum > max_quantity) {
                        this.isShowToastFn(title + " 的配餐项不能大于 " + max_quantity);
                        return false;
                    }
                    if (temNum < min_quantity && is_multiple == 1) {
                        this.isShowToastFn(title + " 的配餐项不能小于 " + min_quantity);
                        return false;
                    }
                };
                console.log(isTrue);
                //toast
                //  this.isShowToastFn("请选择合理的套餐"); 
                //--------------------------------------
                var count = 0;
                for (var i = 0; i < this.shopProductList.length; i++) {
                    if (this.shopProductList[i].productid == this.site_product_pack_productid) {
                        count++;
                    }
                };
                if (count == 0) {
                    //          ------------------------      
                    this.shopProductList.push({
                        product_name: this.packName,
                        price: Number(this.totalPackPrice) + Number(this.packPrice),
                        productid: this.site_product_pack_productid,
                        num: 1,
                        site_product_accessory: this.packProductList
                    });
                    this.clearSelected(2)
                }
                this.p1Show = true;
                this.p1ShowChild = true;
                this.p2Show = false;
                this.clearSelected(2);
            }
            else {
                this.isShowToastFn("请选择合理的套餐");
            }
        },
        //收银
        Cashier: function () {
            this.p1Show = true;
            this.p1ShowChild = true;
            this.p2Show = false;
        },
        //    结算
        finalCheckOut: function () {
            this.isCanShowTaste = false;
            if (this.totalNumber() > 0) {
                this.p1Show = true;
                this.p1ShowChild = false;
                this.p2Show = false;
            } else {
                this.isShowToastFn("请选择一个单品或套餐");
            }
            console.log(JSON.stringify(cashierSystemContainer.shopProductList))
        },
        //删除行
        selectPay: function (index) {
            var modifyData = cashierSystemContainer.PayWayList;
            var i = modifyData[index].index;
            var i2 = modifyData[index].index2;
            if (i != "-1") {
                cashierSystemContainer.scorePriceStr1 = cashierSystemContainer.scorePriceStr1.replace(i + '|', "");//删除所选支付方式
            }
            if (i2 != "-1") {
                cashierSystemContainer.scorePriceStr2 = cashierSystemContainer.scorePriceStr2.replace(i2 + '|', "");//删除所选支付方式
            }
            modifyData.splice(index, 1); //删除当前行
        },
        //选择支付方式
        selectPayWay: function (index) {
            var typeid = this.getPayWayList[index].typeid;
            var type_name = this.getPayWayList[index].type_name;
            var finance_type = this.getPayWayList[index].finance_type;//营业类型 0：计入营业额 1：计入优惠
            var default_fee = this.getPayWayList[index].default_fee;//默认值
            var logic_type = this.getPayWayList[index].logic_type;//逻辑值 0不需要验证编号，1需要验证编号
            var pay_type_code = this.getPayWayList[index].pay_type_code;//编码
            var third_party_code = this.getPayWayList[index].third_party_code;//第三方编码
            var ap_fee = this.getPayWayList[index].ap_fee;//应付款
            var min_pay = this.getPayWayList[index].min_pay;//最低消费
            var modifyData = cashierSystemContainer.PayWayList;
            if (cashierSystemContainer.scorePriceStr1.indexOf(index + '|') == -1) {
                if (this.zero() == 0) {
                    this.isShowToastFn("找零已为0，请先取消其他支付方式");
                    return false;
                }
                var OneData = {};
                OneData.typeid = typeid;
                OneData.type_name = type_name;
                OneData.finance_type = "";
                OneData.index = index;
                OneData.index2 = "-1";
                OneData.price = 0;
                OneData.ticketNo = "";
                var price = 0 - Number(this.zero()); //应付 
                OneData.price = price;
                if (typeid > 0) {
                    if (min_pay > this.totalPrice(1)) {
                        this.isShowToastFn("需最低消费 " + min_pay);
                        return false;
                    }
                    if (default_fee == "" || default_fee == 0) {
                        this.isShowToastFn("金额为空或为零");
                        return false;
                    }
                    OneData.finance_type = finance_type;
                    OneData.price = default_fee;
                }
                if (typeid == -1) {
                    var memberCardNo = document.getElementById('memberCardNo');
                    memberCardNo.focus();
                    if (typeof (this.userScoresData.balance) == "undefined") {
                        OneData.price = 0;
                    }
                    else {
                        if (this.userScoresData.balance < price) {
                            OneData.price = this.userScoresData.balance;
                        }
                    }
                }
                else if (typeid == -2) {
                    // OneData.price = 100; //默认100
                }
                else if (typeid == -3) {
                    //  OneData.price = 100; //默认100
                }
                else if (typeid == -4) {
                }
                modifyData.push(OneData);
                cashierSystemContainer.scorePriceStr1 = cashierSystemContainer.scorePriceStr1 + index + '|';
            }
            else {
                for (var i = 0; i < modifyData.length; i++) {
                    if (modifyData[i].index == index) {
                        modifyData.splice(i, 1);
                    }
                }
                cashierSystemContainer.scorePriceStr1 = cashierSystemContainer.scorePriceStr1.replace(index + '|', "");
                // alert("移除"+cashierSystemContainer.scorePriceStr1);
            }
            console.log(JSON.stringify(cashierSystemContainer.PayWayList))
            this.payWayIndex = index;
            console.log(typeid);
        },
        //    选择充值面额
        //    selectMoney: function(index) {
        //      this.payMoneyIndex = index;
        //      var money = this.payMoneyList[index];
        //      console.log(money)
        //    }
        //  数字键盘
        selectNums: function (index) {
            var num = this.keyBoardNumList[index];
            console.log(num);
            var tempStr = this.PayWayList[this.tempInputIndex].price;
            if (num >= 0 || num == ".") {
                tempStr += String(num);
                this.PayWayList[this.tempInputIndex].price = tempStr;
            } else if (num.indexOf("img") > -1) {
                console.log(num.indexOf("img"));
                tempStr = String(tempStr).substring(0, tempStr.length - 1);
                this.PayWayList[this.tempInputIndex].price = tempStr;
            } else {
            }
        },
        openAnAccount: function () {
            var mobile = this.memberMsgList.mobile;
            var cardno = this.memberCardNo;
            var user_name = this.memberMsgList.user_name;
            var data = {
                user_name: user_name,
                policyid: "",
                market_policyid: '',
                account_status: '',
                last_msg_date: '',
                msg_times: '',
                buyer_type: 0,
                site_buyer_type: '',
                login_times: '',
                barcode: '',
                level: 1,
                wx_openid: '',
                password: '',
                mobile: mobile,
                cardno: cardno,
                referee: '',
                alipay_openid: ''
            };
            console.log(JSON.stringify(data));
            axios.post('/api/member/site_buyer_create.vm', data).then(function (res) {
                console.log(res.data)
                if (res.data.code == "success") {
                    alert(res.data.msg);
                    return false;
                } else {
                    console.log(res.data.msg);
                    alert(res.data.msg);
                    return false;
                }
            })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //    选择堂食时结算支付
        payMoneyCheckOut: function () {
            if (this.zero() < 0) {
                this.isShowToastFn("找零必须大于或等于0");
                return false;
            }
            var modifyData = cashierSystemContainer.PayWayList;
            for (var i = 0; i < modifyData.length; i++) {
                if (modifyData[i].typeid == "-1") {
                    if (typeof (cashierSystemContainer.userScoresData.balance) == "undefined") {
                        this.isShowToastFn("请搜索会员后使用余额支付");
                        return false;
                    }
                    else {
                        if (modifyData[i].price > Number(cashierSystemContainer.userScoresData.balance)) {
                            this.isShowToastFn("余额支付的金额不能大于会员余额");
                            return false;
                        }
                    }
                }
            }
            var orderProduct = [];
            var tempOrderProduct = cashierSystemContainer.shopProductList;
            console.log(tempOrderProduct)
            var tempProductName = '';
            for (var i = 0; i < tempOrderProduct.length; i++) {
                //   console.log(tempOrderProduct[i].site_product_accessory.length);
                if (tempOrderProduct[i].site_product_accessory) {
                    tempProductName = tempOrderProduct[i].product_name + "+";
                    for (var m = 0; m < tempOrderProduct[i].site_product_accessory.length; m++) {
                        tempProductName += tempOrderProduct[i].site_product_accessory[m].accessory_name + " ";
                    };
                    orderProduct.push({
                        'buyerName': 'this.memberMsgList.user_name',
                        //'createTime': '',
                        'productid': tempOrderProduct[i].site_product_accessory[0].productid,
                        'price': tempOrderProduct[i].price,
                        'productCount': tempOrderProduct[i].num,
                        'productStatus': "confirmed",
                        'productName': tempProductName
                    });
                } else {
                    orderProduct.push({
                        'buyerName': 'this.memberMsgList.user_name',
                        //'createTime': '',
                        'productid': tempOrderProduct[i].productid,
                        'price': tempOrderProduct[i].price,
                        'productCount': tempOrderProduct[i].num,
                        'productStatus': "confirmed",
                        'productName': tempOrderProduct[i].product_name
                    });
                }
            }
            var payList = [];
            var modifyData = cashierSystemContainer.PayWayList;
            for (var i = 0; i < modifyData.length; i++) {
                if (modifyData[i].price > 0)//如果金额大于0
                {
                    var oneData = {};
                    oneData.ticketNo = modifyData[i].ticketNo;
                    oneData.payType = modifyData[i].typeid;
                    oneData.payAmount = modifyData[i].price;
                    payList.push(oneData);
                }
            }
            var payData = {
                //"arrivalTime": "",
                "auth_code": $("#sweepNum").val(),
                "barcode": this.memberMsgList.barcode,
                "buyer": this.memberMsgList.userid,
                "buyerName": this.memberMsgList.user_name,
                "buyerRemark": "",
                "createTime": this.getNowTime(),
                "deliveryBuilding": "",
                "deliveryDetailPlace": "",
                "displayScore": "0.0",
                "groupid": 0,
                "ip": "",
                "lockStatus": "",
                "mobile": this.memberMsgList.mobile,
                "operator": user_Name,
                "payWay": "comp",
                "orderWay": "self_canteen",
                "shopOrderid": "self_canteen",
                "persons": "1",
                "phone": this.memberMsgList.mobile,
                "points": 0,
                "receive": 0,
                "serviceFee": "0",
                "serviceQuality": null,
                "shopid": shop_id,
                "shopName": shop_Name,
                //"siteid": "49071",
                "smsConfirmation": false,
                "takenoid": 0,
                "terminalDevice": "mobile",
                "ticketNo": "",
                "totalFee": this.finalPrice(),
                "discount": 0,
                "score": 0,
                "orderStatus": "ORDER_COMPLETED",
                "orderProduct": orderProduct,
                "payList": payList
            };
            console.log(JSON.stringify(payData));
            //      下单接口
            axios.post('/api/order/create_order.vm', payData).then(function (res) {
                if (res.data.code == "success") {
                    console.log(JSON.stringify(res.data));
                    printFormat(res.data.print);
                    //          清空单品数据
                    for (var i = 0; i < cashierSystemContainer.shopProductList.length; i++) {
                        cashierSystemContainer.shopProductList[i].num = 0;
                    };
                    cashierSystemContainer.shopProductList = [];
                    //清空套餐数据
                    for (var i = 0; i < cashierSystemContainer.packProductList.length; i++) {
                        cashierSystemContainer.packProductList[i].num = 0;
                    };
                    cashierSystemContainer.packProductList = [];
                    cashierSystemContainer.memberMsgList = [];
                    cashierSystemContainer.userTicketData = [];  //会员优惠券信息
                    cashierSystemContainer.userScoresData = [];// 会员余额信息
                    $("#sweepNum").val("");
                    cashierSystemContainer.getPayWayList = [];
                    cashierSystemContainer.PayWayList = [];
                    cashierSystemContainer.scorePriceStr1 = '';//支付方式优惠金额
                    cashierSystemContainer.scorePriceStr2 = '';//优惠券优惠金额
                    //返回主页
                    cashierSystemContainer.p1Show = true;
                    cashierSystemContainer.p1ShowChild = true;
                    cashierSystemContainer.p2Show = false;
                } else {
                    this.isShowToastFn(res.data.msg);
                    return false;
                }
            })
                .catch(function (error) {
                    console.log(error);
                });
        },
        returnFn: function () {
            this.p1Show = true;
            this.p1ShowChild = true;
            this.p2Show = false;
        },
        isShowToastFn: function (content) {
            cashierSystemContainer.isShowToast = true, //toast设置
                cashierSystemContainer.toastContent = content;
            setTimeout(function () {
                cashierSystemContainer.isShowToast = false;
            }, 2000)
        },
        getInputVal: function (index) {
            this.tempInputIndex = index;
        },
        getNowTime: function () {
            //获取创建时间
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            month = checkTime(month);
            day = checkTime(day);
            hour = checkTime(hour);
            minute = checkTime(minute);
            second = checkTime(second);
            var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            return time;
            function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
        },
        getArriveTime: function () {
            //获取到达时间
            // 当前时间毫秒数
            var myData = new Date();
            var times = myData.getTime(); //当前时间的毫秒数
            // 达到时间毫秒数
            var millisecond = times + 2400000; //40min
            Date.prototype.toLocaleString = function () {
                var month = checkTime((this.getMonth() + 1));
                var day = checkTime(this.getDate());
                var hour = checkTime(this.getHours());
                var minute = checkTime(this.getMinutes());
                var second = checkTime(this.getSeconds());
                return this.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
            };
            var rightTime = new Date(millisecond);
            localTime = rightTime.toLocaleString();
            return localTime;
            function checkTime(i) { //将0-9的数字前面加上0，例1变为01 
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
        }
    }
});
