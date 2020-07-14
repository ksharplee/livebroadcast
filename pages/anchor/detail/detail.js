// pages/user/index/index.js
const app = getApp();
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    anchors: [],
    anchorsAvailable: [],
    album: [],
    albumAvailable: [],
    baseInfo: {},
    userInfo: null,
    imgWidth: null,
    loading: false,
    detailDesc: '',
    edit: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { id, edit, sellerId } = options;
    this.setData({
      imgWidth: (this.store.data.device.windowWidth - 64 - 30) / 4,
      anchorId: id,
      sellerId,
      edit: edit === '1' ? true : false,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadPageData(this.data.anchorId, this.data.sellerId);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  loadPageData(id, sellerId) {
    this.setData({
      loading: true,
    });
    const params = {
      isPersonal: '1',
      sellerId,
      id,
    };
    app.getApi('/at/detail', params).then((res) => {
      this.setData({
        album: res.data.album,
        albumAvailable: res.data.album.slice(0, 4),
        authInfo: res.data.authInfo,
        loading: false,
        detailDesc: res.data.detailDesc,
        category: res.data.category,
        platform: res.data.platform,
        dnames: res.data.dnames,
        nickName: res.data.nickName,
        address: res.data.address,
        authInfo: res.data.authInfo,
        baseInfo: res.data.baseInfo,
        logo: res.data.logo,
        goods: res.data.goods,
        address: res.data.address,
        detailDescShow:
          res.data.detailDesc.length > 10
            ? res.data.detailDesc.substr(0, 10) + '...'
            : res.data.detailDesc,
        anchorId: res.data.id,
        anchor: res.data,
      });
    });
  },

  navigateToCompany(e) {
    const { edit } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/user/companyInfo/companyInfo?edit=${edit}`,
    });
  },

  navigateToAnchor(e) {
    const { edit } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/user/userInfo/userInfo?edit=' + edit,
    });
  },

  onEditAnchor(e) {
    wx.navigateTo({
      url: '/pages/user/anchorAdd/anchorAdd?edit=true',
    });
  },

  onDeleteAnchor(e) {
    Dialog.confirm({
      title: '确定删除吗？',
      message: ' ',
    }).then(() => {
      app.getApi('/at/delete', { id: this.data.anchor.id }).then((res) => {
        // const pages = getCurrentPages();
        // const prevPage = pages[pages.length - 2];
        // prevPage.setData({
        //   anchors: {
        //     currentPage: 0,
        //     data: [],
        //     info: '',
        //     isMore: 1,
        //     status: 1,
        //   },
        // });
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
});
