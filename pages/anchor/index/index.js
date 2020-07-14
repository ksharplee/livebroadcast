// pages/anchor/index/index.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    imgWidth: null,
    anchors: {
      currentPage: 0,
      data: [],
      info: '',
      isMore: 1,
      status: 1,
    },
    loading: false,
    // anchorsPart: [],
    // index: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 100) / 4,
      // anchorsPart: this.store.data.anchors.slice(0, this.data.index),
      // index: this.data.index,
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
    // const index = this.data.index < this.store.data.anchors.length ? this.data.index + 20 : this.store.data.anchors.length
    // this.setData({
    //   index: index,
    //   anchorsPart: this.store.data.anchors.slice(
    //     0,
    //     index
    //   ),
    // });
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
    app
      .getApi('/at/lists', { p: +this.data.anchors.currentPage + 1, all: '1' })
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
});
