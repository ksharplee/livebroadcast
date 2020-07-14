// pages/user/anchorProductAdd/anchorProductAdd.js
const app = getApp()

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    goodName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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

  oversize(e) {
    wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  },

  afterRead(e) {
    console.log('函数: afterRead -> e', e);
    const { file } = e.detail;
    const that = this;
    const status = `files[0].status`;
    const message = `files[0].message`;
    const path = `files[0].path`;
    this.setData({ [status]: 'uploading', [message]: '上传中' });
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/u/upload_img',
      filePath: file.path,
      name: 'file',
      header: {
        'Content-Type': 'multipart/form-data',
      },
      formData: { dir: 'other' },
      success(res) {
        const data = JSON.parse(res.data);
        // 上传完成需要更新 fileList
        that.setData({
          [path]: data.picPath,
          [status]: 'done',
          [message]: '上传成功',
        });
      },
    });
  },

  deleteImg(e) {
    this.setData({ files: [] });
  },

  onChangeInput(e) {
    this.setData({
      goodName: e.detail,
    });
  },

  saveGoods(e) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    const arr = prevPage.data.goods;
    arr.push({
      goodName: this.data.goodName,
      goodImage: this.data.files[0].path,
    });
    prevPage.setData({
      goods: arr,
    });
    wx.navigateBack()
  },
});
