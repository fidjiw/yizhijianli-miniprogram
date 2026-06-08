// pages/welcome/welcome.js
const app = getApp();
const wxAuth = require('../../utils/wx-auth');
const helpers = require('../../utils/helpers');
const storage = require('../../utils/storage');

Page({
  data: {
    statusBarHeight: 0,
    userInfo: null,
    isLoggedIn: false
  },

  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    // 检查是否已登录
    if (wxAuth.isLoggedIn()) {
      // 已登录，获取用户信息
      const userInfo = storage.getUserInfo();
      this.setData({
        isLoggedIn: true,
        userInfo: userInfo
      });

      // 延迟跳转到首页
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/home'
        });
      }, 500);
    }
  },

  // 处理登录
  handleLogin() {
    helpers.showLoading('登录中...');

    wxAuth.login()
      .then((result) => {
        wx.hideLoading();

        // 获取用户信息（如果有）
        const userInfo = storage.getUserInfo();

        this.setData({
          isLoggedIn: true,
          userInfo: userInfo
        });

        helpers.showSuccess('登录成功');

        // 提示用户可以授权获取头像和昵称
        if (!userInfo || !userInfo.nickname) {
          setTimeout(() => {
            this.showAuthorizationTip();
          }, 1000);
        } else {
          // 已有用户信息，直接跳转
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home'
            });
          }, 1500);
        }
      })
      .catch((error) => {
        wx.hideLoading();
        console.error('登录失败:', error);

        let errorMsg = '登录失败，请重试';
        if (typeof error === 'string') {
          errorMsg = error;
        } else if (error.message) {
          errorMsg = error.message;
        }

        helpers.showError(errorMsg);
      });
  },

  // 显示授权提示
  showAuthorizationTip() {
    wx.showModal({
      title: '完善资料',
      content: '登录成功！请前往个人中心设置头像和昵称',
      confirmText: '去设置',
      cancelText: '稍后',
      success: (res) => {
        if (res.confirm) {
          // 跳转到个人中心
          wx.switchTab({
            url: '/pages/profile/profile'
          });
        } else {
          // 用户选择稍后，跳转到首页
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home'
            });
          }, 500);
        }
      }
    });
  },

  // 显示用户协议
  showAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // 显示隐私政策
  showPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },

  // 进入首页
  goToHome() {
    wx.switchTab({
      url: '/pages/home/home'
    });
  }
});

