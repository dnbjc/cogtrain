var util = require('../../utils/util.js');

Page({

  data: {
    words: ["蓝色", "红色", "棕色", "紫色", "绿色"],
    colors: ["blue", "red", "chocolate", "purple", "green"],
    wordsSeq: [],
    targetwordsSeq: [],
    colorsSeq: [],
    targetSeq: [],
    seqTotal: 20,
    seqCount: -1,
    colorword: "",
    targetWord: "",
    targetcolorWord: "",
    btnJdDisable: true,
    btnStartDisable: false,
    condition:true,
    btnNextName:"开始",
    entry: 1,
    startTime: 0,
    endTime: 0,
  },

  initial: function () {
    var wordsSeq = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    var targetwordsSeq = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    var colorsSeq = [];
    var targetSeq = [];

    //生成目标词汇的数组序列【1，1，1，1，1，0，0，0，0，0】
    for (var i=0; i<10; i++)
      targetSeq[i] = 1;
    for (var i=10; i<20; i++)
      targetSeq[i] = 0;
    //打乱顺序，随机呈现
    targetSeq = util.shuffle(targetSeq);
    // 打乱颜色词汇出现的次序
    wordsSeq = util.shuffle(wordsSeq);
    targetwordsSeq = util.shuffle(targetwordsSeq);
    // 设置颜色是否与词汇标示的颜色相同
    for (var i=0; i<20; i++)
      if (targetSeq[i] == 1)
          colorsSeq[i] = targetwordsSeq[i];
      else {
        colorsSeq[i] = Math.floor(Math.random()*5);
        while (colorsSeq[i] == targetwordsSeq[i])
          colorsSeq[i] = Math.floor(Math.random() * 5);
      }

    console.log("words: " + wordsSeq);
    console.log("colors: " + colorsSeq);
    console.log("target: " + targetSeq);
    console.log("colorword:" + targetwordsSeq);

    this.setData({
      seqCount: -1,
      wordsSeq: wordsSeq,
      targetwordsSeq :targetwordsSeq,
      colorsSeq: colorsSeq,
      targetSeq: targetSeq,
      btnJdDisable: true,
      condition:true,
      btnStartDisable: false,  
      targetcolorWord: "",  
      targetWord: "",
      targetColor: "",  
      showResult: "",
      //统计正确个数
      correctCount: 0,
    })
  },

  onLoad: function (options) {
    this.setData({
      entry: Number(options.entry),
    })
    this.initial();
  },

  finishTrain: function () {
    this.setData({
      endTime: Date.parse(new Date()) / 1000,
      seqCount: this.data.seqCount - 1,
    })

    var accuracy = this.data.correctCount;
    var rt = this.data.endTime - this.data.startTime;
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];
    var score = 100 / (rt / accuracy);

    trainToday.trainedToday = true;
    var times = trainToday.trainTimes[1] - trainToday.trainRecords[1];
    if (times == 0)
      trainToday.trainScores[1] = Math.floor(score);
    else
      trainToday.trainScores[1] = Math.floor((trainToday.trainScores[1] * times + score) / (times + 1));

    if (trainToday.trainRecords[1] > 0)
      trainToday.trainRecords[1]--;
    
    wx.setStorageSync('trainHistory', getApp().globalData.trainHistory);

    if (this.data.entry == 1)
      wx.showModal({
        content: '训练结束。' ,
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

  btnClick: function (event) {
    var colorNo = this.data.colorNo + 1;
    var jd;
    var trainToday = getApp().globalData.trainHistory[getApp().globalData.trainHistory.length - 1];

    if (event.currentTarget.id == "yes")
      jd = 1;
    else
      jd = 0;

    console.log("response: ", jd);
    console.log(this.data.targetSeq);
    console.log(this.data.seqCount);

    if (this.data.targetSeq[this.data.seqCount] == jd)
      this.setData({
        correctCount: this.data.correctCount+1,
      })
    else
      wx.showToast({
        image: '../../images/wrong.png',  //自定义图标的本地路径，image 的优先级高于 icon  
        title: "错误",
        duration: 500,
      })

    this.setData({
      btnJdDisable: true,
      condition: false,
      targetWord: "",
      seqCount: this.data.seqCount + 1,
    })

    console.log(event.currentTarget.id);
    console.log("seqCount", this.data.seqCount);
    
    setTimeout( function () {
      if (this.data.seqCount < this.data.seqTotal)
        this.setData({
          btnJdDisable: false,
          condition:true,
          showResult: "",
          targetcolorWord: this.data.words[this.data.targetwordsSeq[this.data.seqCount]],
          targetWord: this.data.words[this.data.wordsSeq[this.data.seqCount]],
          targetColor: this.data.colors[this.data.colorsSeq[this.data.seqCount]],
        })
      else
        this.finishTrain();
    }.bind(this), 1000)

   
  },

  btnStart: function () {
    this.setData({
      seqCount: this.data.seqCount + 1,
      startTime: Date.parse(new Date()) / 1000
    })
    console.log("seqCount", this.data.seqCount);
    this.setData({
      btnStartDisable: true,
      btnJdDisable: false,
      targetWord: this.data.words[this.data.wordsSeq[this.data.seqCount]],
      targetcolorWord: this.data.words[this.data.targetwordsSeq[this.data.seqCount]],
      targetColor: this.data.colors[this.data.colorsSeq[this.data.seqCount]],
    })

  },

  showInstruction: function () {
    wx.showModal({
      content: '屏幕上有两个表示颜色的词语，判断第一行的词语的意思与第二行词语的字体颜色是否一致。',
      showCancel: false,
    });
  },
})

