
    const cmusic = require("../../../http/http.js");
    Component({
        options: {
            multipleSlots: true
        },
        properties: {},
        data: {
            scrollConf: {
                derction: 'x',
                itemNum: {x:2, y:1},
                index: {x: 1, y:0},
                takeOneStepAtATime: true,
            },
            page1Scrollconf: { derction: 'y', },
            page2Scrollconf: { derction: 'y', },
            popConf: {stop: true},

        },
        methods: {
            showSongList(ev){
                const conf = ev.currentTarget.dataset.conf;
                cmusic.playlistDetail({id: conf.id})(res => {
                    const tracks = res.data.playlist.tracks;
                    const _t = this.selectComponent(".comp-recommend-songList");
                    _t.setList(tracks);
                    const _pop = this.selectComponent(".pop-conf");
                    _pop.showPop(_pop);

                })
            },
            showSheetPop(){
                const _pop = this.selectComponent(".pop-conf-sheet");
                _pop.showPop(_pop);
            },
            hideSheetPop(){
                const _pop = this.selectComponent(".pop-conf-sheet");
                _pop.hidePop(_pop);
            },
            showRecPop(){
                const _pop = this.selectComponent(".pop-conf");
                _pop.showPop(_pop);
            },
            hideRecPop(){
                const _pop = this.selectComponent(".pop-conf");
                _pop.hidePop(_pop);
            },
            topPlaylist(){
                cmusic.topPlaylist()(res => {
                    const _pop = this.selectComponent(".comp-sheetList");
                    _pop.setList(res.data.playlists);
                    this.showSheetPop();
                })
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
            showPage(){
                const _t = this;
                wx.getStorage({
                    key: "wxcmusicuserinfo",
                    success(res) {
                        const account = res.data.account;
                        cmusic.userPlaylist({uid: account.id})(res => {
                            const _pop = _t.selectComponent(".comp-sheetList");
                            _pop.setList(res.data.playlist);
                        });
                    },
                    fail(err){console.log(err)},
                });
            },
        },
        attached: function (options) {
            this.showPage();
            this.setData({showSongList:ev => this.showSongList(ev)});
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
