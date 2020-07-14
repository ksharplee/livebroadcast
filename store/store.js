export default {
  data: {
    // shareSellerName: null,
    device: null,
    anchorCate: '',
    // userInfo: wx.getStorageSync('userInfo') || {
    //   roleId: '2',
    // },
    userInfo: null,
    categories: [],
    companyBanner: [],
    // anchors: [
    // ],
    // addrInfo: null,
    // motto: '通用订货系统',
    // login: {
    //   mobile: '',
    // },
    // tags: null,
    // noticeList: { 'item': [], 'page': 1, 'isMore': false, 'noticeTotal': 0 },//公告列表
    // bankList:null,
    // paymentList:{},
    // sectionList: {},//部门列表
    // userList: { 'item': [], 'page': 1, 'isMore': false, 'buyerTotal': 0 },//客户
    // userLevelList: [],
    // userAddressList: {},
    // gradeName: '',
    // sysInfo: {},
    // adminList: { 'item': [], 'page': 1, 'isMore': false, 'adminTotal': 0 }, //员工类表
    // supplierList: { 'item': [], 'page': 1, 'isMore': false, 'adminTotal': 0 }, //线下供应商列表
    // tabbar: ['/pages/index/index', '/pages/order/orderList/orderList', '/pages/user/userList/userList',
    //   '/pages/goods/goodsList/goodsList', '/pages/other/index/index'],
    // goodsInfo: { 'item': [], 'page': 1, 'isMore': false },
    // goodsCollect: { 'item': [], 'page': 1, 'isMore': false },//采购商商品收藏
    // specGoodsInfo: { 'item': [], 'page': 1, 'isMore': false, timeLimit: '' },
    // valetCart: [],
    // selectedSpecGoods: 0,
    // hasShowCart: false,
    // saleCart: [],

    // cateList: [],
    // unitList: [],
    // brandList: [],
    // attrList: [],
    // formData: [],//属性提交数据
    // attrCategoryId: 0,//分类对应的属性
    // supplyerIndex: [],//线下分销商选择
    // buyerInfo: {},//客户详情
    // orderPaymentRecord: [],
    // orderSalePaymentRecord: [],
    // orderList: {
    //   'activityIndex': 0,
    //   'isChang': false,
    //   'changCount': 5,
    //   'changArr': [],
    //   'searchStr': '',
    //   'startTime': null,
    //   'endTime': null,
    //   'dStatus': {
    //     'activeId': '',
    //     'dStatus': 0,
    //     'all': false,
    //     'UnConfirm': false,
    //     'byCancel': false,
    //     'suCancel': false,
    //     'unFinance': false,
    //     'invalid': false,
    //     'UnSend': false,
    //     'unComplete': false,
    //     'complete': false
    //   },
    //   'amontStatus': {
    //     'activeId': '',
    //     'amontStatus': 0,
    //     'all': false,
    //     'unPay': false,
    //     'hasPay': false,
    //     'allPay': false
    //   }
    // },
    // orderAll: { 'item': [], condition: { 'operate': 1, 'sortType': 2 }, 'page': 1, 'isMore': false },
    // orderUnConfirm: { 'item': [], condition: { 'operate': 2, 'sortType': 1 }, 'page': 1, 'isMore': false },
    // orderUnPay: { 'item': [], condition: { 'operate': 3, 'sortType': 1 }, 'page': 1, 'isMore': false },
    // orderUnSend: { 'item': [], condition: { 'operate': 4, 'sortType': 1 }, 'page': 1, 'isMore': false },
    // orderComplete: { 'item': [], condition: { 'operate': 5, 'sortType': 1 }, 'page': 1, 'isMore': false },

    // saleOrderAll: { 'item': [], condition: { 'operate': 1, 'sortType': 2 }, 'page': 1, 'isMore': false },
    // saleSendList: [],

    // orderDetail: null,
    // orderDetailData: null,

    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // logs: [],
    // b: {
    //   arr: [{ name: '数值项目1' }],
    //   //深层节点也支持函数属性
    //   fnTest: function () {
    //     return this.motto.split('').reverse().join('')
    //   }
    // },
    // firstName: 'dntss',
    // lastName: 'zhang',
    // fullName: function () {
    //   return this.firstName + this.lastName
    // },
    // pureProp: 'pureProp',
    // globalPropTest: 'abc', //更改我会刷新所有页面,不需要再组件和页面声明data依赖
    // ccc: { ddd: 1 }, //更改我会刷新所有页面,不需要再组件和页面声明data依赖
    // roleDefault: 0, //默认角色
    // goodsSpecData: {goods:[]} //采购商搜索条形码数据
  },
  globalData: ['globalPropTest', 'ccc.ddd'],
  logMotto: function () {
    console.log(this.data.motto);
  },

  //默认 false，为 true 会无脑更新所有实例
  //updateAll: true
};
