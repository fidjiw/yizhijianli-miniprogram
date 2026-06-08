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
        const resumesWithPreview = resumes.map(resume => this.buildResumeCard(resume));

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

  buildResumeCard(resume) {
    const name = this.getFirstText(resume.name, resume.basicInfo && resume.basicInfo.name, '未命名简历');
    const position = this.getFirstText(resume.position, resume.basicInfo && resume.basicInfo.position, '职位未设置');
    const summary = this.getFirstText(
      resume.summary,
      resume.basicInfo && resume.basicInfo.summary,
      '补充个人简介后，预览会展示你的核心优势'
    );
    const progress = resume.progress || this.calculateProgress(resume);
    const accent = this.pickAccent(resume.templateId);

    return {
      ...resume,
      id: resume._id || resume.id,
      title: name,
      position,
      updateTime: this.formatUpdateTime(resume.updatedAt || resume.updateTime),
      progress,
      preview: {
        name,
        position,
        summary,
        accent,
        lines: this.getPreviewLines(resume, position)
      }
    };
  },

  getFirstText(...values) {
    const value = values.find(item => typeof item === 'string' && item.trim());
    return value ? value.trim() : '';
  },

  getPreviewLines(resume, position) {
    const experience = resume.experience || resume.workExperience || [];
    const education = resume.education || [];
    const skills = resume.skills || [];
    const lines = [];

    if (experience[0]) {
      lines.push(this.getFirstText(
        experience[0].company && experience[0].position
          ? `${experience[0].company} · ${experience[0].position}`
          : '',
        experience[0].description
      ));
    }

    if (education[0]) {
      lines.push(this.getFirstText(
        education[0].school && education[0].major
          ? `${education[0].school} · ${education[0].major}`
          : '',
        education[0].description
      ));
    }

    if (skills.length > 0) {
      const skillNames = skills.map(item => typeof item === 'string' ? item : item.name).filter(Boolean);
      if (skillNames.length > 0) {
        lines.push(skillNames.slice(0, 4).join(' · '));
      }
    }

    return lines.filter(Boolean).slice(0, 2).concat([
      `${position}方向简历`,
      '点击继续完善内容'
    ]).slice(0, 2);
  },

  calculateProgress(resume) {
    const checks = [
      resume.name,
      resume.position,
      resume.phone,
      resume.email,
      resume.summary,
      resume.education && resume.education.length,
      resume.experience && resume.experience.length,
      resume.skills && resume.skills.length
    ];
    const filled = checks.filter(Boolean).length;
    return Math.max(20, Math.round((filled / checks.length) * 100));
  },

  formatUpdateTime(value) {
    if (!value) return '刚刚';
    if (typeof value === 'string') return value;
    if (value.toDate) {
      return value.toDate().toLocaleDateString();
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return '最近';
  },

  pickAccent(templateId) {
    const accents = ['#0FB9A6', '#F97316', '#2563EB', '#7C3AED', '#111827', '#EA580C'];
    const index = Math.max(0, Number(templateId || 1) - 1) % accents.length;
    return accents[index];
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
