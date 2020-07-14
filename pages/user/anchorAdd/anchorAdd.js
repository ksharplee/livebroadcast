// pages/user/anchorAdd/anchorAdd.js
const app = getApp();
import { validation } from '../../../utils/validate.js';

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    files: [],
    dnames: '',
    nickName: '',
    platform: [
      {
        platformName: '',
        fanCount: '',
      },
    ],
    goods: [],
    detailDesc: '',
    category: '',
    address: '',
    submitting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.edit) {
      wx.setNavigationBarTitle({
        title: '编辑主播'
      });
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      const anchor = prevPage.data.anchor;
      this.setData({
        edit: true,
        id: anchor.id,
        platform: JSON.parse(JSON.stringify(anchor.platform)),
        nickName: anchor.nickName,
        dnames: anchor.dnames,
        goods: anchor.goods,
        category: anchor.category,
        detailDesc: anchor.detailDesc,
        address: anchor.address,
        files: [
          {
            path: anchor.logo,
          },
        ],
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

  changeInput(e) {
    const target = e.currentTarget.dataset.target;
    this.setData({
      [target]: e.detail,
    });
  },

  onBlur(e) {
    const { target, name, rules, params } = e.currentTarget.dataset;
    this.validateInput({ target, rules, v: e.detail.value, name, params });
  },

  validateInput(target) {
    this.setData({
      [`${target.target}Errors`]: validation(
        target.rules.split('|'),
        target.v,
        target.name,
        target.params
      ),
    });
    return !this.data[`${target.target}Errors`].length;
  },

  validateImage() {
    if (this.data.files.length && this.data.files[0].path) {
      return true;
    } else {
      wx.showToast({
        title: '请选择主播照片',
      });
      return false;
    }
  },

  validateName() {
    const v = this.validateInput({
      target: 'dnames',
      rules: 'required',
      v: this.data.dnames,
      name: '姓名',
    });
    if (!v) {
      this.scrollDown('#dnames');
    }
    return v;
  },

  validateNickName() {
    const v = this.validateInput({
      target: 'nickName',
      rules: 'required',
      v: this.data.nickName,
      name: '昵称',
    });
    if (!v) {
      this.scrollDown('#nickName');
    }
    return v;
  },

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
    if (
      this.validateName() &&
      this.validateNickName() &&
      this.validateImage()
    ) {
      this.setData({
        submitting: true,
      });
      const params = {
        addType: 0,
        dnames: this.data.dnames,
        nickName: this.data.nickName,
        detailDesc: this.data.detailDesc,
        platform: JSON.stringify(
          this.data.platform.filter(
            (item) => item.platformName && item.fanCount
          )
        ),
        address: this.data.address,
        category: this.data.category,
        logo: this.data.files[0].path,
        goods: JSON.stringify(
          this.data.goods.filter((item) => item.goodName && item.goodImage)
        ),
      };
      if (this.data.edit) {
        params.id = this.data.id;
        app
          .getApi('/at/edit', params)
          .then((res) => {
            this.setData({
              submitting: false,
            });
            // const pages = getCurrentPages();
            // const prevPage = pages[pages.length - 2];
            // prevPage.setData({
            //   ['anchor.platform']: this.data.platform,
            //   ['anchor.nickName']: this.data.nickName,
            //   ['anchor.dnames']: this.data.dnames,
            //   ['anchor.goods']: this.data.goods,
            //   ['anchor.category']: this.data.category,
            //   ['anchor.detailDesc']: this.data.detailDesc,
            //   ['anchor.address']: this.data.address,
            //   ['anchor.logo']: this.data.files[0].path,
            // });
            wx.navigateBack({
              success: () => {
                wx.showToast({
                  title: '编辑成功',
                });
                // if (prevPage.route === '/pages/anchor/detail/detail') {
                //   prevPage.loadPageData();
                // }
              },
            });
          })
          .catch((err) => {
            this.setData({
              submitting: false,
            });
          });
      } else {
        app
          .getApi('/at/add', params)
          .then((res) => {
            wx.showToast({ title: '添加成功' });
            this.setData({
              submitting: false,
            });
            wx.navigateBack({
              success: () => {
                wx.showToast({
                  title: '添加成功',
                });
              },
            });
          })
          .catch((err) => {
            this.setData({
              submitting: false,
            });
          });
      }
    }
  },
});
