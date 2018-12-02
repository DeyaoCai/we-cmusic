
  Component({
    options: {
      multipleSlots: true
    },
    properties: {
      innerText: {
        type: String,
        value: 'default value',
      }
    },
    data: {
      someData: {}
    },
    methods: {
      customMethod: function () { }
    }
  })
