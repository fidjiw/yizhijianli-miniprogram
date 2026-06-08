// pages/settings/settings.js
const storage = require('../../utils/storage');

Page({
  data: {
    version: '1.0.0',
    cacheSize: '0 KB'
  },

  onLoad() {
    this.calculateCacheSize();
  },

  // 计算缓存大小
  calculateCacheSize() {
    try {
      const userInfo = storage.getUserInfo();
      const size = JSON.stringify(userInfo).length;
      const kb = (size / 1024).toFixed(2);
      this.setData({
        cacheSize: kb + ' KB'
      });
    } catch (err) {
      console.error('计算缓存失败:', err);
    }
  },

  // 清除缓存
  handleClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除本地缓存吗？不会删除云端数据。',
      confirmText: '清除',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清除中...' });

          // 清除本地存储（保留 token 和 userId）
          const token = wx.getStorageSync('token');
          const userId = wx.getStorageSync('userId');

          wx.clearStorage({
            success: () => {
              // 恢复 token 和 userId
              if (token) wx.setStorageSync('token', token);
              if (userId) wx.setStorageSync('userId', userId);

              wx.hideLoading();
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              });

              this.calculateCacheSize();
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({
                title: '清除失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  // 用户协议
  goToAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // 隐私政策
  goToPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },

  // 关于我们
  handleAbout() {
    wx.showModal({
      title: '关于一纸简历',
      content: '一纸简历是一款智能简历制作小程序，帮助求职者快速制作专业简历。\n\n版本：' + this.data.version,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 联系客服
  handleContact() {
    wx.showModal({
      title: '联系客服',
      content: '如有问题或建议，请添加微信客服：yizhijianli\n\n工作时间：9:00-18:00',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 检查更新
  handleCheckUpdate() {
    wx.showLoading({ title: '检查中...' });

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      wx.hideLoading();

      if (res.hasUpdate) {
        wx.showModal({
          title: '发现新版本',
          content: '发现新版本，是否下载并重启应用？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              updateManager.onUpdateReady(() => {
                updateManager.applyUpdate();
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: '已是最新版本',
          icon: 'success'
        });
      }
    });

    updateManager.onUpdateFailed(() => {
      wx.hideLoading();
      wx.showToast({
        title: '检查更新失败',
        icon: 'none'
      });
    });
  }
});
