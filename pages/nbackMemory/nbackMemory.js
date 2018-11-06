var util = require('../../utils/util.js');
const app = getApp();

Page({

  data: {
    //需要判断的序列总长度
    totalLength: 10,
    //判断是否连续按键，是的话取消第二个按键
    timeStamp: Date.parse(),
    //中心按钮设为“开始”或者“下一个“
    btnNextName: "开始",
    //相同/不同按钮是否有效
    btnJdDisable: true,
    //中心按钮是否有效
    btnNextDisable: false,
    btnJdType: "default",
    btnNextType: "primary",
    //显示第loopCount个数字
    loopCount: -1,
    //计数正确次数
    correctCount: 0,
    //当前显示数字
    currentItem: "",
    //总数字
    totalItem: 0,
    //nback的n值
    nValue: 1,
    //是否为目标的数组，1为是
    entry: 1,
    //从哪个页面进入
    targetArray: [],
    //出现的数字序列
    itemArray: [],
    startTime: 0,
    endTime: 0,
  },

  //初始化工作
  initial: function () {
    var items = new Array();
    var targets = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
    var previousItem, currentItem;
    var nValue = this.data.nValue;

    //生成目标函数，即0是和第前nValue不同，1是和第前nValue相同
    targets = util.shuffle(targets);
    for (var i = 0; i < nValue; i++)
      targets.push(0);
    targets.reverse();

    //第0-nValue个元素无需判断，因此随机生成
    for (var i = 0; i < nValue; i++) {
      items.push(Math.floor(Math.random() * 10));
    }

    //第nValue之后的元素，需要按情况生成
    for (var i = 0; i < this.data.totalLength; i++)
      //当target=0时，随机生成一个与第前nValue不同的数字
      if (targets[nValue + i] == 0) {
        //non-target
        var cItem = Math.floor(Math.random() * 10);
        while (cItem == items[i])
          cItem = Math.floor(Math.random() * 10);
        items.push(cItem);
      //否则直接生成第前nValue的数字
      } else {
        items.push(items[i]);
      }

    this.setData({
      totalItem: this.data.totalLength + nValue,
      targetArray: [].concat(targets),
      itemArray: [].concat(items),
      loopCount: -1,
      btnJdDisable: true,
      btnNextDisable: false,
      btnNextName: "开始",
      btnJdType: "default",
      btnNextType: "primary",
      timeStamp: Date.parse(new Date()),
      currentItem: "",
      correctCount: 0,
    })
  },

  onLoad: function (options) {
    this.setData({
      nValue: Number(options.nValue),
      entry: Number(options.entry),
    })
    this.initial();
    console.log(this.data.nValue);
  },

  //结束完一次训练
  finishTrain: function () {
    this.setData({
      endTime: Date.parse(new Date()) / 1000,
    })

    var showWords = '';
    var accuracy = this.data.correctCount / this.data.totalLength;
    var rt = this.data.endTime - this.data.startTime;
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];
    var score = 100 / (rt / accuracy) + trainToday.trainDifficulties[0] * 5 + 50;

    trainToday.trainedToday = true;
    var times = trainToday.trainTimes[0] - trainToday.trainRecords[0];
    if (times == 0)
      trainToday.trainScores[0] = Math.floor(score);
    else
      trainToday.trainScores[0] = Math.floor((trainToday.trainScores[0]*times + score) / (times+1));
    
    if (accuracy > 0.9) {
      trainToday.trainDifficulties[0] ++;
      showWords = "提高难度。"
    }
    else if ((accuracy < 0.7) && (trainToday.trainDifficulties[0]>1)) {
      trainToday.trainDifficulties[0] --;
      showWords = "降低难度。"
    }
    else
      showWords = "保持难度。"
    
    if (trainToday.trainRecords[0]>0)
      trainToday.trainRecords[0]--;

    wx.setStorageSync('trainHistory', getApp().globalData.trainHistory);

    if (this.data.entry == 1)
      wx.showModal({
        content: '训练结束，下次实验将' + showWords,
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
        content: '训练结束，下次实验将' + showWords,
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

  //点击判断按钮（不同、相同）
  btnJdClick: function (event) {

    this.setData({
      btnJdDisable: true,
    })

    var newTimeStamp = Date.parse(new Date());
    var jd;

    if (newTimeStamp - this.data.timeStamp >= 1000) {

      this.setData({
        timeStamp: newTimeStamp,
      })

      if (event.currentTarget.id=="yes")
        jd = 1;
      else
        jd = 0;

      //判断是否正确
      if (this.data.targetArray[this.data.loopCount] == jd) 
        this.setData({
          correctCount: this.data.correctCount + 1,
        })
      else
        wx.showToast({
          image: '../../images/wrong.png',  //自定义图标的本地路径，image 的优先级高于 icon  
          title: "错误",
          duration: 500,
        })

      //当前数字移出
      this.setData({
        currentItem: "",
        loopCount: this.data.loopCount + 1,
      })
      
      //当数字未显示完，显示下一数字
      if (this.data.loopCount < this.data.totalItem) 
        setTimeout(function () {
          this.setData({
            currentItem: this.data.itemArray[this.data.loopCount],
            btnNextName: "请判断",
            btnJdDisable: false,
          })
        }.bind(this), 1000)

      //否则打分并继续
      else
        this.finishTrain();
    } 
  },

  //点击开始/下一个按钮
  btnNextClick: function () {

    this.setData({
      btnNextDisable: true
    })

    var newTimeStamp = Date.parse(new Date());

    if (newTimeStamp - this.data.timeStamp >= 1000) {

      //每点一次按钮，下一个数字出现，并禁止按钮
      this.setData({
        timeStamp: newTimeStamp,
        startTime: Date.parse(new Date()) / 1000
      })

      //loopCount=-1时，表示刚开始
      if (this.data.loopCount == -1) {
        //按钮变为“下一个”
        this.setData({
          loopCount: this.data.loopCount + 1,
          btnNextName: "下一个",
        })
        
        //等1秒钟，第一个数字出现
        setTimeout(function () {
          console.log(this.data.loopCount);
          this.setData({
            currentItem: this.data.itemArray[this.data.loopCount],
            btnNextDisable: false
          })
        }.bind(this), 1000)
      }

      //loopCount!=0，表示之前已有数字出现过
      else {
        //将现有的数字移出屏幕
        this.setData({
          currentItem: "",
          loopCount: this.data.loopCount + 1,
        })
        console.log(this.data.loopCount);

        //等待上一数字移出后，移入下一个数字
        setTimeout(function () {
          this.setData({
            currentItem: this.data.itemArray[this.data.loopCount],
          })
          //当出现的数字个数小于nValue时，无需判断，只要按下一个
          if (this.data.loopCount < this.data.nValue)
            this.setData({
              btnNextDisable: false
            })
          //当出现的数字大于等于nValue时，需要判断是否与第前n个相同
          else
            this.setData({
              btnJdDisable: false,
              btnNextName: "请判断",
              btnJdType: "primary",
              btnNextType: "default",
            })
        }.bind(this), 1000)

      }
    }
  },


  showInstruction: function () {
    wx.showModal({
      content: '屏幕上每次出现一个数字，记住此数字，并判断与之前第N个数字是否相同。',
      showCancel: false,
    });
  },

})