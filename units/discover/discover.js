const cmusic = require("../../http/http.js");
Component({
  options: {
      multipleSlots: true
  },
  properties: {
      setSrc:{
          type: Function,
          value: null,
      },
  },
  data: {
    scrollConf: {
      derction: 'x',
      itemNum: {x:2, y:1},
      index: {x: 1, y:0},
      takeOneStepAtATime: true,
    },
    page1Scrollconf: { derction: 'y', },
    page2Scrollconf: { derction: 'y', },
    popConf: {stop: true}
  },
  methods: {
    showRecPop(){
      const _pop = this.selectComponent(".pop-conf");
      _pop.showPop(_pop);
    },
    hideRecPop(){
      const _pop = this.selectComponent(".pop-conf");
      _pop.hidePop(_pop);
    },
    recommendSongs() {
      cmusic.recommendSongs()(res => {
        const _t = this.selectComponent(".comp-recommend-songList");
        _t.setList(res.data.recommend);
        this.showRecPop();
      })
    },
    personalizedNewsong(){
      cmusic.personalizedNewsong()(res => {
          const _t = this.selectComponent(".comp-songList");
          _t.setList(res.data.result);
      })
    },
  },
  attached: function (options) {
    this.personalizedNewsong();
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
