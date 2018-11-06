Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var trainData = [];
    var count = 0;
    console.log(trainData);
    for (var iter = 0; iter < getApp().globalData.trainHistory.length; iter++) {
      var trainToday = getApp().globalData.trainHistory[iter];
      for (var j = 0; j < 4; j ++) {
        trainData[count++] = trainToday.trainScores[j];
      }
    }
    this.setData({
      trainData: [].concat(trainData),
    })
  },

})