var util = require('/utils/util.js');

App({
  globalData: {
    trainHistory: [],
  },

  //如果是新用户，初始化训练设置，包括当天日期、任务列表、每个任务训练次数、每个任务难度并加进trainHistory
  initialTrain: function () {
    console.log('initiating user record...');
    var trainHistory = [];

    // 创建保存一条缓存的结构体
    var trainToday = {
      //训练日期
      trainDate: util.formatDate(new Date()),
      //任务名字
      trainNames: ['记忆力', '控制力', '视空间', '注意力'],
      //任务列表
      trainTasks: ['../nbackMemory/nbackMemory', '../STROOP/stroop', '../PAL/PAL', '../visualsearch/visualsearch'],
      //当天任务训练次数
      trainRecords: [2, 2, 2, 2],
      //训练总次数
      trainTimes: [2, 2, 2, 2],
      //各任务难度
      trainDifficulties: [1, 2, 2, 1],
      //各任务得分
      trainScores: [0, 0, 0, 0],
      trainedToday: false,
    }

    trainHistory.push(trainToday);
    wx.setStorageSync('trainHistory', trainHistory);
  },

  //如果是老用户，已经有了之前的缓存，则添加当天训练任务
  addTrain: function (topRecord, today) {
    console.log('add today train...');
    var trainToday = {
      //训练日期
      trainDate: today,
      //任务名字
      trainNames: topRecord.trainNames,
      //任务列表
      trainTasks: topRecord.trainTasks,
      //各任务每天训练次数
      trainRecords: [2, 2, 2, 2],
      //训练总次数
      trainTimes: [2, 2, 2, 2],
      //各任务难度
      trainDifficulties: topRecord.trainDifficulties,
      //各任务得分
      trainScores: topRecord.trainScores,
      trainedToday: false,
    }
    // 更新本地缓存数据
    this.globalData.trainHistory.push(trainToday);
    wx.setStorageSync('trainHistory', this.globalData.trainHistory);
  },

  onLaunch: function () {
    //获取当天日期
    var today = util.formatDate(new Date());
    // 定义addTrain方法的参数topRecord
    var topRecord;

    //wx.clearStorageSync();

    console.log("trainHistory", wx.getStorageSync('trainHistory'));

    //如果本地缓存为空，则为新用户初始化训练设置
    if (wx.getStorageSync('trainHistory') == '')
      this.initialTrain();

    this.globalData.trainHistory = wx.getStorageSync('trainHistory');
    // 获取缓存中最新的一条信息
    topRecord = this.globalData.trainHistory[this.globalData.trainHistory.length - 1];

    //如果训练记录的最后一条记录日期不是今天，则生成今天的训练任务，并加到训练记录中
    if (topRecord.trainDate != today) {
      this.addTrain(topRecord, today);
      console.log('你是老用户' + this.globalData.trainHistory);
    }
    console.log('今天是' + topRecord.trainDate)
  },

  onHide: function () {
    //更新本地缓存的trainHistory
    wx.setStorageSync('trainHistory', getApp().globalData.trainHistory);
  },

})