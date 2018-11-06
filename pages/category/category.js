const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainDifficulties: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];
    this.setData({
      trainDifficulties: [].concat(trainToday.trainDifficulties),
    })
    console.log(trainToday);
  },

})