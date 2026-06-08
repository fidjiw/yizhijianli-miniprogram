// pages/my-resumes/my-resumes.js
const db = require('../../utils/db');
const wxAuth = require('../../utils/wx-auth');
const resumePreview = require('../../utils/resume-preview');

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

  onReady() {
    // 页面渲染完成后生成预览图
    this.generatePreviews();
  },

  // 加载简历列表
  loadResumes() {
    this.setData({ loading: true });

    db.getUserResumes()
      .then(resumes => {
        this.setData({
          resumes: resumes,
          loading: false,
          empty: resumes.length === 0
        });

        // 加载完成后生成预览图
        if (resumes.length > 0) {
          this.generatePreviews();
        }
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

  // 生成预览图
  generatePreviews() {
    const resumes = this.data.resumes;

    if (!resumes || resumes.length === 0) {
      return;
    }

    // 使用 Canvas 生成预览图
    resumePreview.generateBatchPreviews(resumes)
      .then(updatedList => {
        this.setData({
          resumes: updatedList
        });
      })
      .catch(err => {
        console.error('生成预览图失败:', err);
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
