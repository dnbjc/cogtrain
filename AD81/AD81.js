// miniprogram/pages/AD8/AD8.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenname:false,
    hiddenname1:true,
    btn_wide: 50,
    // 当前swiper-item的index
    currentTab: 0,
    // swiper卡片的高度
    swiperheight: 0,
    // 定义数组存储题目
    array: [{
      question:'1 判断力出现问题（如做决定困难、错误的财务决定、思考障碍）'
    },{
      question:'2 兴趣减退、爱好改变、活动减少'    
    },{
      question:'3 不断重复同一件事（如总是问同一个问题，讲同一个故事说同一句话）'
      },{
        question: '4 学习使用一些简单的日常工具或家用电器和器械有困难'
      }, {
        question: '5 记不清当前的月份或年份'    
      }, {
        question: '6 处理复杂的个人经济事务有困难（忘了如何对账等）'
      }, {
        question: '7 记不住和别人的约定'
      }, {
        question: '8 日常记忆和思考能力出现问题'}
      ],
    // 定义选项数组
    choice: [
      { choice: '是', value:1 }, 
      { choice: '否', value:0 }
    ],
    score:0,             //定义最终得分
    values:[]            //定义数组存储每个选项的得分值
  },
  nextquestion:function(){
    if (this.data.currentTab < 7) {
      this.setData({
        currentTab: this.data.currentTab + 1,
      })
    } else if (this.data.currentTab = 7) {
      this.setData({
        currentTab: this.data.currentTab,
        hiddenname1:false,
        btn_wide:30
      })
    }
  },
  // 监听上一题按钮的函数，实现页面的转换
  changeitem: function (){
    if(this.data.currentTab>0){
      this.setData({
        currentTab:this.data.currentTab-1,
        hiddenname1:true,
        btn_wide: 50
      })
    }
  },
  //定义监听选项的radiochange函数，实现页面转换和分值记录，监听event携带的选项的value值
  radiochange:function(e){

    // 把选项携带的value值放到values数组中
    this.data.values[this.data.currentTab] = parseInt(e.detail.value)

    // 判断当前是否是最后一页，实现页面转换和最后也的提交
    if(this.data.currentTab<7){
      this.setData({
        // currentTab: this.data.currentTab + 1 ,
        hiddenname:false,
        btn_wide:50
      }) 
    }else if(this.data.currentTab=7){
      this.setData({
        // currentTab: this.data.currentTab,
        hiddenname1:false,
        btn_wide:30
      })
    }
    console.log(this.data.values)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取窗口高度
    var screenheight = wx.getSystemInfoSync().windowHeight
    // var screenwidth=wx.getSystemInfoSync().windowWidth
    // console.log('屏幕的高度为：', screenheight)
    // 设置swiper的高度
    this.setData({
      swiperheight: screenheight * 0.9,
      values:[],
      hiddenname:true,
      hiddenname1:true
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