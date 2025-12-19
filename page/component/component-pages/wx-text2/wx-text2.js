// 导入数据
const sentencesData = require('./sentences.js');

Page({
  data: {
    sentences: [],
    totalCount: 0,
    currentIndex: 0,
    currentSentence: null
  },
  
  onLoad: function() {
    // 设置页面数据
    this.setData({
      sentences: sentencesData.sentences,
      totalCount: sentencesData.totalCount,
      currentSentence: sentencesData.sentences[0] || null,
      currentIndex: 0
    });
  },
  
  // 上一条
  prevSentence: function() {
    if (this.data.sentences.length === 0) return;
    
    let newIndex = this.data.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.data.sentences.length - 1; // 循环到最后一个
    }
    
    this.switchSentence(newIndex);
  },
  
  // 下一条
  nextSentence: function() {
    if (this.data.sentences.length === 0) return;
    
    let newIndex = this.data.currentIndex + 1;
    if (newIndex >= this.data.sentences.length) {
      newIndex = 0; // 循环到第一个
    }
    
    this.switchSentence(newIndex);
  },
  
  // 随机句子
  randomSentence: function() {
    if (this.data.sentences.length === 0) return;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.data.sentences.length);
    } while (newIndex === this.data.currentIndex && this.data.sentences.length > 1);
    
    this.switchSentence(newIndex);
  },
  
  // 切换句子
  switchSentence: function(newIndex) {
    this.setData({
      currentIndex: newIndex,
      currentSentence: this.data.sentences[newIndex]
    });
  }
});