// pages/home/home.js
const app = getApp();
const storage = require('../../utils/storage');
const pageState = require('../../utils/page-state');

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

    // 加载用户信息
    const userInfo = app.globalData.userInfo || storage.getUserInfo() || {
      nickname: 'Mia',
      avatar: ''
    };

    // 加载简历列表
    this.loadResumeList();

    this.setData({
      userInfo,
      ...pageState.setSuccess(this.data)
    });
  },

  // 加载简历列表
  loadResumeList() {
    let resumeList = app.globalData.resumeList;

    if (!resumeList || resumeList.length === 0) {
      resumeList = storage.getResumeList();
    }

    if (!resumeList || resumeList.length === 0) {
      resumeList = [
        {
          id: 1,
          title: '产品经理-校招版',
          updateTime: '2 小时前',
          progress: 85,
          status: 'draft'
        },
        {
          id: 2,
          title: '设计实习生',
          updateTime: '5 天前',
          progress: 100,
          status: 'completed'
        },
        {
          id: 3,
          title: '运营岗-社招',
          updateTime: '1 周前',
          progress: 40,
          status: 'draft'
        }
      ];
    }

    this.setData({
      resumeList: resumeList.slice(0, 3) // 只显示最近的3个
    });

    // 保存到本地存储
    storage.setResumeList(resumeList);
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
