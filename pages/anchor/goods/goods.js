// pages/user/anchorProduct/anchorProduct.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    imgWidth: null,
    submitting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 40) / 2,
      goods: prevPage.data.goods,
    });
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  removeProduct(e) {
    const { index } = e.currentTarget.dataset;
    const arr = this.data.goods;
    arr.splice(index, 1);
    this.setData({
      goods: arr,
    });
  },

  navigateTo() {
    wx.navigateTo({
      url: '/pages/user/anchorProductAdd/anchorProductAdd',
    });
  },

  saveGoods(e) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    if (prevPage.route === 'pages/user/index/index') {
      this.setData({
        submitting: true,
      });
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2]; //上一页
      app
        .getApi('/at/edit', {
          id: prevPage.data.anchorId,
          goods: JSON.stringify(this.data.goods),
        })
        .then((res) => {
          this.setData({
            submitting: false,
          });
          wx.navigateBack({
            success: () => {
              wx.showToast({
                title: '编辑成功',
              });
            },
          });
        })
        .catch((err) => {
          this.setData({
            submitting: false,
          });
        });
    } else {
      prevPage.setData({
        goods: this.data.goods,
      });
      wx.navigateBack();
    }
  },
});
