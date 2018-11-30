Page({
  data: {
    scrollConf: { 
      derction: 'y',
      itemNum: {x:1, y:1},
    },
    popConf: {
      // $el: null,
    }

  },
  testShow() {
    const _t = this.selectComponent(".pop-conf");
    _t.showPop(_t);
    
  },
  myev(){
    console.log("myev");
  },
  onLoad: function (options) {
    this.data.popConf.setEl = () => {
      this.data.popConf.el = el;
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})