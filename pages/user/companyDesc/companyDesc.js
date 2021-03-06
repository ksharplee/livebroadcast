// pages/user/anchorDesc/anchorDesc.js
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    desce: '',
    // formats: {},
    // readOnly: false,
    // placeholder: '开始输入...',
    // editorHeight: 300,
    // keyboardHeight: 0,
    // isIOS: false,
    // editorCtx: '',
    submitting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一页
    this.setData({
      desce: prevPage.data.desce,
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
      desce: e.detail.value,
    });
  },

  // readOnlyChange() {
  //   this.setData({
  //     readOnly: !this.data.readOnly,
  //   });
  // },

  // updatePosition(keyboardHeight) {
  //   const toolbarHeight = 50;
  //   const { windowHeight, platform } = wx.getSystemInfoSync();
  //   let editorHeight =
  //     keyboardHeight > 0
  //       ? windowHeight - keyboardHeight - toolbarHeight
  //       : windowHeight;
  //   this.setData({ editorHeight, keyboardHeight });
  // },

  // calNavigationBarAndStatusBar() {
  //   const systemInfo = wx.getSystemInfoSync();
  //   const { statusBarHeight, platform } = systemInfo;
  //   const isIOS = platform === 'ios';
  //   const navigationBarHeight = isIOS ? 44 : 48;
  //   return statusBarHeight + navigationBarHeight;
  // },

  // onEditorReady() {
  //   const that = this;
  //   const pages = getCurrentPages();
  //   const prevPage = pages[pages.length - 2]; //上一页
  //   wx.createSelectorQuery()
  //     .select('#editor')
  //     .context(function (res) {
  //       that.editorCtx = res.context;
  //       that.editorCtx.setContents({
  //         html: prevPage.data.desce,
  //       });
  //     })
  //     .exec();
  // },

  // blur() {
  //   this.editorCtx.blur();
  // },

  // format(e) {
  //   let { name, value } = e.target.dataset;
  //   if (!name) return;
  //   // console.log('format', name, value)
  //   this.editorCtx.format(name, value);
  // },

  // onStatusChange(e) {
  //   console.log('函数: onStatusChange -> e', e);
  //   const formats = e.detail;
  //   this.setData({ formats });
  // },

  // insertDivider() {
  //   this.editorCtx.insertDivider({
  //     success: function () {
  //       console.log('insert divider success');
  //     },
  //   });
  // },

  // clear() {
  //   this.editorCtx.clear({
  //     success: function (res) {
  //       console.log('clear success');
  //     },
  //   });
  // },

  // removeFormat() {
  //   this.editorCtx.removeFormat();
  // },

  // insertDate() {
  //   const date = new Date();
  //   const formatDate = `${date.getFullYear()}/${
  //     date.getMonth() + 1
  //   }/${date.getDate()}`;
  //   this.editorCtx.insertText({
  //     text: formatDate,
  //   });
  // },

  // insertImage() {
  //   const that = this;
  //   wx.chooseImage({
  //     count: 1,
  //     success: function (res) {
  //       // console.log("函数: insertImage -> res", res)
  //       // if (res.tempFilePaths) {

  //       // }
  //       wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  //       wx.uploadFile({
  //         url: app.globalData.baseUrl + '/u/upload_img',
  //         filePath: res.tempFilePaths[0],
  //         name: 'file',
  //         header: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //         formData: { dir: 'other' },
  //         success(res) {
  //           const data = JSON.parse(res.data);
  //           that.editorCtx.insertImage({
  //             src: data.picPath,
  //             data: {
  //               id: 'abcd',
  //               role: 'god',
  //             },
  //             width: '80%',
  //             success: function () {
  //               // console.log('insert image success');
  //             },
  //           });
  //         },
  //       });

  //     },
  //   });
  // },

  // onEditorInput(e) {
  //   const { html } = e.detail;
  //   this.setData({
  //     editorCtx: html,
  //   });
  // },

  onSubmit(e) {
    this.setData({ submitting: true });
    app
      .getApi('/s/setCompanyInfo', {
        seller: JSON.stringify({
          desce: this.data.desce,
        }),
        id: this.store.data.userInfo.sellerId,
        roleId: '8',
      })
      .then((res) => {
        this.setData({ submitting: false });
        wx.showToast({ title: '提交成功' });
        wx.navigateBack();
      })
      .catch(() => {
        this.setData({ submitting: false });
      });
  },
});
