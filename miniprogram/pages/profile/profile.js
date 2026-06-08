// pages/profile/profile.js
const app = getApp();

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
    const userInfo = app.globalData.userInfo || {
      id: 8866,
      nickname: 'Mia',
      avatar: '',
      vip: false,
      aiCount: 12,
      resumeCount: 5,
      exportCount: 8
    };

    this.setData({ userInfo });
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
