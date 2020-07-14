//this.js
import store from './store/store.js';
import create from './utils/create.js';
App({
  create,
  store,
  globalData: {
    userInfo: null,
    //baseUrl: 'http://home.thirdordersystem.com/Live',
    baseUrl: 'https://www.ywmh.com/Live',
    sessionId: '',
    openId: '',
    // currentRoleId: 0,
    jumpBack: false,
  },
  onShow: function (options) {
    if (options && options.scene && options.scene == 1037) {
      this.globalData.jumpBack = true;
    } else {
      this.globalData.jumpBack = false;
    }
  },
  onLaunch: function (options) {
    if (wx.canIUse('getUpdateManager')) {
      //小程序版本更新处理
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content:
                '新版本已经上线啦~，请您删除当前小程序，重新搜索"义数订货"打开哟~',
            });
          });
        }
      });
    }
    this.store.data.device = wx.getSystemInfoSync();
    if (
      this.store.data.device.model.substr(0, 8) === 'iPhone X' ||
      this.store.data.device.model.substr(0, 8) === 'iPhone 1' ||
      this.store.data.device.model.substr(0, 7) === 'unknown'
    ) {
      this.store.data.device.needFix = true;
    }
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        let { code } = res;
        wx.request({
          url: `${this.globalData.baseUrl}` + '/u/get_user_tag_info',
          type: 'GET',
          data: { code: code },
          header: {
            'content-type': 'application/json',
          },
          success: (response) => {
            var resData = response.data;
            this.globalData.sessionId = resData.sessionId;
            this.globalData.openId = resData.openid;
            // this.globalData.currentRoleId = resData.currentRoleId
            this.globalData.userInfo = resData.data;
            this.store.data.userInfo = resData.data;
            this.store.data.companyBanner = resData.tags && resData.tags.adInfo ? resData.tags.adInfo : [];
            const pages = getCurrentPages();
            if (resData.data && pages[0].route === '/pages/index/index') {
              wx.setTabBarItem({
                index: 3,
                text: '我的',
                iconPath: '/images/icon-tabbar-user.png',
                selectedIconPath: '/images/icon-tabbar-user-active.png',
              });
            }
            // this.store.data.anchors = resData.tags.liveInfo;
            this.store.update();
            if (!this.globalData.sessionId && pages[0].route !== '/pages/goodsDetail/goodsDetail') {
              this.getSessionId().then((res) => {
                wx.switchTab({
                  url: '/pages/index/index',
                });
              });
            }
          },
          fail: (err) => {
            wx.showToast({
              title: '调用异常',
              icon: 'none',
            });
          },
        });
      },
    });
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            },
          });
        }
      },
    });
  },
  getApi(url, params = {}, contentType, showLoading = true) {
    // if (showLoading) {
    //   wx.showLoading({ title: '努力加载中...' });
    // }
    wx.showNavigationBarLoading();
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.globalData.baseUrl + url}`,
        method: 'POST',
        header: {
          'Content-Type': contentType
            ? contentType
            : 'application/x-www-form-urlencoded',
          Cookie: `PHPSESSID=${this.globalData.sessionId}`,
        },
        data: params,
        success: (res) => {
          if (res.data.status === 1) {
            resolve(res.data);
          } else {
            if (res.data.status == '-1') {
              this.onLaunch();
            }
            wx.showToast({
              title: `${res.data.info}`,
              icon: 'none',
            });
            reject(res.data.status);
          }
          wx.hideNavigationBarLoading();
        },
        fail: (err) => {
          wx.hideNavigationBarLoading();
        }
      });
    });
  },
  getSessionId(url = '', params) {
    if (url != '') {
      wx.request({
        url: `${this.globalData.baseUrl}` + '/Common/get_session_id',
        header: {
          'content-type': 'application/json',
        },
        success: (response) => {
          var resData = response.data;
          this.globalData.sessionId = resData.sessionId;
          // this.store.data.anchors = resData.liveInfo;
          this.getApi(url, params);
        },
        fail: (err) => {
          wx.showToast({
            title: '调用异常',
            icon: 'none',
          });
        },
      });
    } else {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.globalData.baseUrl}` + '/Common/get_session_id',
          header: {
            'content-type': 'application/json',
          },
          success: (response) => {
            var resData = response.data;
            this.globalData.sessionId = resData.sessionId;
            // this.store.data.anchors = resData.liveInfo;
            resolve(response.data);
          },
          fail: (err) => {
            wx.showToast({
              title: '调用异常',
              icon: 'none',
            });
          },
        });
      });
    }
  },
  showErrorMessage: function (str) {
    wx.showToast({
      title: str,
      icon: 'none',
    });
  },
});
