Vue.component("pagePeak", {
    template: `
       <ul class="pagination" >
            <li v-show="current != 1" @click="current-- && goto(current--)" ><a href="#">上一页</a></li>
            <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
              <a  >{{index}}</a>
            </li>
            <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a  >下一页</a></li>
        </ul>
        `,
    data: function () {
        return {
            current: 1,
            allpage: this.totalPage,
        }
    },
    props: {
        totalPage: {
            type: Number,
            default: 1
        },
        postdata: {
            type: Object,
            default: null
        },
        posturl: {
            type: String,
            default: ''
        },
        showitem: {
            type: Number,
            default: 10
        },
        pageCount: {
            type: Number,
            default: 5
        }
    },
    computed: {
        pages: function () {
            var pag = [];
            if (this.current < this.showitem) {
                var i = Math.min(this.showitem, this.allpage);
                while (i) {
                    pag.unshift(i--);
                }
            } else {
                var middle = this.current - Math.floor(this.showitem / 2),
                    i = this.showitem;
                if (middle > (this.allpage - this.showitem)) {
                    middle = (this.allpage - this.showitem) + 1
                }
                while (i--) {
                    pag.push(middle++);
                }
            }
            return pag
        }
    },
    mounted: function () {
        this.getAjaxData()
    },
    methods: {
        goto: function (index) {
            if (index == this.current) return;
            this.current = index;
            this.postdata.thisPage = this.current;
            this.getAjaxData();
        },
        getAjaxData: function () {
            var that = this;
            
            $.ajax({
                type: "POST",
                url: this.posturl,
                data: this.postdata,
                dataType: "json",
                success: function (d) {
                    d.totalPage ? that.allpage = d.totalPage : that.allpage = 0;
                    that.$emit('navpage', d);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status, 'error')
                }
            });
        }
    }
})