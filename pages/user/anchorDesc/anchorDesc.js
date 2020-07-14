// pages/user/anchorDesc/anchorDesc.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    desc: '',
    // readOnly: false,
    // placeholder: '开始输入...',
    // editorHeight: 300,
    // keyboardHeight: 0,
    // isIOS: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const platform = wx.getSystemInfoSync().platform
    // const isIOS = platform === 'ios'
    // this.setData({ isIOS})
    // const that = this
    // this.updatePosition(0)
    // let keyboardHeight = 0
    // wx.onKeyboardHeightChange(res => {
    //   if (res.height === keyboardHeight) return
    //   const duration = res.height > 0 ? res.duration * 1000 : 0
    //   keyboardHeight = res.height
    //   setTimeout(() => {
    //     wx.pageScrollTo({
    //       scrollTop: 0,
    //       success() {
    //         that.updatePosition(keyboardHeight)
    //         that.editorCtx.scrollIntoView()
    //       }
    //     })
    //   }, duration)
    // })
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    this.setData({
      desc: prevPage.data.detailDesc,
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

  onInput(e) {
    this.setData({
      desc: e.detail.value,
    });
  },

  saveDesc(e) {
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
          detailDesc: this.data.desc,
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
        detailDesc: this.data.desc,
      });
      wx.navigateBack();
    }
  },
});
