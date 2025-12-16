// page/component/component-pages/wx-text/wx-text1.js
// 初始加载默认数据
const defaultIdiomsData = require('../../../idioms.js');

Page({
  data: {
    currentIdiom: {},
    currentIndex: 0,
    idiomsDataLength: 0,
    content: '',
    text: '',
    showUploadModal: false,
    newIdiom: {
      name: '',
      pinyin: '',
      meaning: '',
      synonyms: '',
      antonyms: '',
      comparison: '',
      example: ''
    }
  },

  onLoad: function() {
    this.loadIdiomsData();
  },

  // 从本地存储加载成语数据
  loadIdiomsData: function() {
    try {
      // 尝试从本地存储读取数据
      const storedIdioms = wx.getStorageSync('idiomsData');
      let idiomsData;
      
      if (storedIdioms && storedIdioms.length > 0) {
        // 使用本地存储的数据
        idiomsData = storedIdioms;
        console.log('从本地存储加载成语数据，数量：', idiomsData.length);
      } else {
        // 使用默认数据并保存到本地存储
        idiomsData = defaultIdiomsData;
        wx.setStorageSync('idiomsData', idiomsData);
        console.log('使用默认数据并保存到本地存储，数量：', idiomsData.length);
      }
      
      this.setData({
        currentIndex: Math.floor(Math.random() * idiomsData.length),
        idiomsDataLength: idiomsData.length
      });
      this.displayCurrentIdiom(idiomsData);
    } catch (error) {
      console.error('加载成语数据失败：', error);
      // 使用默认数据
      this.setData({
        currentIndex: Math.floor(Math.random() * defaultIdiomsData.length),
        idiomsDataLength: defaultIdiomsData.length
      });
      this.displayCurrentIdiom(defaultIdiomsData);
    }
  },

  // 获取当前成语数据
  getIdiomsData: function() {
    try {
      const storedIdioms = wx.getStorageSync('idiomsData');
      return storedIdioms && storedIdioms.length > 0 ? storedIdioms : defaultIdiomsData;
    } catch (error) {
      console.error('获取成语数据失败：', error);
      return defaultIdiomsData;
    }
  },

  // 保存成语数据到本地存储
  saveIdiomsData: function(idiomsData) {
    try {
      wx.setStorageSync('idiomsData', idiomsData);
      console.log('成语数据保存成功，数量：', idiomsData.length);
      return true;
    } catch (error) {
      console.error('保存成语数据失败：', error);
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      });
      return false;
    }
  },

  displayCurrentIdiom: function(idiomsData = null) {
    const data = idiomsData || this.getIdiomsData();
    const idiom = data[this.data.currentIndex];
    
    this.setData({
      currentIdiom: idiom,
      content: idiom.name + '\n\n',
      text: this.formatIdiomInfo(idiom),
      idiomsDataLength: data.length
    });
  },

  formatIdiomInfo: function(idiom) {
    const highlightedExample = this.highlightIdiomInExample(idiom.example, idiom.name);
    
    return `${idiom.name}（拼音：${idiom.pinyin}）\n\n` +
           `释义：${idiom.meaning}\n\n` +
           `近义词：${idiom.synonyms.join('、')}\n\n` +
           `反义词：${idiom.antonyms.join('、')}\n\n` +
           `对比：${idiom.comparison}\n\n` +
           `实例：${highlightedExample}`;
  },

  highlightIdiomInExample: function(example, idiomName) {
    if (!example || !idiomName) return example;
    
    return example.replace(
      new RegExp(idiomName, 'g'), 
      `✨${idiomName}✨`
    );
  },

  // 顺序下一个成语
  nextIdiom: function() {
    const idiomsData = this.getIdiomsData();
    let nextIndex = this.data.currentIndex + 1;
    if (nextIndex >= idiomsData.length) {
      nextIndex = 0;
    }
    
    this.setData({
      currentIndex: nextIndex
    });
    this.displayCurrentIdiom(idiomsData);
  },

  // 随机下一个成语
  randomIdiom: function() {
    const idiomsData = this.getIdiomsData();
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * idiomsData.length);
    } while (randomIndex === this.data.currentIndex && idiomsData.length > 1);
    
    this.setData({
      currentIndex: randomIndex
    });
    this.displayCurrentIdiom(idiomsData);
  },

  // 显示上传模态框
  showUpload: function() {
    this.setData({
      showUploadModal: true,
      newIdiom: {
        name: '',
        pinyin: '',
        meaning: '',
        synonyms: '',
        antonyms: '',
        comparison: '',
        example: ''
      }
    });
  },

  // 隐藏上传模态框
  hideUpload: function() {
    this.setData({
      showUploadModal: false
    });
  },

  // 处理输入变化
  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`newIdiom.${field}`]: value
    });
  },

  // 上传成语
  uploadIdiom: function() {
    const newIdiom = this.data.newIdiom;
    
    // 验证必填字段
    if (!newIdiom.name.trim()) {
      wx.showToast({
        title: '请输入成语名称',
        icon: 'none'
      });
      return;
    }

    if (!newIdiom.pinyin.trim()) {
      wx.showToast({
        title: '请输入拼音',
        icon: 'none'
      });
      return;
    }

    if (!newIdiom.meaning.trim()) {
      wx.showToast({
        title: '请输入释义',
        icon: 'none'
      });
      return;
    }

    // 获取当前数据
    const currentIdiomsData = this.getIdiomsData();
    
    // 检查是否已存在相同成语
    const exists = currentIdiomsData.some(idiom => idiom.name === newIdiom.name.trim());
    if (exists) {
      wx.showToast({
        title: '该成语已存在',
        icon: 'none'
      });
      return;
    }

    // 处理近义词和反义词（字符串转数组）
    const synonyms = newIdiom.synonyms ? newIdiom.synonyms.split(/[,，、\s]+/).filter(s => s.trim()) : [];
    const antonyms = newIdiom.antonyms ? newIdiom.antonyms.split(/[,，、\s]+/).filter(s => s.trim()) : [];

    // 创建新的成语对象
    const idiomToAdd = {
      name: newIdiom.name.trim(),
      pinyin: newIdiom.pinyin.trim(),
      meaning: newIdiom.meaning.trim(),
      synonyms: synonyms,
      antonyms: antonyms,
      comparison: newIdiom.comparison ? newIdiom.comparison.trim() : '',
      example: newIdiom.example ? newIdiom.example.trim() : ''
    };

    // 添加到数据数组
    const updatedIdiomsData = [...currentIdiomsData, idiomToAdd];
    
    // 保存到本地存储
    if (this.saveIdiomsData(updatedIdiomsData)) {
      // 更新界面
      this.setData({
        idiomsDataLength: updatedIdiomsData.length,
        showUploadModal: false,
        currentIndex: updatedIdiomsData.length - 1
      });
      
      // 显示新成语
      this.displayCurrentIdiom(updatedIdiomsData);
      
      wx.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      });
    }
  },

  // 清空所有自定义数据（恢复默认）
  clearCustomData: function() {
    wx.showModal({
      title: '确认清空',
      content: '这将删除所有自定义上传的成语，恢复为默认数据，确定要继续吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            // 恢复默认数据
            wx.setStorageSync('idiomsData', defaultIdiomsData);
            
            this.setData({
              currentIndex: Math.floor(Math.random() * defaultIdiomsData.length),
              idiomsDataLength: defaultIdiomsData.length
            });
            this.displayCurrentIdiom(defaultIdiomsData);
            
            wx.showToast({
              title: '已恢复默认数据',
              icon: 'success'
            });
          } catch (error) {
            console.error('清空数据失败：', error);
            wx.showToast({
              title: '操作失败',
              icon: 'error'
            });
          }
        }
      }
    });
  }
});