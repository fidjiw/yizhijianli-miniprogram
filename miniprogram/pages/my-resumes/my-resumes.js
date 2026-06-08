// pages/my-resumes/my-resumes.js
const db = require('../../utils/db');
const wxAuth = require('../../utils/wx-auth');

// 模板名称映射
const TEMPLATE_NAMES = {
  1: '清新简约',
  2: '活力橙调',
  3: '商务蓝调',
  4: '紫调创意',
  5: '极简黑白',
  6: '活力青春'
};

Page({
  data: {
    resumes: [],
    loading: true,
    empty: false
  },

  onLoad() {
    // 检查登录状态
    if (!wxAuth.checkLogin()) {
      wx.showModal({
        title: '未登录',
        content: '请先登录后查看简历',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.reLaunch({
              url: '/pages/welcome/welcome'
            });
          }
        }
      });
      return;
    }

    this.loadResumes();
  },

  onShow() {
    // 每次显示页面时重新加载
    if (wxAuth.checkLogin()) {
      this.loadResumes();
    }
  },

  // 加载简历列表
  loadResumes() {
    this.setData({ loading: true });

    db.getUserResumes()
      .then(resumes => {
        // 为每份简历添加模板名称
        const resumesWithTemplate = resumes.map(resume => ({
          ...resume,
          templateName: TEMPLATE_NAMES[resume.templateId || 1] || '清新简约'
        }));

        this.setData({
          resumes: resumesWithTemplate,
          loading: false,
          empty: resumesWithTemplate.length === 0
        });
      })
      .catch(err => {
        console.error('加载简历列表失败:', err);
        this.setData({
          loading: false,
          empty: true
        });
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  // 创建新简历
  createNew() {
    wx.navigateTo({
      url: '/pages/templates/templates'
    });
  },

  // 点击简历卡片
  handleResumeClick(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editor/editor?id=' + id
    });
  },

  // 编辑简历
  handleEdit(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editor/editor?id=' + id
    });
  },

  // 预览简历
  handlePreview(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/preview/preview?id=' + id
    });
  },

  // 删除简历
  handleDelete(e) {
    const id = e.currentTarget.dataset.id;
    const name = e.currentTarget.dataset.name;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除简历"${name}"吗？删除后无法恢复。`,
      confirmText: '删除',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });

          db.deleteResume(id)
            .then(() => {
              wx.hideLoading();
              wx.showToast({
                title: '删除成功',
                icon: 'success'
              });

              // 重新加载列表
              this.loadResumes();
            })
            .catch(err => {
              wx.hideLoading();
              console.error('删除失败:', err);
              wx.showToast({
                title: '删除失败',
                icon: 'none'
              });
            });
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadResumes();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
