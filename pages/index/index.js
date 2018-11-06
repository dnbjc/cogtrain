//获取应用实例，用到app.js里面定义的GlobalData
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHistory: 0,
    trainNames: [],
    trainRecords: [],
    trainWord: "开始今日训练",
  },

  onShow: function (options) {
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length-1];
    this.setData({
      trainNames: [].concat(trainToday.trainNames),
      trainRecords: [].concat(trainToday.trainRecords),
    })
    console.log(trainToday);
    if (!trainToday.trainedToday)
      this.setData({
        trainWord: "开始今日训练"
      })
    else
      this.setData({
        trainWord: "继续今日训练"
      })
  },

  btnStartTraining: function () {
    var i = 0;
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];

    while ((trainToday.trainRecords[i] == 0) && (i < trainToday.trainRecords.length)) console.log(i++);

    console.log(i);

    if (i < trainToday.trainRecords.length)
      wx.navigateTo({
        url: trainToday.trainTasks[i] + '?nValue=' + trainToday.trainDifficulties[i] + '&entry=1',
      })
    else
      wx.showModal({
        content: '已完成今日训练，如需继续训练，请点击分类中的具体训练项目',
        showCancel: false,
      });
  },

  btnScores: function () {
    wx.navigateTo({
      url: '../scores/scores',
    })
  },

  showData: function () {
    console.log("Hello?");
    wx.navigateTo({
      url: '../showData/showData',
    })
  }

})