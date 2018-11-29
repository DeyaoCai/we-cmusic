import Time from "./Time.js";

// Time 对象的收集者， 根据一定的需求生产一组满足条件的日期对象
class Timer{
  constructor(){}
  isRun(yea){
    // 根据年份判断是否闰年
    if (yea % 400 === 0) return true;
    if (yea % 100 === 0) return false;
    if (yea % 4 === 0) return true;
    return false;
  }
  daysOfMonth(mon,yea){
    // 根据年月判断当月日期数
    return {0: 31, 1: null, 2: 31, 3: 30, 4: 31, 5: 30, 6: 31, 7: 31, 8: 30, 9: 31, 10: 30, 11: 31}[mon]||
    (this.isRun(yea) ? 29 : 28);
  }
  
  // 供日期组件使用
  getDateArr(yea, mon, len){
    // 根据开始年份和月份 获取渲染一定数量月份的日期数据
    // 当获取月数未定，或者长度为0 时，认为只需要渲染当月
    if(!len) {
      
      // 从字典中查找当月天数，如果没有（不确定）天数，则说明是二月 需要根据是否是闰年进一步判断
      let dateNum = this.daysOfMonth(mon,yea);
      
      // 创建一个长度等于天数的数组（填充的目的是防止数组在forEach遍历时跳过未填充的项，相当于是没有遍历）
      let ret = new Array(dateNum).fill(1);
      
      // 根据序号填充一个自定义时间对象 详情请参考 Time 类
      ret.forEach(
        (item, index) => ret[index] = new Time(new Date(yea, mon, index + 1))
      );
      
      // 当月的信息 ， 取当月第一天作为参考
      const stamp = ret[0].timeStamp;
      
      // 根据当前为周几 ，填充日期数组前n项，以便页面渲染
      const list = new Array(stamp.getDay()).fill({}).concat(ret);
      
      // 返回值 也是一个自定义时间对象
      ret = new Time(stamp);
      
      // 并且他应该包含整个月份的日期
      ret.list = list;
      return ret;
    }
    //多月情况处理 返回一个数组
    return new Array(len).fill(0).map((item, index) => this.getDateArr(yea, mon + index))
  }
  
  
  // 根据开始的数据，创建一个递增的数组
  getArr(start,len){
    return new Array(len).fill(0).map((item,index)=>{
      return {
        num:start+index,
        isActive:false,
      }
    })
  }
  // 供时间组件使用 
  // 获取从某年开始， 持续多少年的的时间选择器数组 
  // 并未对月份做特殊处理， 需要在切换月份的时候，自行做当月天数的限制
  getArrs(start,len){
    const ret = {};
    ret.yea = this.getArr(start,len);
    ret.mon = this.getArr(0,12);
    ret.dat = this.getArr(1,31);
    ret.hou = this.getArr(0,24);
    ret.min = this.getArr(0,60);
    ret.sec = this.getArr(0,60);
    return ret;
  }
  
  // 传入一个时间戳 和 期望数组长度，然后以此返回一个开始日期开始，包含传入长度的时间对象数组
  getTimeArr(len,start){
    let stamp;
    if(start){
      start.constructor===Time&&(stamp=start);
      start.constructor===Date&&(stamp=new Time(start));
    }
    stamp||(stamp=new Time());
    return new Array(len||30).fill(0).map((item,index)=>{
      return new Time(new Date(stamp.yea,stamp.mon,stamp.dat+index));
    })
  }
}
export default Timer;
