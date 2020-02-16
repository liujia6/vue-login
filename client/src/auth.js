/*
 * AAA
 * 认证（Authentication）、授权（Authorization）和计费（Accounting）的简称，
 * 是网络安全中进行访问控制的一种安全管理机制，提供认证、授权和计费三种安全服务。
 *
 */
class auth {
  constructor(status, data, menu) {
    this.init();
    this.data = data || this.data;
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
          window.sessionStorage["ngsoc_login"] = "";
        }
        window.sessionStorage["ngsoc_login"] = JSON.stringify(value);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(this, "token", {
      get() {
        return window.localStorage["token"];
      },
      set(value) {
        window.localStorage["ngsoc_token"] = value;
      },
      enumerable: true,
      configurable: true
    });
  }
  reset() {
    this.token = "";
    window.sessionStorage.removeItem("ngsoc_login");
    window.localStorage.clear();
  }
  getCurrentInfo() {
    return this.loginInfo;
  }
  getToken() {
    return this.token;
  }
  getPermission() {
    if (!this.menu || !this.menu.permissionFunc) {
      return null;
    }
    return this.menu.permissionFunc;
  }
  getLoginStatus() {
    return this.status;
  }
  updateCurrent({ status, token, loginInfo }) {
    token && (this.token = token);
    if (token === null) {
      this.token = "";
    }
    status && (this.status = status);
    loginInfo &&
      (this.loginInfo = Object.assign({}, this.loginInfo, loginInfo));
    if (loginInfo && loginInfo.accountInfo === null) {
      this.loginInfo.accountInfo = null;
    }
  }
  updateCurrentMenu({
    permissionFunc,
    menuObj,
    menuArray,
    menuOrign,
    defaultUrl,
    bShowFirstPageTip,
    globalOrigin,
    globalMapMenu
  }) {
    permissionFunc && (this.menu.permissionFunc = permissionFunc);
    menuObj && (this.menu.menuObj = menuObj);
    menuArray && (this.menu.menuArray = menuArray);
    menuOrign && (this.menu.menuOrign = menuOrign);
    globalOrigin && (this.menu.globalOrigin = globalOrigin);
    globalMapMenu && (this.menu.globalMapMenu = globalMapMenu);
    defaultUrl && (this.menu.defaultUrl = defaultUrl);
    this.menu.bShowFirstPageTip = !!bShowFirstPageTip;
  }
  loginOut() {
    this.reset();
  }
}
const a3Service = new AAA();
export default a3Service;
export { a3Service };
