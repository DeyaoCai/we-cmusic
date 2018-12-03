
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
    innerStyle() {
      const {data} = this;
      const touching = data.drag.isTouching;
      const pos = data.nowPosi;
      const posi = data.posi;
      const config = data.config;

      const offset = Drag.prototype.getOffset.call(data.drag);
      const offsetX = pos.x - posi.x - offset.x;

      let ti = Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(offsetX * data.rate)))));
      ti < .3 && (ti = .3);
      if (!touching) {
        data.posi = { x: pos.x, y: pos.y };
        this.setData({ config: config });
      }
      return `
        transform: translate3d(${pos.x}px, ${pos.y}px,0);
        transition: transform ${touching ? 0 : ti}s ease-out;
      `;
    },
  }
});
