
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
      this.setIndex(this.data.config.index);
    },
    data: {},
    methods: {
      setIndex(obj) {
        const { data } = this;
        const { config } = data;
        const index = {
          x: obj.x !== undefined ? obj.x : (data.config.index.x || 0),
          y: obj.y !== undefined ? obj.y : (data.config.index.y || 0),
        };
        config.index = index;
        this.setData({
            config: config,
            innerStyle: this.innerStyle(index)
        });
      },
      innerStyle(index) {
        index || (index = {x: 0, y: 0});
        return `
          transform: translate3d(-${index.x}00%, 0, 0);
          transition: transform .3s ease-out;
        `;
      },
    }
  })

