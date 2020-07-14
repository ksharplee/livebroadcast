// pages/anchor/album/album.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    album: [],
    showPreview: false,
    previewImageUrls: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (options.isPersonal) {
      wx.setNavigationBarTitle({
        title: '相册',
      });
      this.setData({
        album: prevPage.data.album,
      });
    } else {
      this.setData({
        album: prevPage.data.company.album,
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

  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    console.log('函数: previewImage -> index', index);
    const current = `${this.data.album[index].image}?x-oss-process=image/resize,m_lfit,w_375,h_375`;
    console.log('函数: previewImage -> current', current);
    const urls = this.data.album.map(
      (item) => `${item.image}?x-oss-process=image/resize,m_lfit,w_375,h_375`
    );
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    });
  },
});
