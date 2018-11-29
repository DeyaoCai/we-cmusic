const today = new Date();
class WrapConfig{
  constructor(){
    this.slidePop = {show: false, type: ""},
    this.loadingPop = {show: false, stop: false, full: true,},
    this.alertPop = {
      show: false,
      title: "",
      direction: "bottom",
      full: true,
      content: "",
    }
    this.confirmPop = {
      type: "confirm",
      show: false,
      title: "",
      direction: "bottom",
      full: true,
      content: "",
    }
    this.radioPop = {
      show: false,
      list: [{name: "最早触发", isActive: false}],
    }
    this.checkPop = {
      show: false,
      list: [{name: "最早触发", isActive: false}],
    }
    this.datePickerPop = {
      full:false,
      renderConf:[today.getFullYear(),today.getMonth(),2],
      num: 1,
      start: new Date(today.getFullYear(),today.getMonth(),today.getDate()),
      end: new Date(today.getFullYear(),today.getMonth(),today.getDate()+29),
      onSelect:()=>{},
      time:[],
      show: false,
    }
    this.timePickerPop = {
      show: false,
      full:false,
      startYea: today.getFullYear(),
      yearNum: 10,
      onConfirm(res){}
    }
    this.temFilterPickerPop = {
      show: false,
      full:false,
      data:[
        {
          type: "radio",
          withAll: true,
          title: "123",
          list:[{name: "12312", isActive:true}, {name: "312", isActive: false}]
        },{
          type: "radio",
          withAll: true,
          title: "123",
          list:[{name: "1231", isActive: true},{name: "123", isActive: false}]
        },{
          type: "radio",
          withAll: true,
          title: "123",
          list:[{name: "", isActive: true},{name:"123",isActive:false}]
        }
      ],
      onConfirm(res){},
    }
    this.filterPop={
      show: false,
      full:false,
      data:[],
      onConfirm(res){},
    }
    this.gameArenaPop = {
      show: false,
      full: true,
    }

  }
  hideAll() {
    Object.keys(this).forEach(item => {
      this.hasOwnProperty(item) && (this[item].show = false);
    });
  }
  showTimePicker(conf){
    if(this.timePickerPop.show) return this.timePickerPop.show = false;
    this.hideAll();
    conf && Object.keys(conf).forEach(item => (this.timePickerPop[item] = conf[item]));
    this.timePickerPop.show = true;
  }
  showLoading(conf){
    this.hideAll();
    conf && Object.keys(conf).forEach(item => this.loadingPop[item] = conf[item]);
    this.loadingPop.show = true;
  }
  showConfirm(conf){
    if(this.confirmPop.show) return this.confirmPop.show = false;
    this.hideAll();
    this.alertPop.content = "";
    this.alertPop.title = "";
    conf&&Object.keys(conf).forEach(item => this.confirmPop[item] = conf[item]);
    this.confirmPop.show=true;
  }
  showSlide(conf){
    if(this.slidePop.show) return this.slidePop.show = false;
    this.hideAll();
    conf&&Object.keys(conf).forEach(item => this.slidePop[item] = conf[item]);
    this.slidePop.show=true;
  }
  showAlert(conf){
    if(this.alertPop.show) return this.alertPop.show = false;
    this.hideAll();
    this.alertPop.content = "";
    this.alertPop.title = "";
    conf&&Object.keys(conf).forEach(item => this.alertPop[item] = conf[item]);
    this.alertPop.show=true;
  }
  showRadio(conf){
    if(this.radioPop.show) return this.radioPop.show = false;
    this.hideAll();
    conf&&Object.keys(conf).forEach(item => this.radioPop[item] = conf[item]);
    this.radioPop.show=true;
  }
  showCheck(conf){
    if(this.checkPop.show) return this.checkPop.show = false;
    this.hideAll();
    conf&&Object.keys(conf).forEach(item => this.checkPop[item] = conf[item]);
    this.checkPop.show=true;
  }
  showDatePicker(conf){
    if(this.datePickerPop.show) return this.datePickerPop.show = false;
    this.hideAll();
    conf&&Object.keys(conf).forEach(item => this.datePickerPop[item] = conf[item]);
    this.datePickerPop.show=true;
  }
  showFilter(conf){
    if(this.filterPop.show) return this.filterPop.show = false;
    this.hideAll();
    console.log(conf)
    conf&&Object.keys(conf).forEach(item => this.filterPop[item] = conf[item]);
    this.filterPop.show=true;
  }
  showTemFilterPicker(conf){
    if(this.temFilterPickerPop.show) return this.temFilterPickerPop.show = false;
    this.hideAll();
    conf&&Object.keys(conf).forEach(item => this.temFilterPickerPop[item] = conf[item]);
    this.temFilterPickerPop.show=true;
  }
  showGameArena(conf){
    if(this.gameArenaPop.show) return this.gameArenaPop.show = false;
    this.hideAll();
    conf&&Object.keys(conf).forEach(item => this.gameArenaPop[item] = conf[item]);
    this.gameArenaPop.show=true;
  }
}
export default WrapConfig;
