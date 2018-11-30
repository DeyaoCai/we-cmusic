Component({
  options: {
    multipleSlots: true
  },
  properties: {
    config: {
      type: Object,
      value: {},
    }
  },
  attached(){},
  data: {
    active: false, 
    sShow: false, 
    show: false,
    full: "full",
    derction: 'bottom',
    popClass: 'vuc-popup bottom',
  },
  methods: {
    getClass(active, sShow){
      const arr = ["vuc-popup", this.data.derction];
      active && arr.push("active");
      sShow && arr.push("show");
      return arr.join(" ");
    },
    showPop() {
      const { data } = this;
      this.setData({ 
        sShow: true,
        popClass: this.getClass(data.active, true) 
      });
      setTimeout(() => this.setData({
        active: true,
        popClass: this.getClass(true, true) 
      }), 20) 
    },
    sHidePop() {
      const { data } = this;
      data.config.stop || this.setData({
        active: false,
        popClass: this.getClass(false, data.sShow)
      });
    },
    hidePop() {
      const { data } = this;
      this.setData({
        active: false,
        popClass: this.getClass(false, data.sShow)
      });
    },
    transitionEnd() {
      console.log(146)
      const { data } = this;
      this.setData({
        sShow: data.active,
        show: data.active,
        popClass: this.getClass(data.active, data.active)
      });
    }
  }
})