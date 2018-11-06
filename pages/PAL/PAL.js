var util = require('../../utils/util.js');

Page({

  data: {
    // 显示的网格下标
    grids: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    //数字个数
    itemCount: 4,
    //盖板为0不显示，为1显示
    covers: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //数字为0不显示，为1显示
    targets: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //数字
    numbers: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    //现在判断第items[itemNo]个数字
    itemNo: 0,
    //底部开始按钮是否有效
    btnStartDisable: false,
    //是否可以开始按键判断
    readyForJudge: false,
    animationData: {},
    //正确次数
    correctCount: 0,
    startTime: 0,
    endTime: 0,
  },

  //初始化工作
  initial: function () {
    var covers8 = [0, 0, 0, 0, 0, 0, 0, 0];
    var covers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var items = [];

    //随机生成显示的位置，以及显示数字的顺序
    for (var i=0; i<this.data.itemCount; i++) {
      covers8[i] = 1;
      items[i] = i + 1;
    }
    covers8 = util.shuffle(covers8);
    items = util.shuffle(items);

    //由于九宫格中心一位不会显示被遮盖的数字，因此将covers8中随机过的位置复制到covers里
    //covers数组的长度为9位，其中对应于九宫格中心一位是covers[4]
    for (var i=0; i<4; i++)
      covers[i] = covers8[i];
    for (var i=5; i<9; i++)
      covers[i] = covers8[i-1];
    
    //根据遮盖挡板的位置，生成被遮盖的数字的位置及具体的数字
    for (var i=0, j=0; i<9; i++){
      if (covers[i] == 1)
        numbers[i] = items[j++];
    }

    //再次随机数字的顺序，这个新的顺序是九宫格中间依次出现数字的顺序
    items = util.shuffle(items);

    //初始化赋值
    this.setData({
      items: [].concat(items),
      numbers: [].concat(numbers),
      covers: [].concat(covers),
      targets: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      itemNo: 0,
      btnStartDisable: false,
      readyForJudge: false
    })
  },

  onLoad: function (options) {
    //每次页面导入先进性初始化
    this.setData({
      itemCount: Number(options.nValue),
      entry: Number(options.entry),
    })
    this.initial();
  },

  finishTrain: function () {
    this.setData({
      endTime: Date.parse(new Date()) / 1000
    })

    var accuracy = this.data.correctCount / this.data.itemCount;
    var rt = this.data.endTime - this.data.startTime;
    var showResults = '';
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];
    var score = 100 / (rt / accuracy) + trainToday.trainDifficulties[2] * 5 + 30;

    trainToday.trainedToday = true;
    var times = trainToday.trainTimes[2] - trainToday.trainRecords[2];
    if (times == 0)
      trainToday.trainScores[2] = Math.floor(score);
    else
      trainToday.trainScores[2] = Math.floor((trainToday.trainScores[2] * times + score) / (times + 1));

    if (trainToday.trainRecords[2] > 0)
      trainToday.trainRecords[2]--;

    if ((accuracy == 1) && (trainToday.trainDifficulties[2] < 8)){
      trainToday.trainDifficulties[2]++;
      showResults = '提高难度';
    }
    else if ((accuracy < 0.5) && (trainToday.trainDifficulties[2] > 2)) {
      trainToday.trainDifficulties[2]--;
      showResults = '降低难度';
    }
    else
      showResults = '保持难度';

    wx.setStorageSync('trainHistory', getApp().globalData.trainHistory);

    if (this.data.entry == 1)
      wx.showModal({
        content: '训练结束，下次实验将' + showResults,
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
        content: '训练结束，下次实验将' + showResults,
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

  //点击隔板所进行的动作
  hitOn: function (event) {
    var i = 0;

    //只有在点击隔板有效时才进行处理
    if (this.data.readyForJudge) {
      var i = 0;
      var coverItem;
      var backupCovers = [].concat(this.data.covers);
      var showItem = "numbers[4]";

      //每次点击进行处理时，将点击隔板设为无效
      this.setData({
        readyForJudge: false
      })

      //找到对应于九宫格中心出现数字的隔板位置
      while ( (this.data.numbers[i] != this.data.items[this.data.itemNo]) || (i==4)) i++;

      //打开所对应的隔板
      coverItem = "covers[" + i + "]";
      this.setData({
        [coverItem]: 0
      })

      //显示选择是否正确
      if (event.target.id != i) {
        wx.showToast({
          image: '../../images/wrong.png',  //自定义图标的本地路径，image 的优先级高于 icon  
          title: "错误",
          duration: 500,
        })
        //如果错误，打开所点击的隔板
        coverItem = "covers[" + event.target.id + "]";
        this.setData({
          [coverItem]: 0,
        })
      }
      else 
        this.setData({
          correctCount: this.data.correctCount + 1,
        })

      //延迟1s后，再次合上所有的隔板
      setTimeout( function () {
        this.setData({
          covers: [].concat(backupCovers),
          //此处选择下一个数字目标
          itemNo: this.data.itemNo + 1
        })
      }.bind(this), 1000) 

      
      setTimeout(function () {
        if (this.data.itemNo < this.data.itemCount)
          //如果还未显示完所有的数字，设置下一个数字目标，并把点击隔板设为有效
          this.setData({
            [showItem]: this.data.items[this.data.itemNo],
            readyForJudge: true
          })
        else
          this.finishTrain();
      }.bind(this), 2000) 

    }
  },

  //点击开始按钮的动作
  btnClickme: function () {

    var covers = [].concat(this.data.covers);
    var backupCovers = [].concat(this.data.covers);
    var items = [];
    items = util.shuffle(items);

    for (var i = 0; i < this.data.itemCount; i++) {
      items[i] = i + 1;
    }
    items = util.shuffle(items);

    this.setData({
      btnStartDisable: true,
      targets: [].concat(covers),
      startTime: Date.parse(new Date()) / 1000
    })

    for (var i=0; i<this.data.itemCount; i++) {
      (function (i) {  

        setTimeout( function () {
          
          var count = 0, p = -1;
          while (count < items[i]) {
            if (covers[++p] == 1)
                count ++;
          }
          covers[p] = 0;
          console.log(covers);
          this.setData({
            covers: [].concat(covers),
          })
          covers = [].concat(backupCovers);

        }.bind(this), i*1000)

      }.bind(this))(i)
    }
  
    setTimeout(function () {
      this.setData({
        covers: [].concat(covers),
      })
    }.bind(this), this.data.itemCount * 1000)

    var showItem = "numbers[4]";
    var showTarget = "targets[4]";

    setTimeout(function () {
      console.log(this.data.items[this.data.itemNo]);
      this.setData({
        readyForJudge: true,
        [showItem]: this.data.items[this.data.itemNo],
        [showTarget]: 1
      })
    }.bind(this), this.data.itemCount * 1000 + 1000)
  },


  showInstruction: function () {
    wx.showModal({
      content: '若干个被遮住的数字随机分布在九宫格里。按下开始按钮后，数字依次显现并重新遮住，最后在中间出现一个数字，凭借记忆点击遮住的此数字的位置。',
      showCancel: false,
    });
  },

})
