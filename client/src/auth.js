
class auth {
  constructor(status, data, menu) {
    this.init();
    // this.loginInfo = {};
    //初始化时拉取以前的token值，这样刷新的时候不会重置
    this.token = window.localStorage.getItem("token");
  }
  init() {
    // Object.defineProperty(this, "loginInfo", {
    //   get() {
    //     if (!window.sessionStorage["loginInfo"]) {
    //       return {};
    //     }
    //     return JSON.parse(window.sessionStorage["loginInfo"]);
    //   },
    //   set(value) {
    //     if (!value) {
    //       window.sessionStorage['loginInfo'] = '';
    //     }
    //     window.sessionStorage['loginInfo'] = JSON.stringify(value);
    //   },
    //   enumerable: true,
    //   configurable: true
    // });
    Object.defineProperty(this, "token", {
      get() {
        return window.localStorage["token"];
      },
      set(value) {
        window.localStorage['token'] = value;
      },
      enumerable: true,
      configurable: true
    });
  }
  login(result){
    // this.loginInfo = result.data.data.loginInfo;
    this.token = result.data.data.token;
  }
  logout(){
    this.token="";
    // window.sessionStorage.removeItem("loginInfo");
    window.localStorage.clear();
  }
}

const a3Service = new auth();
export default a3Service;
