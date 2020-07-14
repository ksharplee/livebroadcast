//获取应用实例
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logSellerId: 0,
    sellerInfo: [],
    loading: false,
    tagName: 'LABEL',
    tags: null,
    device: null,
    userInfo: null,
    activeTab: 1,
    active: 0,
    display: false,
    sortPrice: false,
    loading: false,
    goodsInfo: [],
    detail: [],
    currentIndex: -1,
    cartDetail: [],
    chooseGoods: {},
    currentGoodsInfo: {
      goodsId: 0,
      dnames: '',
      image: '',
      moq: 1,
    },
    catePage: [],
    cateList: [],
    activeNames: ['1'],
    isMore: 0,
    p: 1,
    searchStr: '',
    sortType: 0,
    showSpec: false,
    showCate: false,
    showTags: false,
    show: false,
    type: 0,
    activeTag: -1,
    registerData: {},
    codeDisabled: false,
    saleCart: null,
    showPopup: false,
  },

  toggleDisplay() {
    this.setData({
      display: !this.data.display,
    });
  },

  showPopup() {
    this.setData({
      showPopup: true,
    });
  },

  hidePopup() {
    this.setData({
      showPopup: false,
    });
  },

  onChangeTab(e) {
    this.setData({
      active: e.detail,
    });
    if (e.detail !== 1) {
      this.setData({
        sortPrice: false,
        sortType: 1,
      });
      this.getGoodsInfo();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let logSellerId = options.sellerId;
    this.setData({
      logSellerId,
    });
    this.getSellerInfo();
    var params = { p: 1 };
    this.getGoodsInfo(params);
  },

  getSellerInfo() {
    app
      .getApi('/sys/sys_info', { logSellerId: this.data.logSellerId, liveCompany:1 })
      .then((res) => {
        this.setData({
          sellerInfo: res.data,
        });
      });
  },

  onChangeTabbar(e) {
    if (e.currentTarget.dataset.index === '1') {
      this.setData({
        sortPrice: !this.data.sortPrice,
        sortStock: false,
        sortType: 1,
      });

      this.getGoodsInfo({
        p: 1,
        orderType: this.data.sortPrice ? 2 : 3,
        searchStr: this.data.searchStr,
      });
    } else {
      this.setData({
        sortStock: !this.data.sortStock,
        sortPrice: false,
        sortType: 2,
      });
      this.getGoodsInfo({
        p: 1,
        orderType: this.data.sortStock ? 0 : 1,
        searchStr: this.data.searchStr,
      });
    }
  },
  getGoodsInfo(params = {}, flag = 0) {
    let goodsInfo = {};
    let that = this;
    this.setData({
      loading: true,
    });
    params.supplyerId = that.data.logSellerId;

    app
      .getApi('/g/lists', params)
      .then((res) => {
        if (flag == 1) {
          goodsInfo.item = that.data.goodsInfo.item.concat(res.data);
        } else {
          goodsInfo.item = res.data;
        }
        goodsInfo.isMore = res.isMore;
        goodsInfo.page = res.currentPage;
        that.setData({
          goodsInfo,
        });

        wx.stopPullDownRefresh();
        // wx.hideLoading();
        this.setData({
          loading: false,
        });
      })
      .catch(() => {
        this.setData({
          loading: false,
        });
      });
  },
  onPullDownRefresh() {
    // 上拉刷新
    let sortFlag = false;
    if (this.data.sortType || this.data.sortStock) {
      sortFlag = true;
    }
    let params = {
      searchStr: this.data.searchStr,
      orderType: !sortFlag
        ? ''
        : this.data.sortType == 1
        ? this.data.sortPrice
          ? 2
          : 3
        : this.data.sortStock
        ? 0
        : 1,
      p: 1,
    };
    this.getGoodsInfo(params);
  },

  onReachBottom: function () {
    //触底刷新
    if (this.data.goodsInfo.isMore) {
      let sortFlag = false;
      if (this.data.sortType || this.data.sortStock) {
        sortFlag = true;
      }

      let params = {
        searchStr: this.data.searchStr,
        orderType: !sortFlag
          ? ''
          : this.data.sortType == 1
          ? this.data.sortPrice
            ? 2
            : 3
          : this.data.sortStock
          ? 0
          : 1,
        p: parseInt(this.data.goodsInfo.page) + 1,
      };
      this.getGoodsInfo(params, 1);
    }
  },

  onSearch: function (e) {
    //确认搜索事件
    let params = {
      searchStr: this.data.searchStr,
      p: 1,
    };
    this.getGoodsInfo(params);
  },

  onChange: function (e) {
    //输入框事件
    this.setData({ searchStr: e.detail });
  },
});
