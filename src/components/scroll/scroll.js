
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
      data.drag.prevent = data.config && data.config.derction ? { "": "", x: "y", y: "x", xy: "xy" }[data.config.derction] : "";

      data.confg || (data.confg = {});
      const conf = data.config;

      conf.index || (conf.index = {});
      const index = conf.index;
      index.x || (index.x = 0);
      index.y || (index.y = 0);

      conf.itemNum || (conf.itemNum = {});
      const itemNum = conf.itemNum;
      itemNum.x || (itemNum.x = 1);
      itemNum.y || (itemNum.y = 1);
    },
    ready(){
      const {data} = this;
      if (!data.$el || !data.$ele) {
        const query = wx.createSelectorQuery().in(this);
        data.$el || query.select('.vuc-scroll').boundingClientRect(function ($el) {
          data.$el = $el;
        }).exec();
        data.$ele || query.select('.vuc-scroll-wrap').boundingClientRect(function ($ele) {
          data.$ele = $ele;
        }).exec();
      }
      this.cacheWrapSize();
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
      cachedWrapsize: null,
      animatingT: false,
      animatingB: false,
      animating: false,
    },
    methods: {
      touchEv(ev) {
        const {data} = this;
        if (!data.$el || !data.$ele){
          const query = wx.createSelectorQuery().in(this);
          data.$el || query.select('.vuc-scroll').boundingClientRect(function ($el) {
            data.$el= $el;
          }).exec();
          data.$ele || query.select('.vuc-scroll-wrap').boundingClientRect(function ($ele) {
            data.$ele = $ele;
          }).exec();
        }

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
        const $el = data.$el;
        const $ele = data.$ele;
        if (!$ele || !$el) {
          return { wrap: { x: 0, y: 0 }, inner: { x: 0, y: 0 } }
        }
        const wrap = { x: $el.width, y: $el.height }
        let ix = $ele.width * data.config.itemNum.x;
        let iy = $ele.height;
        const inner = { x: ix, y: iy };
        data.cachedWrapsize = { wrap, inner };
        return data.cachedWrapsize;
      },
      getWrapSize() { return this.data.cachedWrapsize || this.cacheWrapSize(); },
      touchingLimit(pos, dVal) {
        const { data } = this;
        this.callXTouchingEndFn(pos, dVal);// x 超界回调
        this.callYTouchingEndFn(pos, dVal);// y越界回调
        this.touchingDamp(pos, dVal);// 超界有阻尼
      },
      setIndex(obj) {
        const { data } = this;
        const index = {
          x: obj.x !== undefined ? obj.x : (data.config.index.x || 0),
          y: obj.y !== undefined ? obj.y : (data.config.index.y || 0),
        }
        const wrap = this.cacheWrapSize().wrap;
        const width = wrap.x;
        const height = wrap.y;
        const x = -index.x * width;
        const y = -index.y * height;
        this.setData({
          posi: { x: x, y: y },
          nowPosi: { x: x, y: y },
        });
        this.setData({ innerStyle: this.innerStyle() });
      },
      handelTakeOneStepAtATime(posi){
        const {data} = this;
        if (data.config.takeOneStepAtATime) {
          const wrap = this.cacheWrapSize().wrap;
          const width = wrap.x;
          const height = wrap.y;
          posi.x = Math.round(posi.x / width) * width;
          posi.y = Math.round(posi.y / height) * height;
        }
      },
      normalLimit(pos, dVal) {
        const { data } = this;
        this.handelTakeOneStepAtATime(pos);
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
        const config = data.config;
        const index = config.index;

        const offset = Drag.prototype.getOffset.call(data.drag);
        const offsetY = pos.y - posi.y - offset.y;

        let ti = Math.sqrt(Math.sqrt(Math.sqrt(Math.sqrt(Math.abs(offsetY * data.rate)))));
        ti < .3 && (ti = .3);
        if (!touching) {
          data.posi = { x: pos.x, y: pos.y };
          const wrap = this.cacheWrapSize().wrap;
          const width = wrap.x;
          const height = wrap.y;
          const x = Math.abs(Math.round(pos.x / width));
          const y = Math.abs(Math.round(pos.y / height));
          index.x = x;
          index.y = y;
          this.triggerEvent("updataIndex", { x: index.x, y: index.y });
          this.setData({ config: config });
        }
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
            this.setData({ innerStyle: this.innerStyle() });
          }, ti * 1000)
        }
        return `
        transform: translate3d(${pos.x}px, ${pos.y}px,0);
        transition: transform ${touching ? 0 : ti}s ease-out;
      `;
      },
    }
  })

