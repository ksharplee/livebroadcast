// pages/user/anchorPlatform/anchorPlatform.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    platform: [
      {
        platformName: '',
        fanCount: '',
      },
    ],
    submitting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    this.setData({
      platform: prevPage.data.platform.length
        ? JSON.parse(JSON.stringify(prevPage.data.platform))
        : [
            {
              platformName: '',
              fanCount: '',
            },
          ],
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

  addPlatform() {
    const arr = this.data.platform;
    arr.push({
      platformName: '',
      fanCount: '',
    });
    this.setData({
      platform: arr,
    });
  },

  removePlatform(e) {
    const index = e.currentTarget.dataset.index;
    const arr = this.data.platform;
    arr.splice(index, 1);
    if (!arr.length) {
      arr.push({
        platformName: '',
        fanCount: '',
      });
    }
    this.setData({
      platform: arr,
    });
  },

  changePlatformName(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.setData({
      [`platform[${index}].platformName`]: value,
    });
  },

  changePlatformFan(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    this.setData({
      [`platform[${index}].fanCount`]: value,
    });
  },

  onSubmit(e) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    this.setData({
      submitting: true,
    });
    app
      .getApi('/at/edit', {
        platform: JSON.stringify(
          this.data.platform.filter(
            (item) => item.platformName && item.fanCount
          )
        ),
        id: prevPage.data.anchorId,
      })
      .then((res) => {
        this.setData({
          submitting: false,
        });
        wx.navigateBack({
          success: () => {
            wx.showToast({
              title: '保存成功',
            });
          },
        });
      })
      .catch((err) => {
        this.setData({
          submitting: false,
        });
      });
  },
});
