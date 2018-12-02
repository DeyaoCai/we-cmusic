
  const cmusic = require("../../../http/http.js");
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
      songList: null,
    },
    methods: {
      setSrc(ev){
        this.data.setSrc(ev);
      },
      setList (songList) {
        this.setData({
          songList: this.getSongDto(songList),
        })
      },
      getSongDto (list) {
        return list.map(item => ({
          name: this.getName(item),
          src: this.getSrc(item),
          artists: this.getArtists(item),
          reason: this.getReason(item),
          id: item.id,
        }))
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
    }
  })

