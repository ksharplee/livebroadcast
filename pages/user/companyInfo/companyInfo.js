// pages/user/companyInfo/companyInfo.js
import { validation } from '../../../utils/validate.js';
const app = getApp();

app.create(app.store, {
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    sellerId: '',
    idFront: [],
    idBack: [],
    businessCode: '',
    idCode: '',
    legalPerson: '',
    sellerName: '',
    businessLicenseImage: [],
    email: '',
    mobile: '',
    code: '',
    codeText: '发送验证码',
    sellerNameErrors: [],
    codeErrors: [],
    mobileErrors: [],
    disabledCode: false,
    showDialog: false,
    submitting: false,
    edit: false,
    disabledCompanyName: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.edit === 'add') {
      wx.setNavigationBarTitle({
        title: '公司资料',
      });
    } else {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      const baseInfo = prevPage.data.baseInfo;
      const authInfo = prevPage.data.authInfo;
      this.setData({
        edit: true,
        sellerId: this.store.data.sellerId,
        businessLicenseImage: authInfo.businessLicenseImage
          ? [{ path: authInfo.businessLicenseImage }]
          : [],
        idFront: authInfo.frontIdCard ? [{ path: authInfo.frontIdCard }] : [],
        idBack: authInfo.backIdCard ? [{ path: authInfo.backIdCard }] : [],
        businessCode: baseInfo.businessCode ? baseInfo.businessCode : '',
        sellerName: baseInfo.companyName,
        email: baseInfo.email,
        mobile: baseInfo.mobile,
        idCode: baseInfo.idCode,
        legalPerson: baseInfo.legalPerson,
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
    const { target, name, rules, params, addition } = e.currentTarget.dataset;
    this.validateInput({ target, rules, v: e.detail.value, name, params });
    if (addition === 'data') {
    }
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
    if (this.data.edit) {
      return true;
    }
    return v;
  },

  validateSellerName() {
    const v = this.validateInput({
      target: 'sellerName',
      rules: 'required',
      v: this.data.sellerName,
      name: '公司名称',
    });
    if (!v) {
      this.scrollDown('#sellerName');
    }
    return v;
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
    const that = this;
    app.getApi('/s/checkCode', { code: this.data.code, mobile: this.data.mobile }).then((res) => {
      const data = this.data.exsitInfo;
      const profile = data.profileInfo;
      const authInfo = data.authInfo;
      console.log("函数: onConfirmDialog -> that", that)
      that.setData({
        disabledCompanyName: true,
        showDialog: false,
        disabled: false,
        codeText: '发送验证码',
        sellerName: data.companyName,
        email: data.email,
        id: data.id,
        legalPerson:
          profile && profile[0].legalPerson ? profile[0].legalPerson : '',
        idCode: profile && profile[0].idCode ? profile[0].idCode : '',
        businessCode:
          profile && profile[0].businessCode ? profile[0].businessCode : '',
        idFront:
          authInfo && authInfo[0] && authInfo[0].frontIdCard
            ? [
                {
                  path: authInfo[0].frontIdCard,
                },
              ]
            : [],
        idBack:
          authInfo && authInfo[0] && authInfo[0].backIdCard
            ? [
                {
                  path: authInfo[0].backIdCard,
                },
              ]
            : [],
        businessLicenseImage:
          authInfo && authInfo[0] && authInfo[0].businessLicenseImage
            ? [
                {
                  path: authInfo[0].businessLicenseImage,
                },
              ]
            : [],
      });
      that.validateSellerName();
    }).catch(err => {
      that.setData({
        disabledCompanyName: false,
        showDialog: false,
        disabledCode: false
      });
    });
  },

  oversize(e) {
    wx.showToast({ title: '上传图片请勿大于4M', icon: 'none' });
  },

  afterRead(e) {
    const { file } = e.detail;
    const that = this;
    console.log('函数: afterRead -> file', file);
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
        console.log('函数: success -> res', res);
        const data = JSON.parse(res.data);
        // 上传完成需要更新 fileList
        const arr = [{ path: data.picPath }];
        console.log('函数: success -> arr', arr);
        that.setData({ [target]: arr });
      },
    });
  },

  removeImg(e) {
    const { target } = e.currentTarget.dataset;
    this.setData({
      [target]: [],
    });
  },

  scrollDown(target) {
    wx.pageScrollTo({
      selector: target,
      duration: 300,
    });
  },

  onSubmit(e) {
    if (
      this.validateSellerName() &&
      this.validateMobile() &&
      this.validateCode()
    ) {
      const params = {
        openId: app.globalData.openId,
        businessCode: this.data.businessCode,
        email: this.data.email,
        sellerName: this.data.sellerName,
        mobile: this.data.mobile,
        code: this.data.code,
        idCode: this.data.idCode,
        legalPerson: this.data.legalPerson,
        businessLicenseImage: this.data.businessLicenseImage[0]
          ? this.data.businessLicenseImage[0].path
          : '',
        frontIdCard: this.data.idFront[0] ? this.data.idFront[0].path : '',
        backIdCard: this.data.idBack[0] ? this.data.idBack[0].path : '',
        isPersonal: '0',
      };
      this.setData({
        submitting: true,
      });
      if (this.data.edit) {
        params.sellerId = this.data.sellerId;
        app
          .getApi('/s/edit', params)
          .then((res) => {
            this.setData({
              submitting: false,
            });
            wx.navigateBack({
              success: () => {
                wx.showToast({ title: '编辑成功' });
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
          .getApi('/s/add', params)
          .then((res) => {
            this.setData({
              submitting: false,
            });
            this.store.data.userInfo = res.data;
            this.update();
            wx.navigateBack({
              success: () => {
                wx.showToast({ title: '编辑成功' });
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
