// app.js
App({
  globalData: {
    userInfo: null,
    currentResume: null,
    resumeList: []
  },

  onLaunch() {
    // 初始化微信云开发
    wx.cloud.init({
      env: 'cloudbase-d1g90x9al09984900'  // 云环境 ID
    });

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

  // 微信登录（使用云开发）
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 调用云函数进行登录
            wx.cloud.callFunction({
              name: 'login',
              data: {
                code: res.code
              },
              success: (result) => {
                if (result.result.code === 0) {
                  // 登录成功，保存 token
                  const { token, userId, loginTime } = result.result.data;
                  wx.setStorageSync('token', token);
                  wx.setStorageSync('userId', userId);
                  wx.setStorageSync('loginTime', loginTime);
                  this.getUserInfo();
                  resolve(result.result.data);
                } else {
                  reject(result.result.msg || '登录失败');
                }
              },
              fail: (error) => {
                console.error('云函数调用失败:', error);
                reject('云函数调用失败');
              }
            });
          } else {
            reject('获取登录 code 失败');
          }
        },
        fail: reject
      });
    });
  },

  // 获取用户授权信息（使用云开发保存）
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          const userInfo = res.userInfo;

          // 调用云函数保存用户信息
          wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            },
            success: (result) => {
              if (result.result.code === 0) {
                // 本地保存用户信息
                this.globalData.userInfo = {
                  ...this.globalData.userInfo,
                  nickname: userInfo.nickName,
                  avatar: userInfo.avatarUrl,
                  userId: result.result.data.userId
                };

                // 保存到本地存储
                wx.setStorageSync('userInfo', {
                  nickname: userInfo.nickName,
                  avatar: userInfo.avatarUrl,
                  userId: result.result.data.userId
                });

                resolve(userInfo);
              } else {
                reject(result.result.msg || '保存用户信息失败');
              }
            },
            fail: (error) => {
              console.error('保存用户信息失败:', error);
              reject('保存用户信息失败');
            }
          });
        },
        fail: reject
      });
    });
  }
});
