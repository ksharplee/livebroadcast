// pages/user/companyAlbum/companyAlbum.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    userInfo: null,
    submitting: false,
    imgWidth: 140
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    const prevData = prevPage.data; //取上页data里的数据也可以修改
    this.setData({
      files: prevData.album.map((item) => {
        return {
          path: item.image,
          status: 'done',
          message: '',
        };
      }),
      imgWidth: (this.store.data.device.windowWidth - 15 - 30) / 2,
      anchorId: prevData.anchorId ? prevData.anchorId : '0',
    });
    if (options.isPersonal === '1') {
      wx.setNavigationBarTitle({
        title: '相册',
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

  oversize(e) {
    wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  },

  afterRead(e) {
    const { file } = e.detail;
    const that = this;
    const status = `files[${this.data.files.length}].status`;
    const message = `files[${this.data.files.length}].message`;
    const path = `files[${this.data.files.length}].path`;
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
    console.log('函数: deleteImg -> e', e);
    const { index } = e.detail;
    const arr = this.data.files;
    arr.splice(index, 1);
    this.setData({ files: arr });
  },

  onSubmit(e) {
    this.setData({
      submitting: true,
    });
    const params = this.data.files.map((item) => {
      return {
        image: item.path,
        anchorId: this.data.anchorId,
        sellerId: this.store.data.userInfo.sellerId,
      };
    });
    app
      .getApi('/at/anchorImageEdit', {
        album: JSON.stringify(params),
        anchorId: this.data.anchorId,
        sellerId: this.store.data.userInfo.sellerId,
      })
      .then((res) => {
        this.setData({
          submitting: false,
        });
        // const pages = getCurrentPages();
        // const prevPage = pages[pages.length - 2]; //上一页
        wx.showToast({ title: '提交成功' });
        wx.navigateBack({
          // success: () => {
          //   if (this.data.anchorId) {
          //     prevPage.setData({
          //       album: params,
          //       albumAvailable: params.slice(0, 4),
          //     });
          //   }
          // },
        });
        // const pages = getCurrentPages();
        // const prevPage = pages[pages.length - 2]; //上一页
        // const album = this.data.files.map((item) => {
        //   return {
        //     image: item.path,
        //   };
        // });
        // prevPage.setData({
        //   album,
        //   albumAvailable: album.slice(0, 3),
        // });
      })
      .catch((err) => {
        this.setData({
          submitting: false,
        });
      });
  },
});
