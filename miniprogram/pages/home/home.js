// pages/home/home.js
const app = getApp();
const storage = require('../../utils/storage');
const pageState = require('../../utils/page-state');
const db = require('../../utils/db');

Page({
  data: {
    userInfo: {},
    resumeList: [],
    ...pageState.init()
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 每次显示时刷新简历列表
    this.loadResumeList();
  },

  // 加载数据
  loadData() {
    this.setData(pageState.setLoading(this.data));

    // 加载用户信息 - 从本地存储获取真实数据
    const userInfo = storage.getUserInfo();

    if (userInfo && userInfo.nickname) {
      // 有真实用户信息
      this.setData({ userInfo });
    } else {
      // 没有用户信息，显示默认
      this.setData({
        userInfo: {
          nickname: '未登录',
          avatar: ''
        }
      });
    }

    // 加载简历列表
    this.loadResumeList();

    this.setData({
      ...pageState.setSuccess(this.data)
    });
  },

  // 加载简历列表
  async loadResumeList() {
    try {
      // 从云数据库加载真实数据
      const resumes = await db.getUserResumes();

      if (resumes && resumes.length > 0) {
        // 为每份简历添加模板预览图
        const resumesWithPreview = resumes.map(resume => ({
          ...resume,
          // 如果简历有 templateId，使用对应模板的预览图
          // 否则使用默认预览图（这里预留，实际需要准备图片）
          preview: resume.templateId
            ? `/assets/images/templates/template-${resume.templateId}.png`
            : ''
        }));

        this.setData({
          resumeList: resumesWithPreview.slice(0, 3) // 只显示最近的3个
        });
      } else {
        // 使用示例数据
        this.setData({
          resumeList: []
        });
      }
    } catch (err) {
      console.error('加载简历列表失败:', err);
      // 降级使用本地数据
      this.setData({
        resumeList: []
      });
    }
  },

  // 新建简历
  handleCreateResume() {
    wx.navigateTo({
      url: '/pages/templates/templates'
    });
  },

  // 跳转到模板库
  goToTemplates() {
    wx.switchTab({
      url: '/pages/templates/templates'
    });
  },

  // 跳转到AI优化
  goToAI() {
    wx.switchTab({
      url: '/pages/ai-optimize/ai-optimize'
    });
  },

  // 导出
  goToExport() {
    if (this.data.resumeList.length === 0) {
      wx.showToast({
        title: '还没有简历哦',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/preview/preview?id=' + this.data.resumeList[0].id
    });
  },

  // 查看所有简历
  goToMyResumes() {
    wx.navigateTo({
      url: '/pages/my-resumes/my-resumes'
    });
  },

  // 点击简历卡片
  handleResumeClick(e) {
    const id = e.currentTarget.dataset.id;

    // 记录浏览历史
    const resume = this.data.resumeList.find(r => r.id === id);
    if (resume) {
      storage.addResumeHistory(id, resume);
    }

    wx.navigateTo({
      url: '/pages/editor/editor?id=' + id
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
