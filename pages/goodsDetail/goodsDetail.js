// pages/goodsDetail/goodsDetail.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    device: wx.getSystemInfoSync(),
    userInfo: null,
    url: {
      desc: '/g/detail',
      collectUrl: '/gc/setGoodsCollect',
      delCollect: '/gc/delGoodsCollect',
      goodsUnit: '/sg/good_goods_unit',
      addToCart: '/c/add',
      registerUrl: '/u/buyerRegister',
      getCode: '/u/getcode'
    },
    goodsId: 0,
    detail: {
    },
    showOp: '去支付',
    showSpec: false,
    show: false,
    showRegister: false,
    currentIndex: -1,
    units: [],
    cartDetail: [],
    registerData: {},
    codeDisabled: false,
    currentTime: 60,
    time: '获取验证码',
    timer: '',
    saleCart: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      const sellerId = scene.split('&')[0]
      const goodsId = scene.split('&')[1]
      this.getGoodsDesc(goodsId, sellerId);
    } else if (options && options.goodsId && options.sellerId) {
      this.getGoodsDesc(options.goodsId, options.sellerId);
    } else {
      app.showErrorMessage('商品ID、供应商ID异常');
    }
    if (!app.globalData.sessionId) {
      app.getSessionId();
    }
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
  },

  setImageSize(e) {
    const index = e.currentTarget.dataset.index;
    const width = `detail.images[${index}].width`;
    const height = `detail.images[${index}].height`;
    this.setData({
      [width]: e.detail.width,
      [height]: e.detail.height,
    })
  },

  getGoodsDesc: function (goodsId, sellerId = 0) {
    app.getApi(this.data.url.desc, { id: goodsId, sellerId: sellerId }).then(res => {

      let detail = [];

      for (let i = 0; i < res.data.detail.length; i++) {
        if (res.data.detail[i].buNumber != '0') {
          let singleDetail = {
            goodDetailId: res.data.detail[i].id,
            buUnitId: res.data.detail[i].buUnitId,
            packeNum: res.data.detail[i].packeNum,
            buNumber: res.data.detail[i].buNumber
          }
          detail[res.data.detail[i].id] = singleDetail;
        }
      }
      this.setData({
        cartDetail: detail,
        detail: res.data,
        goodsId: goodsId,
        moq: res.data.moq,
        sellerId: sellerId,
        goodsId: goodsId
      })

    })

  },

  showSpec: function () {

    let detail = this.data.detail.detail;
    let units = this.data.detail.units;
    for (let i = 0; i < detail.length; i++) {
      if (detail[i].buNumber == 0) {
        detail[i].buUnitId = this.data.detail.unitId;
        detail[i].packeNum = 1;
        detail[i].buNumber = 0;
      }
    }
    this.setData({
      showSpec: true,
      units: units,
      'detail.detail': detail
    })


  },
  showUnit: function (e) {

    this.setData({
      show: true,
      currentIndex: e.currentTarget.dataset.index
    })
  },
  jumpToPage() {
    const pages = getCurrentPages();
    if(pages.length<2){
      wx.navigateTo({
        url: '/pages/sellerGoods/sellerGoods?sellerId=' + this.data.detail.sellerId,
      })
      return false;
    }
    if (pages[pages.length - 2].route === 'pages/index/index') {
      wx.redirectTo({
        url: '/pages/sellerGoods/sellerGoods?sellerId=' + this.data.detail.sellerId,
      })
    } else if (pages[pages.length - 2].route === 'pages/sellerGoods/sellerGoods') {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onClose: function () {
    this.setData({
      showSpec: false
    })
  },
  onShareAppMessage: function (e) { //分享
    if (e.from == 'button') {
      var dataInfo = e.target.dataset;
      return {
        title: this.data.detail.dnames,
        imageUrl: this.data.detail.images[0].image,
        path: 'pages/goodsDetail/goodsDetail?sellerId=' + this.data.sellerId + '&goodsId=' + this.data.goodsId
      }
    }
  },

  returnPage() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  wxpay:function(){
    let detail = this.data.detail
    let params = {
      openId: app.globalData.openId,
      price:detail.minPrice,
      dnames:detail.dnames
    }

console.log(params);
    let that = this;
    app.getApi('/p/pay',params).then(res=>{
      var data = res.data;
      wx.requestPayment({
        'timeStamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        'success': function (res) {
          // app.getApi('/p/response', { orderId: data.orderId}).then(res=>{

          // })
          that.setData({
            showOp:'已支付'
          })
        },
        'fail': function (res) {
        }
      })
    })
  }

})
