var pageData = {
    
    // 跳转到分包页面
    goToWuziqi: function() {
        wx.navigateTo({
        url: '/wechat-wuziqi/pages/index'
        })
    },
    
    // 带参数跳转
    goToWuziqiWithParams: function() {
        wx.navigateTo({
        url: '/wechat-wuziqi/pages/index?gameType=normal&player=user1'
        })
    },
  
    // 必须实现 onShareAppMessage 方法
    onShareAppMessage() {
    return {
        title: '邀请好友一起玩五子棋',
        path: '/pages/index/index?inviter=' + (getApp().globalData.userInfo?.nickName || ''),
        imageUrl: '/images/share.jpg'
    }
    },

    // 分享到朋友圈（可选）
    onShareTimeline() {
    return {
        title: '快来挑战我的五子棋！',
        imageUrl: '/images/timeline-share.jpg'
    }
}
}, 
    type = ['view', 'content', 'form', 'interact', 'nav', 'media', 'map', 'canvas', 'text', "rest"];

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
    restShow: false,
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
