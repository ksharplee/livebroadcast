// pages/anchor/company/company.js
const app = getApp()

app.create(app.store,{

  /**
   * 页面的初始数据
   */
  data: {
    device: null,
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 24px;color:#666'
      },
      children: [{
        type: 'text',
        text: '义乌银奕传媒有限公司成立于2017年。是一家综合性企业。为各大企业、MCN机构、团队及个人提供主播孵化、主播输出，带货直播、短视频账号孵化、产品集成供应、直播后期服务等。'
      }]
    },
      {
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 24px;color:#666'
        },
        children: [{
        type: 'text',
        text: '公司业务板块分带货直播、主播孵化、账号孵化、账号运营四大板块。'
      }]
      },{
        name: 'div',
        attrs: {
          class: 'div_class',
          style: 'line-height: 24px;color:#666'
        },
        children: [{
        type: 'text',
        text: '公司依托现有的直播团队，为企业提供产品输出变现服务;'
      }]
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '公司'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
