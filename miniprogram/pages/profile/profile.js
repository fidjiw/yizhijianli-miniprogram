// pages/profile/profile.js
const app = getApp();
const storage = require('../../utils/storage');
const wxAuth = require('../../utils/wx-auth');

Page({
  data: {
    userInfo: {}
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    // 从本地存储获取真实用户信息
    const userInfo = storage.getUserInfo();
    const userId = wxAuth.getUserId();

    if (userInfo && userInfo.nickname) {
      // 有真实用户信息
      this.setData({
        userInfo: {
          id: userId || '未登录',
          nickname: userInfo.nickname,
          avatar: userInfo.avatar || '',
          vip: false,
          aiCount: 12,
          resumeCount: 5,
          exportCount: 8
        }
      });
    } else {
      // 没有用户信息，显示默认或提示授权
      this.setData({
        userInfo: {
          id: userId || '未登录',
          nickname: '点击授权获取昵称',
          avatar: '',
          vip: false,
          aiCount: 0,
          resumeCount: 0,
          exportCount: 0
        }
      });
    }
  },

  // 点击头像授权
  handleAvatarTap() {
    const userInfo = storage.getUserInfo();

    // 如果没有昵称，提示授权
    if (!userInfo || !userInfo.nickname) {
      wx.showModal({
        title: '完善资料',
        content: '授权获取头像和昵称，让你的个人中心更完整',
        confirmText: '授权',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.authorizeUserInfo();
          }
        }
      });
    }
  },

  // 授权获取用户信息
  authorizeUserInfo() {
    wx.showLoading({ title: '授权中...' });

    wxAuth.authorizeUserProfile()
      .then((userInfo) => {
        wx.hideLoading();
        wx.showToast({
          title: '授权成功',
          icon: 'success'
        });

        // 重新加载用户信息
        this.loadUserInfo();
      })
      .catch((error) => {
        wx.hideLoading();
        console.error('授权失败:', error);
        wx.showToast({
          title: '授权失败',
          icon: 'none'
        });
      });
  },

  // 跳转到会员页
  goToVip() {
    wx.showModal({
      title: '开通会员',
      content: '会员可享受：\n· 解锁全部模板\n· 无限 AI 优化次数\n· 去除导出水印\n· 优先客服支持',
      confirmText: '立即开通',
      success: (res) => {
        if (res.confirm) {
          // TODO: 跳转到支付页面
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 我的模板
  goToMyTemplates() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 数据统计
  goToStats() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 设置
  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
