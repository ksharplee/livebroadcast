// pages/user/companyInfo/companyInfo.js
import { validation } from '../../../utils/validate.js';
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    add: false,
    idFront: [],
    idBack: [],
    dnames: '',
    nickName: '',
    mobile: '',
    idCode: '',
    code: '',
    address: '',
    codeText: '发送验证码',
    isPersonal: '1',
    codeErrors: [],
    mobileErrors: [],
    disabledCode: false,
    showDialog: false,
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
    if (options.edit === 'add') {
      wx.setNavigationBarTitle({
        title: '个人资料',
      });
      this.setData({
        add: true,
      });
    } else {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      const authInfo = prevPage.data.authInfo;
      const baseInfo = prevPage.data.baseInfo;
      this.setData({
        idFront: authInfo.frontIdCard ? [{ path: authInfo.frontIdCard }] : [],
        idBack: authInfo.backIdCard ? [{ path: authInfo.backIdCard }] : [],
        email: baseInfo.email,
        mobile: baseInfo.mobile,
        dnames: prevPage.data.dnames,
        nickName: prevPage.data.nickName,
        files: [{ path: prevPage.data.logo }],
        idCode: baseInfo.idCode,
        address: prevPage.data.address ? prevPage.data.address : '',
        platform: prevPage.data.platform.length
          ? JSON.parse(JSON.stringify(prevPage.data.platform))
          : [
              {
                platformName: '',
                fanCount: '',
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

  onCancleDialog(e) {
    this.setData({
      showDialog: false,
      codeText: '发送验证码',
      disabledCode: false,
    });
  },

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

  validateMobile() {
    const v = this.validateInput({
      target: 'mobile',
      rules: 'required|mobile',
      v: this.data.mobile,
      name: '手机号码',
    });
    if (!v) {
      this.scrollDown('#mobile');
    }
    return v;
  },

  validateCode() {
    const v = this.validateInput({
      target: 'code',
      rules: 'required',
      v: this.data.code,
      name: '验证码',
    });
    if (!v) {
      this.scrollDown('#code');
    }
    return v;
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

  countDown() {
    let timeo = 60;
    const timeStop = setInterval(() => {
      timeo -= 1;
      if (timeo > 0) {
        this.setData({
          codeText: `请${timeo}秒后重新获取`,
        });
      } else {
        clearInterval(timeStop); // 停止定时器
        this.setData({
          codeText: '发送验证码',
          disabledCode: false,
        });
      }
    }, 1000);
  },

  getVerifyCodeLocal(e) {
    if (this.validateMobile()) {
      this.setData({
        disabledCode: true,
        codeText: '正在发送...',
      });
      app
        .getApi('/s/getCode.html', { mobile: this.data.mobile })
        .then((res) => {
          if (res.info == '手机号码已存在') {
            this.setData({
              showDialog: true,
              disabled: false,
              codeText: '发送验证码',
              exsitInfo: res.data.data,
            });
          } else {
            wx.showToast({
              title: '验证码已发送',
              icon: 'success',
            });
            this.countDown();
          }
        })
        .catch(() => {
          this.setData({
            codeText: '再次发送',
            disabledCode: false,
          });
        });
    }
  },

  onConfirmDialog(e) {
    app
      .getApi('/s/checkCode', { code: this.data.code, mobile: this.data.mobile })
      .then((res) => {
        const data = this.data.exsitInfo;
        const profile = data.profileInfo;
        this.setData({
          showDialog: false,
          disabled: false,
          codeText: '发送验证码',
          disabledCode: false,
          dnames: profile.length && profile[0].dnames ? profile[0].dnames : '',
        });
        this.validateName();
      })
      .catch((err) => {
        that.setData({
          showDialog: false,
          disabledCode: false,
        });
      });
  },

  afterRead(e) {
    const { file } = e.detail;
    const that = this;
    const { target } = e.currentTarget.dataset;
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
        const arr = [{ path: data.picPath }];
        that.setData({ [target]: arr });
      },
    });
  },

  removeImg(e) {
    const { target } = e.currentTarget.dataset;
    this.setData({ [target]: [] });
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

  scrollDown(target) {
    wx.pageScrollTo({
      selector: target,
      duration: 300,
    });
  },

  oversize(e) {
    wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  },

  // afterRead(e) {
  //   console.log('函数: afterRead -> e', e);
  //   const { file } = e.detail;
  //   const that = this;
  //   const status = `files[0].status`;
  //   const message = `files[0].message`;
  //   const path = `files[0].path`;
  //   this.setData({ [status]: 'uploading', [message]: '上传中' });
  //   // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  //   wx.uploadFile({
  //     url: app.globalData.baseUrl + '/u/upload_img',
  //     filePath: file.path,
  //     name: 'file',
  //     header: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //     formData: { dir: 'other' },
  //     success(res) {
  //       const data = JSON.parse(res.data);
  //       // 上传完成需要更新 fileList
  //       that.setData({
  //         [path]: data.picPath,
  //         [status]: 'done',
  //         [message]: '上传成功',
  //       });
  //     },
  //   });
  // },

  deleteImg(e) {
    this.setData({ files: [] });
  },

  onSubmit(e) {
    if (this.validateName() && this.validateMobile() && this.validateImage()) {
      this.setData({
        submitting: true,
      });
      const params = {
        openId: app.globalData.openId,
        dnames: this.data.dnames,
        nickName: this.data.nickName,
        mobile: this.data.mobile,
        address: this.data.address,
        idCode: this.data.idCode,
        frontIdCard: this.data.idFront[0] ? this.data.idFront[0].path : '',
        backIdCard: this.data.idBack[0] ? this.data.idBack[0].path : '',
        isPersonal: '1',
        logo: this.data.files[0].path,
        platform: JSON.stringify(
          this.data.platform.filter(
            (item) => item.platformName && item.fanCount
          )
        ),
      };
      if (this.data.add) {
        if (this.validateCode()) {
          params.code = this.data.code;
            app
              .getApi('/s/add', params)
              .then((res) => {
                this.store.data.userInfo = res.data;
                this.update();
                this.setData({
                  submitting: false,
                });
                wx.navigateBack({
                  success: () => {
                    wx.showToast({ title: '添加成功' });
                  },
                });
              })
              .catch((err) => {
                this.setData({
                  submitting: false,
                });
              });
        } else {
          this.setData({
            submitting: false,
          });
        }
      } else {
        const pages = getCurrentPages();
        const prevPage = pages[pages.length - 2]; //上一页
        params.id = prevPage.data.anchorId;
        app
          .getApi('/at/edit', params)
          .then((res) => {
            this.setData({
              submitting: false,
            });
            wx.navigateBack({
              success: () => {
                wx.showToast({ title: '添加成功' });
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
