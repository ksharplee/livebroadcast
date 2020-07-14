// pages/anchor/list/list.js
const app = getApp()

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    imgWidth: null,
    companies: {
      currentPage: 0,
      data: [],
      info: '',
      isMore: 1,
      status: 1,
    },
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 70) / 3,
    });
    this.loadPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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
      companies: {
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
    if (this.data.companies.isMore) {
      this.loadPageData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  // onClickTab(e) {
  //   console.log('函数: onClickTab -> e', e);
  //   const name = e.detail.name;
  //   if (name === 1) {
  //     wx.setNavigationBarTitle({
  //       title: '网红',
  //     });
  //   } else {
  //     wx.setNavigationBarTitle({
  //       title: '直播公司/机构',
  //     });
  //   }
  // },

  loadPageData() {
    this.setData({
      loading: true,
    });
    app
      .getApi('/s/lists', { p: this.data.companies.currentPage + 1 })
      .then((res) => {
        this.setData({
          ['companies.currentPage']: res.currentPage,
          ['companies.isMore']: res.isMore,
          ['companies.status']: res.status,
          ['companies.info']: res.info,
          ['companies.data']: this.data.companies.data.concat(res.data),
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
});
