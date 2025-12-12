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
    currentSentence: null,
    textSegments: [],
    repeatedWords: []
  },

  onLoad: function() {
    const sentences = sentencesData.sentences || [];
    const categories = sentencesData.categories || [];
    
    this.setData({
      allSentences: sentences,
      categories: categories,
      filteredSentences: sentences,
      currentSentence: sentences.length > 0 ? sentences[0] : null
    }, () => {
      this.showCurrentSentence();
    });
  },

  showCurrentSentence: function() {
    const { filteredSentences, currentIndex, searchText } = this.data;
    
    if (filteredSentences.length === 0) {
      this.setData({ 
        currentSentence: null,
        textSegments: [],
        repeatedWords: []
      });
      return;
    }
    
    const sentence = filteredSentences[currentIndex];
    
    // 如果有搜索词，优先显示搜索高亮
    if (searchText && searchText.trim()) {
      const searchResult = this.highlightSearchText(sentence.content, searchText);
      this.setData({ 
        currentSentence: sentence,
        textSegments: searchResult.textSegments,
        repeatedWords: []
      });
    } else {
      // 没有搜索词时显示排比分析
      const analysisResult = this.analyzeRepetition(sentence.content);
      this.setData({ 
        currentSentence: sentence,
        textSegments: analysisResult.textSegments,
        repeatedWords: analysisResult.repeatedWords
      });
    }
  },

  // 搜索文本高亮
  highlightSearchText: function(content, searchText) {
    const textSegments = [];
    
    if (!searchText || !searchText.trim()) {
      textSegments.push({ type: 'normal', text: content });
      return { textSegments };
    }
    
    const searchRegex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    let lastIndex = 0;
    let match;
    
    while ((match = searchRegex.exec(content)) !== null) {
      // 添加匹配前的普通文本
      if (match.index > lastIndex) {
        textSegments.push({
          type: 'normal',
          text: content.substring(lastIndex, match.index)
        });
      }
      
      // 添加高亮文本
      textSegments.push({
        type: 'highlight',
        text: match[0]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // 添加剩余的普通文本
    if (lastIndex < content.length) {
      textSegments.push({
        type: 'normal',
        text: content.substring(lastIndex)
      });
    }
    
    return { textSegments };
  },

  analyzeRepetition: function(content) {
    const chineseWords = content.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    
    const wordCount = {};
    chineseWords.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const repeatedWords = [];
    for (const [word, count] of Object.entries(wordCount)) {
      if (count >= 2) {
        repeatedWords.push({ word, count });
      }
    }
    
    repeatedWords.sort((a, b) => b.count - a.count);
    
    const textSegments = [];
    let remainingContent = content;
    
    if (repeatedWords.length === 0) {
      textSegments.push({
        type: 'normal',
        text: content
      });
    } else {
      const processedWords = new Set();
      
      repeatedWords.forEach(item => {
        if (processedWords.has(item.word)) return;
        processedWords.add(item.word);
        
        const regex = new RegExp(item.word, 'g');
        remainingContent = remainingContent.replace(regex, `*${item.word}*`);
      });
      
      const parts = remainingContent.split(/(\*.*?\*)/g);
      
      parts.forEach(part => {
        if (part.startsWith('*') && part.endsWith('*')) {
          textSegments.push({
            type: 'highlight',
            text: part.slice(1, -1)
          });
        } else if (part.length > 0) {
          textSegments.push({
            type: 'normal',
            text: part
          });
        }
      });
    }
    
    return {
      textSegments: textSegments,
      repeatedWords: repeatedWords
    };
  },

  // 为搜索结果列表中的每个句子生成高亮文本
  generateSearchResults: function(sentences, searchText) {
    return sentences.map(sentence => {
      const highlighted = this.highlightSearchText(sentence.content, searchText);
      return {
        ...sentence,
        textSegments: highlighted.textSegments
      };
    });
  },

  showNext: function() {
    let { currentIndex, filteredSentences } = this.data;
    currentIndex = (currentIndex + 1) % filteredSentences.length;
    
    this.setData({ 
      currentIndex: currentIndex,
      isSearching: false 
    }, () => {
      this.showCurrentSentence();
    });
  },

  showPrevious: function() {
    let { currentIndex, filteredSentences } = this.data;
    currentIndex = (currentIndex - 1 + filteredSentences.length) % filteredSentences.length;
    
    this.setData({ 
      currentIndex: currentIndex,
      isSearching: false 
    }, () => {
      this.showCurrentSentence();
    });
  },

  showRandom: function() {
    const { filteredSentences } = this.data;
    const randomIndex = Math.floor(Math.random() * filteredSentences.length);
    
    this.setData({ 
      currentIndex: randomIndex,
      isSearching: false 
    }, () => {
      this.showCurrentSentence();
    });
  },

  selectSentence: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      isSearching: false
    }, () => {
      this.showCurrentSentence();
    });
  },

  onSearchInput: function(e) {
    this.setData({ searchText: e.detail.value });
    this.filterSentences();
  },

  onCategoryChange: function(e) {
    this.setData({ 
      selectedCategory: e.currentTarget.dataset.category,
      currentIndex: 0
    });
    this.filterSentences();
  },

  clearSearch: function() {
    this.setData({
      searchText: '',
      selectedCategory: 'all',
      currentIndex: 0,
      isSearching: false
    });
    this.filterSentences();
  },

  filterSentences: function() {
    const { allSentences, searchText, selectedCategory } = this.data;
    
    const filtered = allSentences.filter(sentence => {
      const categoryMatch = selectedCategory === 'all' || sentence.category === selectedCategory;
      const textMatch = !searchText || sentence.content.includes(searchText);
      
      return categoryMatch && textMatch;
    });
    
    // 为搜索结果生成高亮文本
    const highlightedResults = searchText ? this.generateSearchResults(filtered, searchText) : filtered;
    
    this.setData({
      filteredSentences: highlightedResults,
      currentIndex: 0,
      isSearching: !!searchText
    }, () => {
      this.showCurrentSentence();
    });
  }
});