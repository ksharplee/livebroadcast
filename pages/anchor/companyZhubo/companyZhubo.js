// pages/anchor/companyZhubo/companyZhubo.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    imgWidth: null,
    anchors: {
      currentPage: 0,
      data: [],
      info: '',
      isMore: 1,
      status: 1,
    },
    loading: false,
    addable: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 50) / 4,
    });
    // 如果有id，表示是公司列表过来，不允许添加网红
    if (options.id) {
      this.setData({
        id: options.id,
        sellerId: options.sellerId,
        addable: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      anchors: {
        currentPage: 0,
        data: [],
        info: '',
        isMore: 1,
        status: 1,
      },
    });
    this.loadPageData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      anchors: {
        currentPage: 0,
        data: [],
        info: '',
        isMore: 1,
        status: 1,
      },
    });
    this.loadPageData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.anchors.isMore) {
      this.loadPageData();
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
    const params = { p: +this.data.anchors.currentPage + 1 };
    if (this.data.id) {
      params.sellerId = this.data.sellerId;
      params.id = this.data.id;
    }
    app
      .getApi('/at/lists', params)
      .then((res) => {
        this.setData({
          ['anchors.currentPage']: res.currentPage,
          ['anchors.isMore']: res.isMore,
          ['anchors.status']: res.status,
          ['anchors.info']: res.info,
          ['anchors.data']: this.data.anchors.data.concat(res.data),
          loading: false,
        });
        wx.stopPullDownRefresh();
      })
      .catch((err) => {
        this.setData({
          loading: false,
        });
        wx.stopPullDownRefresh();
      });
  },

  navigateTo() {
    wx.navigateTo({
      url: '/pages/user/anchorAdd/anchorAdd',
    });
  },
});
