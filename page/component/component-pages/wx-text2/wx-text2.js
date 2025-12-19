// 导入数据
const sentencesData = require('./sentences.js');

Page({
  data: {
    sentences: [],
    filteredSentences: [],
    totalCount: 0,
    currentIndex: 0,
    currentSentence: null,
    searchKeyword: '',
    isSearching: false,
    showSearchPanel: false,
    showUploadPanel: false,
    newSentence: {
      content: '',
      category: '',
      source: 'user'
    }
  },
  
  onLoad: function() {
    // 从本地存储加载数据
    this.loadFromStorage();
  },
  
  // 从本地存储加载数据
  loadFromStorage: function() {
    const storedSentences = wx.getStorageSync('userSentences') || [];
    const allSentences = [...sentencesData.sentences, ...storedSentences];
    
    this.setData({
      sentences: allSentences,
      filteredSentences: allSentences,
      totalCount: allSentences.length,
      currentSentence: allSentences[0] || null,
      currentIndex: 0
    });
  },
  
  // 保存到本地存储
  saveToStorage: function() {
    const userSentences = this.data.sentences.filter(s => s.source === 'user');
    wx.setStorageSync('userSentences', userSentences);
  },
  
  // 上一条
  prevSentence: function() {
    if (this.data.filteredSentences.length === 0) return;
    
    let newIndex = this.data.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.data.filteredSentences.length - 1;
    }
    
    this.switchSentence(newIndex);
  },
  
  // 下一条
  nextSentence: function() {
    if (this.data.filteredSentences.length === 0) return;
    
    let newIndex = this.data.currentIndex + 1;
    if (newIndex >= this.data.filteredSentences.length) {
      newIndex = 0;
    }
    
    this.switchSentence(newIndex);
  },
  
  // 随机句子
  randomSentence: function() {
    if (this.data.filteredSentences.length === 0) return;
    
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.data.filteredSentences.length);
    } while (newIndex === this.data.currentIndex && this.data.filteredSentences.length > 1);
    
    this.switchSentence(newIndex);
  },
  
  // 切换句子
  switchSentence: function(newIndex) {
    this.setData({
      currentIndex: newIndex,
      currentSentence: this.data.filteredSentences[newIndex]
    });
  },
  
  // 显示搜索面板
  showSearchPanel: function() {
    this.setData({
      showSearchPanel: true
    });
  },
  
  // 隐藏搜索面板
  hideSearchPanel: function() {
    this.setData({
      showSearchPanel: false
    });
  },
  
  // 搜索输入
  onSearchInput: function(e) {
    const keyword = e.detail.value;
    this.setData({
      searchKeyword: keyword
    });
    
    if (keyword.trim()) {
      this.performSearch(keyword);
    } else {
      this.clearSearch();
    }
  },
  
  // 执行搜索
  performSearch: function(keyword) {
    const filtered = this.data.sentences.filter(sentence => 
      sentence.content.includes(keyword) || 
      sentence.category.includes(keyword)
    );
    
    this.setData({
      filteredSentences: filtered,
      isSearching: true,
      currentIndex: 0,
      currentSentence: filtered[0] || null
    });
  },
  
  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchKeyword: '',
      filteredSentences: this.data.sentences,
      isSearching: false,
      currentIndex: 0,
      currentSentence: this.data.sentences[0] || null
    });
  },
  
  // 显示上传面板
  showUploadPanel: function() {
    this.setData({
      showUploadPanel: true,
      newSentence: {
        content: '',
        category: '',
        source: 'user'
      }
    });
  },
  
  // 隐藏上传面板
  hideUploadPanel: function() {
    this.setData({
      showUploadPanel: false
    });
  },
  
  // 句子内容输入
  onSentenceInput: function(e) {
    this.setData({
      'newSentence.content': e.detail.value
    });
  },
  
  // 分类输入
  onCategoryInput: function(e) {
    this.setData({
      'newSentence.category': e.detail.value
    });
  },
  
  // 上传句子
  uploadSentence: function() {
    const { content, category } = this.data.newSentence;
    
    if (!content.trim() || !category.trim()) {
      wx.showToast({
        title: '请填写完整内容',
        icon: 'none'
      });
      return;
    }
    
    const newSentence = {
      id: Date.now(),
      content: content.trim(),
      category: category.trim(),
      source: 'user',
      isFavorite: false
    };
    
    const updatedSentences = [newSentence, ...this.data.sentences];
    
    this.setData({
      sentences: updatedSentences,
      filteredSentences: updatedSentences,
      totalCount: updatedSentences.length,
      currentIndex: 0,
      currentSentence: newSentence,
      showUploadPanel: false
    });
    
    // 保存到本地存储
    this.saveToStorage();
    
    wx.showToast({
      title: '上传成功',
      icon: 'success'
    });
  },
  
  // 收藏/取消收藏
  toggleFavorite: function() {
    const sentences = [...this.data.sentences];
    const currentId = this.data.currentSentence.id;
    
    const sentenceIndex = sentences.findIndex(s => s.id === currentId);
    if (sentenceIndex !== -1) {
      sentences[sentenceIndex].isFavorite = !sentences[sentenceIndex].isFavorite;
      
      this.setData({
        sentences: sentences,
        filteredSentences: this.data.isSearching ? 
          sentences.filter(s => 
            s.content.includes(this.data.searchKeyword) || 
            s.category.includes(this.data.searchKeyword)
          ) : sentences,
        currentSentence: sentences[sentenceIndex]
      });
      
      this.saveToStorage();
    }
  },
  
  // 朗读句子
  speakSentence: function() {
    const content = this.data.currentSentence.content;
    
    if (wx.createInnerAudioContext) {
      // 这里可以集成语音合成API
      wx.showToast({
        title: '朗读功能开发中',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: '当前版本不支持朗读',
        icon: 'none'
      });
    }
  }
});