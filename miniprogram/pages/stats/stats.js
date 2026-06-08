// pages/stats/stats.js
const db = require('../../utils/db');
const storage = require('../../utils/storage');

Page({
  data: {
    stats: {
      resumeCount: 0,
      aiCount: 0,
      exportCount: 0,
      templateCount: 0
    },
    recentResumes: [],
    loading: true
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  // 加载统计数据
  async loadStats() {
    this.setData({ loading: true });

    try {
      // 获取用户信息
      const userInfo = storage.getUserInfo();

      // 获取简历列表
      const resumes = await db.getUserResumes();

      // 获取收藏的模板
      const favorites = await db.getUserFavoriteTemplates();

      // 更新统计数据
      this.setData({
        stats: {
          resumeCount: resumes.length,
          aiCount: userInfo.aiCount || 0,
          exportCount: userInfo.exportCount || 0,
          templateCount: favorites.length
        },
        recentResumes: resumes.slice(0, 5), // 最近5份简历
        loading: false
      });
    } catch (err) {
      console.error('加载统计数据失败:', err);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // 查看全部简历
  goToResumes() {
    wx.navigateTo({
      url: '/pages/my-resumes/my-resumes'
    });
  },

  // 查看简历详情
  viewResume(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editor/editor?id=' + id
    });
  }
});
