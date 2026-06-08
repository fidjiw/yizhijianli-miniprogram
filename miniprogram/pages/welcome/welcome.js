// pages/welcome/welcome.js
const app = getApp();
const wxAuth = require('../../utils/wx-auth');
const helpers = require('../../utils/helpers');
const storage = require('../../utils/storage');

Page({
  data: {
    statusBarHeight: 0
  },

  onLoad() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight
    });

    // 检查是否已登录
    if (wxAuth.isLoggedIn()) {
      // 已登录，跳转到首页
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
        helpers.showSuccess('登录成功');

        // 更新全局用户信息
        const userInfo = storage.getUserInfo();
        app.globalData.userInfo = userInfo;

        // 延迟跳转
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/home/home'
          });
        }, 1500);
      })
      .catch((error) => {
        wx.hideLoading();
        console.error('登录失败:', error);

        // 根据错误类型显示不同的提示
        let errorMsg = '登录失败，请重试';

        if (typeof error === 'string') {
          errorMsg = error;
        } else if (error.message) {
          errorMsg = error.message;
        }

        helpers.showError(errorMsg);
      });
  },

  // 显示用户协议
  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '一纸简历用户协议\n\n1. 服务内容\n用户可以使用本小程序进行简历制作、编辑、优化等操作。\n\n2. 用户责任\n用户承诺所有信息真实有效。\n\n3. 知识产权\n用户上传的内容归用户所有。\n\n4. 免责声明\n我们不对用户因使用本服务产生的损失负责。',
      showCancel: false,
      confirmText: '我已阅读'
    });
  },

  // 显示隐私政策
  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '一纸简历隐私政策\n\n1. 信息收集\n我们收集必要的用户信息以提供服务。\n\n2. 信息使用\n仅用于改进服务和用户体验。\n\n3. 信息保护\n我们采取措施保护您的信息安全。\n\n4. 第三方\n不会向第三方出售或共享您的个人信息。',
      showCancel: false,
      confirmText: '我已阅读'
    });
  }
});

