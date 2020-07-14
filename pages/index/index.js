//index.js
//获取应用实例
const app = getApp();

app.create(app.store, {
  data: {
    tagName: 'LABEL',
    categories: null,
    device: null,
    companyBanner: null,
    userInfo: null,
    activeTab: 1,
    active: 0,
    display: false,
    sortPrice: false,
    sortStock: false,
    loading: false,
    menu: false,
    goodsInfo: {},
    detail: [],
    currentIndex: -1,
    activeNames: ['1'],
    isMore: 0,
    p: 1,
    searchStr: '',
    sortType: 0,
    loading: false,
    type: 0,
    activeTag: -1,
    cateId: '0',
    cateIndex: 0,
    toggleMenu: false,
    subCategories: [],
    subCateIndex: -1,
  },
  onLoad(options) {
    wx.hideHomeButton({
      complete: (res) => {},
    });
    this.loadCategories();
    var params = { p: 1 };
    this.getGoodsInfo(params);
  },

  onShow() {
    if (this.data.menu) {
      this.setData({
        menu: false,
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  toggleDisplay() {
    this.setData({
      display: !this.data.display,
    });
  },

  showMenu() {
    this.setData({
      menu: true,
    });
  },

  hideMenu() {
    this.setData({
      menu: false,
    });
  },

  onChangeTab(e) {
    if (e.detail !== 3) {
      this.setData({
        active: e.detail,
      });
    }
    if (e.detail !== 1 && e.detail !== 2) {
      this.setData({
        sortPrice: false,
        sortType: 1,
      });
      this.getGoodsInfo();
    }
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
    this.setData({
      loading: true,
    });
    if (this.data.cateId && this.data.cateId !== '0') {
      params.cateId = this.data.cateId;
    }
    let goodsInfo = this.data.goodsInfo;
    app
      .getApi('/g/getGoodLists', params)
      .then((res) => {
        if (flag == 1) {
          goodsInfo.item = goodsInfo.item.concat(res.data);
        } else {
          goodsInfo.item = res.data;
        }
        goodsInfo.isMore = res.isMore;
        goodsInfo.page = res.currentPage;

        this.setData({
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
  jumpToPage: function (e) {
    if (app.globalData.jumpBack) {
      wx.navigateBackMiniProgram(); //回跳到上一个小程序
    } else {
      wx.navigateToMiniProgram({
        appId: 'wx5efdf9a130d894ad',
        envVersion: 'release', //develop 开发板  trial：体验版  release：正式版
        fail: function (res) {
          app.showErrorMessage('已取消');
        },
      });
    }
  },

  navitageTo() {
    wx.navigateTo({
      url: '/pages/anchor/list/list',
      // url: '/pages/broadCast/broadCast',
    });
  },

  noop() {},

  switchToCompany() {
    wx.switchTab({
      url: '/pages/anchor/list/list',
    });
  },

  loadCategories() {
    app.getApi('/c/lists').then((res) => {
      this.store.data.categories = res.data.length ? res.data : [];
      this.update();
    });
  },

  getGoodsByCate(e) {
    const { id, index } = e.currentTarget.dataset;
    // if (id !== '0') {
    //   this.setData({
    //     showCate: true,
    //   });
    // } else {
    //   this.setData({
    //     showCate: false,
    //   });
    // }
    this.setData({
      cateId: id,
      cateIndex: index + 1,
      subCategories:
        id === '0'
          ? []
          : this.data.categories[index].child
          ? this.data.categories[index].child.slice(0, 9)
            : [],
      subCateIndex: -1
    });
    this.getGoodsInfo();
    wx.pageScrollTo({
      duration: 0,
      scrollTop: 0,
    });
  },

  getGoodsBySubCate(e) {
    const { id, index } = e.currentTarget.dataset;
    if (id !== this.data.cateId) {
      this.setData({
        showCate: false,
        cateId: id,
        subCateIndex: +index,
      });
      // subCategories: [],
      this.getGoodsInfo();
    }
  },

  hideCate(e) {
    this.setData({
      showCate: false,
    });
  },

  toggleMenu(e) {
    if (this.data.toggleMenu) {
      this.jumpToPage();
    }
    this.setData({
      toggleMenu: !this.data.toggleMenu,
    });
  },

  navigateToCategory() {
    wx.navigateTo({
      url: '/pages/category/category?index=' + (this.data.cateIndex - 1),
    });
  },
});
