// page/component/component-pages/wx-text/wx-text1.js
const idiomsData = require('../../../idioms.js');

Page({
  data: {
    currentIdiom: {},
    currentIndex: 0,
    idiomsDataLength: idiomsData.length,
    content: '',
    text: ''
  },

  onLoad: function() {
    this.setData({
      currentIndex: Math.floor(Math.random() * idiomsData.length),
      idiomsDataLength: idiomsData.length
    });
    this.displayCurrentIdiom();
  },

  displayCurrentIdiom: function() {
    const idiom = idiomsData[this.data.currentIndex];
    
    this.setData({
      currentIdiom: idiom,
      content: idiom.name + '\n\n',
      text: this.formatIdiomInfo(idiom)
    });
  },

  formatIdiomInfo: function(idiom) {
    // 突出显示例句中的成语名称
    const highlightedExample = this.highlightIdiomInExample(idiom.example, idiom.name);
    
    return `${idiom.name}（拼音：${idiom.pinyin}）\n\n` +
           `释义：${idiom.meaning}\n\n` +
           `近义词：${idiom.synonyms.join('、')}\n\n` +
           `反义词：${idiom.antonyms.join('、')}\n\n` +
           `对比：${idiom.comparison}\n\n` +
           `实例：${highlightedExample}`;
  },

  // 突出显示例句中的成语名称
  highlightIdiomInExample: function(example, idiomName) {
    if (!example || !idiomName) return example;
    
    // 方法1: 使用特殊符号包围
    // const highlighted = example.replace(
    //   new RegExp(idiomName, 'g'), 
    //   `【${idiomName}】`
    // );
    
    // return highlighted;
    
    // 方法2: 更明显的突出方式（如果需要更突出）
    return example.replace(
      new RegExp(idiomName, 'g'), 
      `✨${idiomName}✨`
    );
    
    // 方法3: 添加前缀标记
    // return example.replace(
    //   new RegExp(idiomName, 'g'), 
    //   `★${idiomName}★`
    // );
  },

  // 顺序下一个成语
  nextIdiom: function() {
    let nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= idiomsData.length) {
      nextIndex = 0; // 循环到第一个
    }
    
    this.setData({
      currentIndex: nextIndex
    });
    this.displayCurrentIdiom();
  },

  // 随机下一个成语
  randomIdiom: function() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * idiomsData.length);
    } while (randomIndex === this.data.currentIndex && idiomsData.length > 1);
    
    this.setData({
      currentIndex: randomIndex
    });
    this.displayCurrentIdiom();
  }
});
