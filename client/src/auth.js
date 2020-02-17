/*
 * AAA
 * 认证（Authentication）、授权（Authorization）和计费（Accounting）的简称，
 * 是网络安全中进行访问控制的一种安全管理机制，提供认证、授权和计费三种安全服务。
 *
 */
class auth {
  constructor(status, data, menu) {
    this.init();
    this.loginInfo = {};
    this.token = "";
  }
  init() {
    Object.defineProperty(this, "loginInfo", {
      get() {
        if (!window.sessionStorage["loginInfo"]) {
          return {};
        }
        return JSON.parse(window.sessionStorage["loginInfo"]);
      },
      set(value) {
        if (!value) {
          window.sessionStorage['loginInfo'] = '';
        }
        window.sessionStorage['loginInfo'] = JSON.stringify(value);
      },
      enumerable: true,
      configurable: true
    });
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
    this.loginInfo = result.data.data.loginInfo;
    this.token = result.data.data.token;
  }
  logout(){
    this.token="";
    window.sessionStorage.removeItem("loginInfo");
    window.localStorage.clear();
  }
}

const a3Service = new auth();
export default a3Service;
