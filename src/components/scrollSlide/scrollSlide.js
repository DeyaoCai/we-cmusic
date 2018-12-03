
const Drag = require("../../../tools/drag.js");
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
  attached(){
      const {data} = this;
      data.confg || (data.confg = {});
  },
  ready(){
    const {data} = this;
    if (!data.$el || !data.$ele) {
      const query = wx.createSelectorQuery().in(this);
      data.$el || query.select('.vuc-scroll-slide').boundingClientRect(function ($el) {
        data.$el = $el;
      }).exec();
      data.$ele || query.select('.vuc-scroll-slide-btns-wrap').boundingClientRect(function ($ele) {
        data.$ele = $ele;
      }).exec();
    }
    this.cacheWrapSize();
  },
  data: {
    innerStyle: "",
    isActive: "",
    cachedWrapsize: null,
  },
  methods: {
    deActive(){
        const active =!this.data.isActive;
        this.setData({
            isActive: false,
            innerStyle: this.innerStyle(false)
        });
    },
    toggleActive(){
        const active =!this.data.isActive;
        this.setData({
            isActive: active,
            innerStyle: this.innerStyle(active)
        });
    },
    cacheWrapSize() {
      const { data } = this;
      const $el = data.$el;
      const $ele = data.$ele;
      if (!$ele || !$el) {
          return { wrap: { x: 0, y: 0 }, inner: { x: 0, y: 0 } }
      }
      const wrap = { x: $el.width, y: $el.height }
      let ix = $ele.width;
      let iy = $ele.height;
      const inner = { x: ix, y: iy };
      data.cachedWrapsize = { wrap, inner };
      return data.cachedWrapsize;
    },
    getWrapSize() { return this.data.cachedWrapsize || this.cacheWrapSize(); },
    innerStyle(isActive) {
      const size = this.getWrapSize().inner;
      return `
        transform: translate3d(${isActive ? -size.x : 0}px, 0px,0);
      `;
    },
  }
});
