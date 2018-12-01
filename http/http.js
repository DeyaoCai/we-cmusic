const httpConf = require("./httpConf");
function makeAjax(url) {
  return function(data){
    const cb = {fn: null, then: fn=>cb.fn = fn}
    // const fullUrl = "http://vuc.cn:3000" + url + (data ? ("?" + Object.keys(data).map(item=>item + "=" + data[item]).join("&")) : "");
    const fullUrl = "http://47.104.252.208:3000" + url + (data ? ("?" + Object.keys(data).map(item=>item + "=" + data[item]).join("&")) : "");
    wx.getStorage({
      key: "wxcmusiccookie",
      success(res) {
        wx.request({
          header: { Cookie: res.data,},
          url: encodeURI(fullUrl),
          success (res) {cb.fn && cb.fn(res)},
          fail() {console.log("fail")},
        })
      },
      fail(){
        wx.request({
          url: encodeURI(fullUrl),
          success (res) {cb.fn && cb.fn(res)},
          fail () {console.log("fail")},
        })
      },
    })

    
    // fetch(encodeURI(fullUrl),{
    //   xhrFields: {withCredentials: true},
    //   credentials: 'include'
    // }).then(res =>{
    //   res.json().then(res => cb.fn && cb.fn(res)).catch(e=>console.log(e));
    // });
    return fn => cb.fn = fn;
  }
}
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm'
}
const ajax = {};
function camel(str) {
  return str.replace(/\//,"")
    .split(/\//)
    .map((item,index) =>
      index ?
        (item[0].toUpperCase() + item.slice(1)) :
        item
    ).join("");
}
httpConf.forEach(file => {
  if(!(/\.js$/i.test(file))) return;
  let route = (file in special) ? special[file] : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
  ajax[camel(route)] = makeAjax(route)
});

module.exports = ajax;
