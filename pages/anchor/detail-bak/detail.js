// pages/anchor/detail/detail.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    userInfo: null,
    anchor: {},
    edit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, edit, sellerId } = options;
    this.setData({
      edit,
      id,
      sellerId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadPageData(this.data.id, this.data.sellerId);
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  loadPageData(id, sellerId) {
    app
      .getApi('/at/detail', {
        id,
        sellerId: sellerId,
        isPersonal: '1',
      })
      .then((res) => {
        this.setData({
          anchor: res.data,
        });
      });
  },

  onDeleteAnchor(e) {
    Dialog.confirm({
      title: '确定删除吗？',
      message: ' ',
    }).then(() => {
      app.getApi('/at/delete', { id: this.data.anchor.id }).then((res) => {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2];
        prevPage.setData({
          anchors: {
            currentPage: 0,
            data: [],
            info: '',
            isMore: 1,
            status: 1,
          },
        });
        wx.navigateBack({
          success: () => {
            wx.showToast({
              title: '删除成功',
            });
          },
        });
      });
    });
  },

  onEditAnchor(e) {
    wx.navigateTo({
      url: '/pages/user/anchorAdd/anchorAdd?edit=true',
    });
  },
});
