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
    newSongList: [],
    page1Scrollconf: { derction: 'y', },
    page2Scrollconf: { derction: 'y', },
    popConf: {}
  },
  methods: {
    recommendSongs() {
      cmusic.recommendSongs()(res => {
          const _t = this.selectComponent(".comp-songList");
          _t.setList(res.data.recommend);
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
