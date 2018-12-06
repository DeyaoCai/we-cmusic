
  const cmusic = require("../../../http/http.js");
  Component({
    options: {
      multipleSlots: true
    },
    properties: {
      showSongList:{
        type: Function,
        value: null,
      },
    },
    data: {
      sheetList: null,
    },
    methods: {
      showSongList(ev){
        this.data.showSongList(ev);
      },
      setList (sheetList) {
        this.setData({
          sheetList: sheetList,
        })
      },
    }
  })

