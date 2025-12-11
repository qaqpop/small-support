
Page({
  data: {
    boardSize: 750,
    cellSize: 50,
    board: [],
    currentPlayer: 1, // 1为黑子，2为白子
    gameStatus: '等待对手加入...',
    gameStarted: false,
    roomId: null,
    showPoster: false,
    posterImage: ''
  },

  onLoad() {
    this.initBoard();
    this.createRoom();
  },

  initBoard() {
    const size = 15;
    const board = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(0);
      }
      board.push(row);
    }
    this.setData({ board });
  },

  createRoom() {
    // 模拟创建房间
    const roomId = Math.random().toString(36).substr(2, 9);
    this.setData({ roomId });
    
    // 检查是否是房主
    const isHost = true; // 实际开发中通过参数判断
    if (isHost) {
      this.setData({ 
        gameStatus: '等待好友加入...' 
      });
    } else {
      this.startGame();
    }
  },

  handleTap(e) {
    if (!this.data.gameStarted) return;
    
    const { row, col } = e.currentTarget.dataset;
    const board = this.data.board;
    
    if (board[row][col] !== 0) return;
    
    board[row][col] = this.data.currentPlayer;
    this.setData({ board });
    
    if (this.checkWin(row, col)) {
      const winner = this.data.currentPlayer === 1 ? '黑子' : '白子';
      this.setData({ 
        gameStatus: `${winner}获胜！`,
        gameStarted: false
      });
      return;
    }
    
    const nextPlayer = this.data.currentPlayer === 1 ? 2 : 1;
    this.setData({ 
      currentPlayer: nextPlayer,
      gameStatus: `轮到${nextPlayer === 1 ? '黑子' : '白子'}下棋`
    });
  },

  checkWin(row, col) {
    const board = this.data.board;
    const player = board[row][col];
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    
    for (let [dx, dy] of directions) {
      let count = 1;
      
      // 正方向
      for (let i = 1; i < 5; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && 
            board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      // 反方向
      for (let i = 1; i < 5; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (newRow >= 0 && newRow < 15 && newCol >= 0 && newCol < 15 && 
            board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }
      
      if (count >= 5) return true;
    }
    
    return false;
  },

  startGame() {
    this.setData({ 
      gameStarted: true,
      gameStatus: '游戏开始，黑子先手'
    });
  },

  resetGame() {
    this.initBoard();
    this.setData({ 
      currentPlayer: 1,
      gameStatus: '游戏开始，黑子先手',
      gameStarted: true
    });
  },

  inviteFriend() {
    if (!this.data.roomId) {
      wx.showToast({ title: '房间创建失败', icon: 'none' });
      return;
    }
    
    wx.showShareMenu({
      withShareTicket: true,
      success: () => {
        console.log('邀请好友成功');
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '来和我一起玩五子棋吧！',
      path: `/pages/index/index?roomId=${this.data.roomId}`,
      imageUrl: '/images/share-chess.jpg'
    };
  },

  onLoad(options) {
    this.initBoard();
    if (options.roomId) {
      // 加入房间
      this.setData({ roomId: options.roomId });
      this.startGame();
    } else {
      // 创建房间
      this.createRoom();
    }
  },

  onLoad(options) {
    // 检查是否是通过分享进入
    if (options.inviter) {
      wx.showModal({
        title: '邀请通知',
        content: `${options.inviter} 邀请你加入游戏`,
        success: (res) => {
          if (res.confirm) {
            this.acceptInvitation(options.inviter);
          }
        }
      });
    }
  },
  
  // 点击邀请按钮
  onInviteFriend() {
    wx.showActionSheet({
      itemList: ['发送给朋友', '生成邀请海报', '分享到朋友圈'],
      success: (res) => {
        const tapIndex = res.tapIndex;
        switch (tapIndex) {
          case 0:
            this.shareToFriend();
            break;
          case 1:
            this.generateInvitePoster();
            break;
          case 2:
            this.shareToTimeline();
            break;
        }
      }
    });
  },

  // 分享给朋友
  shareToFriend() {
    // 触发分享
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 生成邀请海报
  generateInvitePoster() {
    const app = getApp();
    this.setData({ showPoster: true });
    
    // 使用 canvas 绘制海报
    this.drawPosterCanvas();
  },

  // 绘制海报
  drawPosterCanvas() {
    const ctx = wx.createCanvasContext('posterCanvas');
    
    // 绘制背景
    ctx.setFillStyle('#4CAF50');
    ctx.fillRect(0, 0, 300, 400);
    
    // 绘制标题
    ctx.setFontSize(20);
    ctx.setFillStyle('#FFFFFF');
    ctx.fillText('五子棋大挑战', 80, 40);
    
    // 绘制二维码区域提示
    ctx.setFontSize(14);
    ctx.fillText('扫描二维码加入游戏', 70, 350);
    
    ctx.draw(true, () => {
      // 将 canvas 转换为图片
      wx.canvasToTempFilePath({
        canvasId: 'posterCanvas',
        success: (res) => {
          this.setData({ posterImage: res.tempFilePath });
        }
      });
    });
  },

  // 接受邀请
  acceptInvitation(inviter) {
    console.log('接受了', inviter, '的邀请');
    // 这里可以跳转到游戏页面或执行其他逻辑
    wx.navigateTo({
      url: '/wechat-wuziqi/pages/index?inviter=' + inviter
    });
  },

  // 必须的分享方法
  onShareAppMessage() {
    const app = getApp();
    return {
      title: `我在玩五子棋，快来挑战我吧！`,
      path: `/pages/index/index?inviter=${app.globalData.userInfo?.nickName || '好友'}`,
      imageUrl: '/images/share-cover.jpg'
    };
  },

  onShareTimeline() {
    return {
      title: '超好玩的五子棋游戏，等你来战！',
      imageUrl: '/images/timeline-cover.jpg'
    };
  }
});
