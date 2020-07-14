// pages/user/index/index.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    anchors: [],
    anchorsAvailable: [],
    album: [],
    albumAvailable: [],
    baseInfo: {},
    userInfo: null,
    imgWidth: null,
    loading: false,
    detailDesc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.store.data.userInfo) {
      this.loadPageData();
      this.setData({
        imgWidth: (this.store.data.device.windowWidth - 64 - 50) / 6,
      });
      // wx.setTabBarItem({
      //   index: 2,
      //   text: '我的',
      //   iconPath: '/images/icon-tabbar-user.png',
      //   selectedIconPath: '/images/icon-tabbar-user-active.png',
      // });
      wx.setNavigationBarTitle({
        title: '我的',
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  loadPageData() {
    this.setData({
      loading: true,
    });
    const params = {
      isPersonal: this.store.data.userInfo.isPersonal,
      sellerId: this.store.data.userInfo.sellerId,
      logSellerId: this.store.data.userInfo.sellerId,
    };
    if (this.store.data.userInfo.isPersonal === '1') {
      params.userIsAnchor = '1';
    }
    app.getApi('/at/detail', params).then((res) => {
      this.setData({
        album: res.data.album,
        albumAvailable: res.data.album.slice(0, 4),
        authInfo: res.data.authInfo,
        loading: false,
      });
      if (this.store.data.userInfo.isPersonal === '0') {
        this.setData({
          anchors: res.data.anchor,
          anchorsAvailable: res.data.anchor.slice(0, 6),
          desce: res.data.baseInfo.desce,
          desceShow:
            res.data.baseInfo.desce.length > 10
              ? res.data.baseInfo.desce.substr(0, 10) + '...'
              : res.data.baseInfo.desce,
          baseInfo: res.data.baseInfo,
        });
      } else {
        this.setData({
          detailDesc: res.data.detailDesc,
          category: res.data.category,
          platform: res.data.platform,
          dnames: res.data.dnames,
          nickName: res.data.nickName,
          address: res.data.address,
          authInfo: res.data.authInfo,
          baseInfo: res.data.baseInfo,
          logo: res.data.logo,
          goods: res.data.goods,
          address: res.data.address,
          detailDescShow:
            res.data.detailDesc.length > 10
              ? res.data.detailDesc.substr(0, 10) + '...'
              : res.data.detailDesc,
          anchorId: res.data.id,
        });
      }
    });
  },

  navigateToCompany(e) {
    const { edit } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/user/companyInfo/companyInfo?edit=${edit}`,
    });
  },

  navigateToAnchor(e) {
    const { edit } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/user/userInfo/userInfo?edit='+ edit,
    });
  },
});
