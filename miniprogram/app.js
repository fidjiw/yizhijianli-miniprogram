// app.js
App({
  globalData: {
    userInfo: null,
    currentResume: null,
    resumeList: []
  },

  onLaunch() {
    // 检查登录状态
    const token = wx.getStorageSync('token');
    if (token) {
      this.getUserInfo();
    }

    // 获取简历列表
    this.getResumeList();
  },

  // 获取用户信息
  getUserInfo() {
    // TODO: 调用后端接口获取用户信息
    this.globalData.userInfo = {
      id: 8866,
      nickname: 'Mia',
      avatar: '',
      vip: false,
      aiCount: 12,
      resumeCount: 5,
      exportCount: 8
    };
  },

  // 获取简历列表
  getResumeList() {
    // TODO: 调用后端接口获取简历列表
    this.globalData.resumeList = [
      {
        id: 1,
        title: '产品经理-校招版',
        updateTime: '2 小时前',
        progress: 85,
        status: 'draft'
      },
      {
        id: 2,
        title: '设计实习生',
        updateTime: '5 天前',
        progress: 100,
        status: 'completed'
      },
      {
        id: 3,
        title: '运营岗-社招',
        updateTime: '1 周前',
        progress: 40,
        status: 'draft'
      }
    ];
  },

  // 微信登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // TODO: 调用后端接口，用 code 换取 token
            wx.setStorageSync('token', 'mock_token_' + res.code);
            this.getUserInfo();
            resolve();
          } else {
            reject('登录失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取用户授权信息
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          this.globalData.userInfo = {
            ...this.globalData.userInfo,
            nickname: res.userInfo.nickName,
            avatar: res.userInfo.avatarUrl
          };
          resolve(res.userInfo);
        },
        fail: reject
      });
    });
  }
});
