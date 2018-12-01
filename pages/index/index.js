const cmusic = require("../../http/http.js");
const audio = wx.createInnerAudioContext();
audio.autoplay = true;
audio.loop = true;

console.log(cmusic)
Page({
  data: {
    audio,
    scrollConf: {
      derction: 'x',
      itemNum: {x:2, y:1},
      index: {x: 1, y:0},
      takeOneStepAtATime: true,
    },
    newSongList: [],
    page1Scrollconf: { derction: 'y', },
    page2Scrollconf: { derction: 'y', },
    popConf: {
      // $el: null,
    },
    setSrc(ev){
        const conf = ev.currentTarget.dataset.conf;
        console.log(conf)
        cmusic.songUrl({ id: conf.id })(res => {
            console.log(res)
            audio.src = res.data.data[0].url
        });
    },
  },
  loginCmusic(){
    cmusic.loginCellphone({phone: "16621079485", password: "a13789"})(res=>{
      wx.setStorage({
        key: "wxcmusiccookie",
        data: res.header['Set-Cookie'],
        success(){},
        fail(){console.log("fail")}
      })
    });
  },
  recommendSongs() {
    const { data } = this;
    cmusic.recommendSongs()(res => {
      console.log(res)
      this.setData({
        newSongList: res.data.result.map(item => ({
          name: this.getName(item),
          src: this.getSrc(item),
          artists: this.getArtists(item),
          reason: this.getReason(item),
          id: item.id,
        }))
      })
    })
  },
  personalizedNewsong(){
    const {data} = this;
    // $music.recommendResource()(res => {
    //   // this.sheetList.list = res.recommend;
    // });
    cmusic.personalizedNewsong()(res => {
      this.setData({
        newSongList: res.data.result.map(item=>({
          name: this.getName(item) ,
          src: this.getSrc(item) ,
          artists: this.getArtists(item),
          reason: this.getReason(item),
          id: item.id,
        }))
      })
    })
    // $music.topPlaylistHighquality()(res => {
    //   // this.topSheetList.list = res.playlists;
    // })
  },
  setIndex0(index){
    const _t = this.selectComponent(".tab-scroll");
    _t.setIndex({ x: 0 });
    this.setIndex({ x: 0, y:0 });
  },
  setIndex1(index) {
    const _t = this.selectComponent(".tab-scroll");
    _t.setIndex({ x: 1 });
    this.setIndex({ x: 1, y: 0 });
  },
  updataIndex(ev){
    const _t = this.selectComponent(".tab-scroll");
    // console.log(ev.detail)
    this.setIndex(ev.detail);
  },
  setIndex(index){
    const scrollConf = this.data.scrollConf;
    scrollConf.index.x = index.x;
    scrollConf.index.y = index.y;
    this.setData({scrollConf});
  },
  testShow() {
    const _t = this.selectComponent(".pop-conf");
    _t.showPop(_t);

  },
  getName(item) {
    if (!item) return "";
    return (
      item.name ||
      (item.song && item.song.name)
    );
  },
  getSrc(item) {
    if (!item) return "";
    return (
      (item.song && item.song.al && item.song.al.picUrl) ||
      (item.song && item.song.album && item.song.album.picUrl) ||
      (item.album && item.album.blurPicUrl) ||
      (item.al && item.al.picUrl)
    )
  },
  getArtists(item) {
    if (this.getReason(item)) return (
      (item.song && item.song.artists && item.song.artists.map(key => key.name).join(" | ")) ||
      (item.ar && item.ar.map(item => item.name).join(" | ")) ||
      (item.song && item.song.ar && item.song.ar.map(key => key.name).join(" | ")) ||
      (item.artists && item.artists.map(key => key.name).join(" | "))
    );
    else return "";
  },
  getReason(item) {
    if (!item) return "";
    return (
      item.reason ||
      (item.song && item.song.artists && item.song.artists.map(key => key.name).join(" | ")) ||
      (item.ar && item.ar.map(item => item.name).join(" | ")) ||
      (item.song && item.song.ar && item.song.ar.map(key => key.name).join(" | ")) ||
      (item.artists && item.artists.map(key => key.name).join(" | "))
    );
  },
  onLoad: function (options) {},
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
