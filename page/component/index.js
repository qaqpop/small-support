var pageData = {}, 
    type = ['view', 'content', 'form', 'interact', 'nav', 'media', 'map', 'canvas', 'text'];

// 初始化数据
pageData.data = {
    showAllContent: false, // 新增：控制整个内容区域的显示/隐藏，默认隐藏
    viewShow: false,
    contentShow: false,
    formShow: false,
    interactShow: false,
    navShow: false,
    mediaShow: false,
    mapShow: false,
    canvasShow: false,
    textShow: false,
};

// 新增：切换整个内容区域的显示/隐藏
pageData.toggleAllContent = function() {
    this.setData({
        showAllContent: !this.data.showAllContent
    });
};

// 原有的组件切换函数
pageData.widgetsToggle = function(e) {
    var id = e.currentTarget.id, 
        data = {};
    
    // 如果整个内容区域是隐藏的，先显示它
    // if (!this.data.showAllContent) {
    //     data.showAllContent = true;
    // }
    
    // 关闭其他所有组件，只显示当前点击的组件
    for (var i = 0, len = type.length; i < len; ++i) {
        data[type[i] + 'Show'] = false;
    }
    data[id + 'Show'] = !this.data[id + 'Show'];
    
    this.setData(data);
    console.log(data.contentShow, data.textShow, data.showAllContent)
};

Page(pageData);
