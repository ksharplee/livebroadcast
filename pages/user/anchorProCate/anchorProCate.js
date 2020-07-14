// pages/user/anchorProCate/anchorProCate.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    cate: [],
    anchorCate: null,
    show: false,
    input: '',
    submitting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevePage = pages[pages.length - 2];
    if (prevePage.data.category) {
      this.setData({
        cate: prevePage.data.category.split(';'),
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

  openDialog() {
    this.setData({
      show: true,
    });
  },

  onCancel() {
    this.setData({
      show: false,
    });
  },

  onConfirm() {
    const arr = this.data.cate;
    arr.push(this.data.input);
    this.setData({
      cate: arr,
      input: '',
      show: false,
    });
  },

  changeInput(e) {
    this.setData({
      input: e.detail.value,
    });
  },

  removeCate(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.cate;
    arr.splice(index, 1);
    this.setData({
      cate: arr,
    });
  },

  saveCate() {
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
          category: this.data.cate.join(';'),
        })
        .then((res) => {
          this.setData({
            submitting: false,
          });
          wx.navigateBack({
            delay: 1,
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
        category: this.data.cate.join(';'),
      });
      wx.navigateBack();
    }
  },
});
