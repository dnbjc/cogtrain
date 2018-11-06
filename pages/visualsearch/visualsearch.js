var util = require('../../utils/util.js');

Page({

  data: {
    // 网格的序号
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    //网格中显示的
    pictures: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'd1', 'd2', 'd3', 'a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'd1', 'd2', 'd3'],
    // 是否显示
    items: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // 是否目标
    targets: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0],
    //显示判断结果
    targetNo: 0,
    correctCount: 0,
    trialCount: 0,
    entry: 1,
    startTime: 0,
    endTime: 0,
  },

  initial: function () {
    //初始化的字母顺序
    var itemShape = ['a', 'b', 'c', 'd'];
    var itemColor = ['1', '2', '3'];
    var pictures = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'd1', 'd2', 'd3', 'a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3', 'd1', 'd2', 'd3'];
    var items = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var targets = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0];
    var targetNo;

    itemShape = util.shuffle(itemShape);
    itemColor = util.shuffle(itemColor);

    targets = util.shuffle(targets);

    //console.log('itemShape: ', itemShape);
    //console.log('itemColor: ', itemColor);
    console.log('targets: ', targets);

    for (var i = 0; i < 24; i++)
      switch (targets[i]) {
        case 0:
          items[i] = 0;
          pictures[i] = 'cover';
          break;
        case 1:
          items[i] = 1;
          pictures[i] = itemShape[0] + itemColor[0];
          break;
        case 2:
          items[i] = 1;
          pictures[i] = itemShape[1] + itemColor[0];
          break;
        case 3:
          items[i] = 1;
          pictures[i] = itemShape[2] + itemColor[0];
          break;
        case 4:
          items[i] = 1;
          pictures[i] = itemShape[0] + itemColor[1];
          break;
        case 5:
          items[i] = 1;
          pictures[i] = itemShape[1] + itemColor[1];
          break;
        case 6:
          items[i] = 1; targetNo = i;
          pictures[i] = itemShape[2] + itemColor[1];
      }

    //console.log("items: ", items);
    //console.log("Pictures: ", pictures);

    this.setData({
      pictures: [].concat(pictures),
      targets: [].concat(targets),
      targetNo: targetNo,
      items: [].concat(items),
    })

  },

  finishTrain: function () {
    this.setData({
      endTime: Date.parse(new Date()) / 1000,
    })

    var accuracy = this.data.correctCount;
    var rt = this.data.endTime - this.data.startTime;
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];
    var score = 100 / (rt / accuracy) + 50;

    trainToday.trainedToday = true;
    var times = trainToday.trainTimes[3] - trainToday.trainRecords[0];
    if (times == 0)
      trainToday.trainScores[3] = Math.floor(score);
    else
      trainToday.trainScores[3] = Math.floor((trainToday.trainScores[3] * times + score) / (times + 1));

    if (trainToday.trainRecords[3] > 0)
      trainToday.trainRecords[3]--;

    wx.setStorageSync('trainHistory', getApp().globalData.trainHistory);

    if (this.data.entry == 1)
      wx.showModal({
        content: '训练结束。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: "../index/index",
            })
          }
        }
      });
    else
      wx.showModal({
        content: '训练结束。',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: "../category/category",
            })
          }
        }
      });
  },


  btn_click: function (event) {
    var response = event.currentTarget.id;
    var targetNo = this.data.targetNo;
    console.log("start click ............................");

    console.log("response", response);
    console.log("targetNo", this.data.targetNo);

    this.setData({
      items: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    })

    if (response == targetNo) {
      this.setData({
        trialCount: this.data.trialCount + 1,
        correctCount: this.data.correctCount + 1
      })
    } else {
      this.setData({
        trialCount: this.data.trialCount + 1,
      })
      wx.showToast({
        image: '../../images/wrong.png',
        title: "错误",
        duration: 500,
      })
    };

    console.log("您现在做了" + this.data.trialCount + "次试验")
    if (this.data.trialCount < 10) {
      setTimeout(function () {
        this.initial();
      }.bind(this), 500);
      this.setData({
        haltClick: true,
      })
    } else
      this.finishTrain();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      entry: Number(options.entry),
      startTime: Date.parse(new Date()) / 1000
    })
    this.initial();
  },


  showInstruction: function () {
    wx.showModal({
      content: '屏幕上出现一些不同形状和颜色的图形，但是只有一个与其他图形都不一样（形状和颜色的组合唯一），请找出这个图形。',
      showCancel: false,
    });
  },

})