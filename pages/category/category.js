// pages/category/category.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    category: [],
    cateIndex: 0,
    device: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { index } = options;
    this.setData({
      cateIndex: index ? +index : 0,
      category: this.store.data.categories.map((item) => {
        item.text = item.dnames;
        item.children = item.child ? item.child : [];
        return item;
      }),
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

  onClickNav(e) {
    this.setData({
      cateIndex: e.detail.index,
    });
  },

  getGoodsBySubCate(e) {
    const { id, index } = e.currentTarget.dataset;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    prevPage.setData({
      cateId: id,
      cateIndex: this.data.cateIndex + 1,
      subCategories: this.store.data.categories[this.data.cateIndex].child
        ? this.store.data.categories[this.data.cateIndex].child.slice(0, 9)
        : [],
      subCateIndex: index,
    });
    wx.navigateBack();
  },
});
