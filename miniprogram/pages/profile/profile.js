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
    // 新版微信使用 open-type="chooseAvatar" 按钮，不需要这个方法了
    wx.showToast({
      title: '请点击头像选择',
      icon: 'none'
    });
  },

  // 选择头像（新版API）
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;

    console.log('选择的头像:', avatarUrl);

    // 临时方案：直接使用临时路径，不上传云存储
    // 真机上临时路径也可以显示
    this.saveUserInfo(null, avatarUrl);

    // 如果需要永久保存，取消下面的注释：
    /*
    wx.showLoading({ title: '上传中...' });

    // 上传头像到云存储
    const cloudPath = `avatars/${wxAuth.getUserId()}_${Date.now()}.jpg`;

    wx.cloud.uploadFile({
      cloudPath,
      filePath: avatarUrl,
      success: (res) => {
        const cloudAvatarUrl = res.fileID;
        this.saveUserInfo(null, cloudAvatarUrl);
      },
      fail: (error) => {
        console.error('上传头像失败:', error);
        // 上传失败，使用临时路径
        this.saveUserInfo(null, avatarUrl);
      }
    });
    */
  },

  // 昵称输入完成
  onNicknameBlur(e) {
    const nickname = e.detail.value;

    if (nickname && nickname.trim()) {
      this.saveUserInfo(nickname.trim(), null);
    }
  },

  // 保存用户信息
  saveUserInfo(nickname, avatarUrl) {
    const currentUserInfo = storage.getUserInfo() || {};
    const userId = wxAuth.getUserId();

    console.log('保存用户信息 - 当前:', currentUserInfo);
    console.log('保存用户信息 - userId:', userId);
    console.log('保存用户信息 - nickname:', nickname);
    console.log('保存用户信息 - avatarUrl:', avatarUrl);

    // 更新用户信息
    const newUserInfo = {
      ...currentUserInfo,
      userId: userId
    };

    if (nickname) {
      newUserInfo.nickname = nickname;
    }

    if (avatarUrl) {
      newUserInfo.avatar = avatarUrl;
    }

    console.log('保存用户信息 - 新信息:', newUserInfo);

    // 保存到本地
    storage.setUserInfo(newUserInfo);
    console.log('✓ 已保存到本地存储');

    // 保存到云数据库
    wx.showLoading({ title: '保存中...' });

    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        nickName: newUserInfo.nickname || '',
        avatarUrl: newUserInfo.avatar || ''
      },
      success: (result) => {
        wx.hideLoading();
        console.log('✓ 云函数调用成功:', result);

        wx.showToast({
          title: '保存成功',
          icon: 'success'
        });

        // 刷新显示
        this.loadUserInfo();
      },
      fail: (error) => {
        wx.hideLoading();
        console.error('❌ 云函数调用失败:', error);

        wx.showToast({
          title: '保存失败: ' + error.errMsg,
          icon: 'none',
          duration: 3000
        });

        // 即使云函数失败，本地已保存，也刷新显示
        this.loadUserInfo();
      }
    });
  },

  // 授权获取用户信息（废弃的方法，保留兼容）
  authorizeUserInfo() {
    wx.showModal({
      title: '提示',
      content: '请点击头像选择照片，点击昵称输入框修改昵称',
      showCancel: false,
      confirmText: '知道了'
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
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '退出登录后需要重新登录才能使用',
      confirmText: '退出',
      cancelText: '取消',
      confirmColor: '#FF4444',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '退出中...' });

          wxAuth.logout()
            .then(() => {
              wx.hideLoading();
              wx.showToast({
                title: '已退出登录',
                icon: 'success'
              });

              // 跳转到欢迎页
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/welcome/welcome'
                });
              }, 1500);
            })
            .catch((error) => {
              wx.hideLoading();
              console.error('退出失败:', error);
              wx.showToast({
                title: '退出失败',
                icon: 'none'
              });
            });
        }
      }
    });
  }
});
