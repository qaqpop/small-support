// component-pages/wx-text2/wx-text2.js
const sentencesData = require('./sentences.js');

Page({
  data: {
    allSentences: [],
    categories: [],
    currentIndex: 0,
    searchText: '',
    filteredSentences: [],
    isSearching: false,
    selectedCategory: 'all',
    currentSentence: {}  // 直接存储当前句子对象
  },

  onLoad: function() {
    console.log('页面加载，开始初始化数据...');
    
    // 确保数据正确加载
    const sentences = sentencesData.sentences || [];
    const categories = sentencesData.categories || [];
    
    this.setData({
      allSentences: sentences,
      categories: categories,
      filteredSentences: sentences
    }, () => {
      console.log('数据加载完成，句子数量:', sentences.length);
      this.updateCurrentSentence();
    });
  },

  // 更新当前显示的句子
  updateCurrentSentence: function() {
    const { filteredSentences, currentIndex } = this.data;
    
    if (filteredSentences.length === 0) {
      this.setData({
        currentSentence: { 
          content: '暂无句子数据', 
          author: '', 
          category: '', 
          tags: [] 
        }
      });
      return;
    }
    
    const sentence = filteredSentences[currentIndex] || filteredSentences[0];
    this.setData({
      currentSentence: sentence,
      currentIndex: currentIndex >= filteredSentences.length ? 0 : currentIndex
    });
    
    console.log('更新当前句子:', sentence.content);
  },

  // 显示下一个句子
  showNext: function() {
    const { filteredSentences, currentIndex } = this.data;
    if (filteredSentences.length === 0) return;
    
    let nextIndex = (currentIndex + 1) % filteredSentences.length;
    this.setData({
      currentIndex: nextIndex,
      isSearching: false
    }, () => {
      this.updateCurrentSentence();
    });
  },

  // 显示上一个句子
  showPrevious: function() {
    const { filteredSentences, currentIndex } = this.data;
    if (filteredSentences.length === 0) return;
    
    let prevIndex = (currentIndex - 1 + filteredSentences.length) % filteredSentences.length;
    this.setData({
      currentIndex: prevIndex,
      isSearching: false
    }, () => {
      this.updateCurrentSentence();
    });
  },

  // 显示随机句子
  showRandom: function() {
    const { filteredSentences } = this.data;
    if (filteredSentences.length === 0) return;
    
    let randomIndex = Math.floor(Math.random() * filteredSentences.length);
    this.setData({
      currentIndex: randomIndex,
      isSearching: false
    }, () => {
      this.updateCurrentSentence();
    });
  },

  // 选择列表中的句子
  selectSentence: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      isSearching: false
    }, () => {
      this.updateCurrentSentence();
    });
  },

  // 搜索输入
  onSearchInput: function(e) {
    const searchText = e.detail.value;
    this.setData({ searchText: searchText });
    this.filterSentences();
  },

  // 分类切换
  onCategoryChange: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      selectedCategory: category,
      currentIndex: 0
    });
    this.filterSentences();
  },

  // 清除搜索
  clearSearch: function() {
    this.setData({
      searchText: '',
      selectedCategory: 'all',
      currentIndex: 0,
      isSearching: false
    });
    this.filterSentences();
  },

  // 过滤句子
  filterSentences: function() {
    const { allSentences, searchText, selectedCategory } = this.data;
    
    let filtered = allSentences.filter(sentence => {
      // 分类筛选
      const categoryMatch = selectedCategory === 'all' || sentence.category === selectedCategory;
      
      // 搜索文本筛选
      let textMatch = true;
      if (searchText && searchText.trim()) {
        textMatch = 
          (sentence.content && sentence.content.includes(searchText)) ||
          (sentence.author && sentence.author.includes(searchText)) ||
          (sentence.tags && sentence.tags.some(tag => tag.includes(searchText)));
      }
      
      return categoryMatch && textMatch;
    });
    
    this.setData({
      filteredSentences: filtered,
      currentIndex: 0,
      isSearching: !!searchText && searchText.trim().length > 0
    }, () => {
      this.updateCurrentSentence();
    });
  }
});