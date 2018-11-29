let Drag = require("../../tools/drag.js");
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
  data: {
    innerStyle: "",
    drag: new Drag(),
    posi: { x: 0, y: 0 },
    nowPosi: { x: 0, y: 0 },
    damp: .3,
    rate: .5,
    showReflashTip: false,
    showLoadMoreTip: false,
    isShowingTip: false,
    _isLoading: false,
    hasOnEndEv: false,
    catchedWrapsize: null,
    animatingT: false,
    animatingB: false,
    animating: false,
  },
  methods: {
    touchEv(ev) {
      const {data} = this;
      if (data.animatingT || data.animatingB) return;
      data.hasOnEndEv = false;
      if (data._isLoading) return;
      Drag.prototype.touchEv.call(data.drag, ev);
      this.cacheWrapSize();
      data.animating = false;
      data.isShowingTip = false;
      this.setData({ innerStyle: this.innerStyle()});
    },
    moveEv(ev) {
      const { data } = this;
      if (data._isLoading) return;
      Drag.prototype.moveEv.call(data.drag, ev);
      data.nowPosi = this.getLimitedPosition();
      this.setData({ innerStyle: this.innerStyle() });
    },
    endEv() {
      const { data } = this;
      if (data._isLoading) return;
      Drag.prototype.endEv.call(data.drag);
      data.nowPosi = this.getLimitedPosition();
      data.config.onTouchEnd && data.config.onTouchEnd(data.config.index, data.config);
      this.setData({ innerStyle: this.innerStyle() });
    },
    getOffset() {
      const { data } = this;
      const touching = data.drag.isTouching;
      const offset = Drag.prototype.getOffset.call(data.drag);
      const speed = touching ? { x: 0, y: 0 } : data.drag.getSpeed();
      return {
        x: offset.x + speed.x * Math.abs(speed.x) * data.rate,
        y: offset.y + speed.y * Math.abs(speed.y) * data.rate
      }
    },
    getUnLimitedPosition() {
      const { data } = this;
      const touching = data.drag.isTouching;
      const posi = data.posi;
      const offset = Drag.prototype.getOffset.call(data.drag);
      const speed = touching ? { x: 0, y: 0 } : Drag.prototype.getSpeed.call(data.drag);
      return {
        x: posi.x + offset.x + speed.x * Math.abs(speed.x) * data.rate,
        y: posi.y + offset.y + speed.y * Math.abs(speed.y) * data.rate
      }
    },
    getLimitedPosition() {
      const { data } = this;
      const touching = data.drag.isTouching;
      let pos = this.getUnLimitedPosition();
      const { inner, wrap } = this.getWrapSize();
      const dVal = { x: wrap.x - inner.x, y: wrap.y - inner.y };
      this[touching ? "touchingLimit" : "normalLimit"](pos, dVal);
      return pos;
    },
    cacheWrapSize() {
      const { data } = this;

      var query = wx.createSelectorQuery();
      //选择id
      var that = this;
      query.select('.vuc-scroll-wrap').boundingClientRect(function (rect) {
        console.log(rect)
      }).exec();
      console.log(query)
      const $el = this.$el;
      
      if (!$el) return { wrap: { x: 0, y: 0 }, inner: { x: 0, y: 0 } };
      const $ele = $el.getElementsByClassName("vuc-scroll-wrap")[0];
      const wrap = { x: $el.offsetWidth, y: $el.offsetHeight }
      // x 周因为 元素最大为100%，顾需要手动计算 y轴不用
      let ix = $ele.offsetWidth * data.config.itemNum.x;
      let iy = $ele.offsetHeight;

      // 当不能根据容器的体积计算出滚动长度的时候， 我们需要根据他的子节点的宽度来让其滚动
      if (data.config.isGetInnerSizeByChild) {
        const child = $ele.children[0];
        ix = child ? child.offsetWidth : 0;
        iy = child ? child.offsetHeight : 0;
      }
      const inner = { x: ix, y: iy };
      data.catchedWrapsize = { wrap, inner };
      return this.catchedWrapsize;
    },
    getWrapSize() { return this.data.catchedWrapsize || this.cacheWrapSize(); },
    touchingLimit(pos, dVal) {
      const { data } = this;
      this.callXTouchingEndFn(pos, dVal);// x 超界回调
      this.callYTouchingEndFn(pos, dVal);// y越界回调
      this.touchingDamp(pos, dVal);// 超界有阻尼
    },
    normalLimit(pos, dVal) {
      const { data } = this;
      // 越界限制
      if (pos.x > 0) pos.x = 0;
      if (dVal.x > 0) pos.x = 0;
      else if (pos.x < dVal.x) pos.x = dVal.x;
      // y轴方向 // 如果大于了150
      if (data.showReflashTip) pos.y = 50;
      else if (pos.y > 100) {
        pos.y > 100 && (pos.y = 50);
        data.animatingT = true;
      } else if (pos.y > 0) {
        pos.y = 0;
      }
      if (dVal.y > 0) pos.y = 0; // 内容比容器小
      else if (data.showLoadMoreTip) pos.y = dVal.y - 50;
      else if (pos.y < dVal.y - 100) {
        pos.y < dVal.y - 100 && (pos.y = dVal.y - 50);
        data.animatingB = true;
        if (data.needLoading) { data.config.loadMore(data.config, data.hideLoadTip) }
      } else if (pos.y < dVal.y) {
        pos.y = dVal.y;
      }
    },
    // 触摸相关函数
    callXTouchingEndFn(pos, dVal) {
      const { data } = this;
      const f = data.damp; // 阻尼
      // x 超界函数
      if (pos.x * f > 30) {
        !data.hasOnEndEv && data.config.onLeftEnd && data.config.onLeftEnd();
        data.hasOnEndEv = true;
      }
      if ((dVal.x - pos.x) * f > 30) {
        !data.hasOnEndEv && data.config.onRightEnd && data.config.onRightEnd();
        data.hasOnEndEv = true;
      }
    },
    callYTouchingEndFn(pos, dVal) {
      const { data } = this;
      // y越界回调 显示|隐藏加载更多|刷新提示
      data.showReflashTip = data.needReflash && pos.y > 150;
      data.showLoadMoreTip = data.needLoading && dVal.y - pos.y > 150;
    },
    touchingDamp(pos, dVal) {
      const { data } = this;
      const f = data.damp; // 阻尼
      const fix = data.drag.touching ? 50 : 0;
      // 超界有阻尼
      if (pos.x > 0) { pos.x = pos.x * f; }
      if (dVal.x > 0) { pos.x = pos.x * f; } // 内容没铺满容器
      else if (pos.x < dVal.x) { pos.x = (pos.x - dVal.x) * f + dVal.x; }
      if (pos.y > 0) { pos.y = (pos.y - fix) * f + fix; }
      if (dVal.y > 0) { pos.y = pos.y * f; }
      else if (pos.y < dVal.y) { pos.y = (pos.y - dVal.y + fix) * f + dVal.y - fix; }
    },

    innerStyle() {
      const {data} = this;
      const touching = data.drag.isTouching;
      const pos = data.nowPosi;
      const posi = data.posi;
      const offset = Drag.prototype.getOffset.call(data.drag);
      const offsetY = pos.y - posi.y - offset.y;

      let ti = Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(offsetY * data.rate)))));
      ti < .3 && (ti = .3);
      touching || (data.posi = { x: pos.x, y: pos.y });
      // ti > 1 && (ti = 1);
      if (data.config.takeOneStepAtATime) ti = .3;
      (data.isShowingTip || data.animating) && (ti = .3);
      if (!(data.showReflashTip || data.showLoadMoreTip) && data.animatingT || data.animatingB) {
        const wrapSize = this.getWrapSize();
        setTimeout(() => {
          data.animatingT && (data.nowPosi.y = 0);
          data.animatingB && (data.nowPosi.y = wrapSize.wrap.y - wrapSize.inner.y);
          data.animatingT = false;
          data.animatingB = false;
          data.animating = true;
        }, ti * 1000)
      }
      return `
        transform: translate3d(${pos.x}px, ${pos.y}px,0);
        transition: transform ${touching ? 0 : ti}s ease-out;
      `;
    },
  }
})