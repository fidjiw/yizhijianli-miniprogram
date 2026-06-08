// pages/my-resumes/my-resumes.js
const app = getApp();

Page({
  data: {
    resumes: []
  },

  onLoad() {
    this.loadResumes();
  },

  onShow() {
    this.loadResumes();
  },

  loadResumes() {
    const resumes = app.globalData.resumeList || [];
    this.setData({ resumes });
  },

  createNew() {
    wx.navigateTo({
      url: '/pages/templates/templates'
    });
  },

  handleResumeClick(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editor/editor?id=' + id
    });
  }
});
