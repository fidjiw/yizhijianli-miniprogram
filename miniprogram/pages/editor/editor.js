// pages/editor/editor.js
const db = require('../../utils/db');
const wxAuth = require('../../utils/wx-auth');

Page({
  data: {
    activeTab: 'basic',
    resumeId: null,
    templateId: null,
    isNewResume: true,

    // 简历数据
    resumeData: {
      name: '',
      position: '',
      phone: '',
      email: '',
      avatar: '',
      birthday: '',
      location: '',
      summary: '',

      // 教育经历
      education: [],

      // 工作经历
      experience: [],

      // 技能
      skills: [],

      // 项目经历
      projects: []
    },

    // 自动保存状态
    autoSaving: false,
    lastSaved: null
  },

  onLoad(options) {
    const { id, templateId } = options;

    // 检查登录
    if (!wxAuth.checkLogin()) {
      wx.showModal({
        title: '未登录',
        content: '请先登录后编辑简历',
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

    if (id) {
      // 编辑已有简历
      this.setData({
        resumeId: id,
        isNewResume: false
      });
      this.loadResumeData(id);
    } else if (templateId) {
      // 使用模板创建新简历
      this.setData({
        templateId: templateId,
        isNewResume: true
      });
      this.createFromTemplate(templateId);
    } else {
      // 全新创建
      this.setData({ isNewResume: true });
    }

    // 启动自动保存
    this.startAutoSave();
  },

  onUnload() {
    // 页面卸载时保存
    this.saveResume(true);

    // 清除自动保存定时器
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
  },

  // 加载简历数据
  loadResumeData(id) {
    wx.showLoading({ title: '加载中...' });

    db.getResumeById(id)
      .then(resume => {
        wx.hideLoading();
        this.setData({
          resumeData: resume
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载简历失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      });
  },

  // 从模板创建
  createFromTemplate(templateId) {
    // 使用模板初始化简历
    console.log('使用模板:', templateId);

    // TODO: 从模板库获取模板数据
    // 这里先使用默认数据
    this.setData({
      resumeData: {
        ...this.data.resumeData,
        name: '请输入姓名',
        position: '请输入职位'
      }
    });
  },

  // 切换tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // ============ 基本信息编辑 ============

  onNameInput(e) {
    this.setData({ 'resumeData.name': e.detail.value });
  },

  onPositionInput(e) {
    this.setData({ 'resumeData.position': e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ 'resumeData.phone': e.detail.value });
  },

  onEmailInput(e) {
    this.setData({ 'resumeData.email': e.detail.value });
  },

  onBirthdayInput(e) {
    this.setData({ 'resumeData.birthday': e.detail.value });
  },

  onLocationInput(e) {
    this.setData({ 'resumeData.location': e.detail.value });
  },

  onSummaryInput(e) {
    this.setData({ 'resumeData.summary': e.detail.value });
  },

  // ============ 教育经历 ============

  addEducation() {
    const education = this.data.resumeData.education || [];
    education.push({
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    this.setData({ 'resumeData.education': education });
  },

  removeEducation(e) {
    const index = e.currentTarget.dataset.index;
    const education = this.data.resumeData.education;
    education.splice(index, 1);
    this.setData({ 'resumeData.education': education });
  },

  onEducationInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`resumeData.education[${index}].${field}`]: value
    });
  },

  // ============ 工作经历 ============

  addExperience() {
    const experience = this.data.resumeData.experience || [];
    experience.push({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    this.setData({ 'resumeData.experience': experience });
  },

  removeExperience(e) {
    const index = e.currentTarget.dataset.index;
    const experience = this.data.resumeData.experience;
    experience.splice(index, 1);
    this.setData({ 'resumeData.experience': experience });
  },

  onExperienceInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`resumeData.experience[${index}].${field}`]: value
    });
  },

  // ============ 技能 ============

  addSkill() {
    const skills = this.data.resumeData.skills || [];
    skills.push({
      name: '',
      level: '熟练'
    });
    this.setData({ 'resumeData.skills': skills });
  },

  removeSkill(e) {
    const index = e.currentTarget.dataset.index;
    const skills = this.data.resumeData.skills;
    skills.splice(index, 1);
    this.setData({ 'resumeData.skills': skills });
  },

  onSkillInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({
      [`resumeData.skills[${index}].${field}`]: value
    });
  },

  // ============ 保存功能 ============

  // 启动自动保存
  startAutoSave() {
    // 每30秒自动保存一次
    this.autoSaveTimer = setInterval(() => {
      this.saveResume(true);
    }, 30000);
  },

  // 保存简历
  saveResume(silent = false) {
    if (!silent) {
      wx.showLoading({ title: '保存中...' });
    }

    this.setData({ autoSaving: true });

    const resumeData = this.data.resumeData;

    // 验证必填字段
    if (!resumeData.name || !resumeData.position) {
      if (!silent) {
        wx.hideLoading();
        wx.showToast({
          title: '请填写姓名和职位',
          icon: 'none'
        });
      }
      this.setData({ autoSaving: false });
      return;
    }

    const savePromise = this.data.isNewResume
      ? db.createResume(resumeData)
      : db.updateResume(this.data.resumeId, resumeData);

    savePromise
      .then((result) => {
        if (!silent) {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        }

        // 如果是新建简历，更新 resumeId
        if (this.data.isNewResume && result) {
          this.setData({
            resumeId: result,
            isNewResume: false
          });
        }

        this.setData({
          autoSaving: false,
          lastSaved: new Date().toLocaleTimeString()
        });
      })
      .catch(err => {
        console.error('保存失败:', err);
        if (!silent) {
          wx.hideLoading();
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
        this.setData({ autoSaving: false });
      });
  },

  // 手动保存
  handleSave() {
    this.saveResume(false);
  },

  // ============ 其他功能 ============

  // 返回
  handleBack() {
    // 提示保存
    if (this.data.isNewResume || !this.data.lastSaved) {
      wx.showModal({
        title: '提示',
        content: '是否保存当前简历？',
        success: (res) => {
          if (res.confirm) {
            this.saveResume(false);
            setTimeout(() => {
              wx.navigateBack();
            }, 1000);
          } else {
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },

  // 预览
  handlePreview() {
    // 先保存
    this.saveResume(false);

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/preview/preview?id=' + this.data.resumeId
      });
    }, 500);
  },

  // AI生成
  handleAIGenerate() {
    wx.navigateTo({
      url: '/pages/ai-optimize/ai-optimize?resumeId=' + this.data.resumeId
    });
  },

  // 下一步
  handleNext() {
    const tabs = ['basic', 'education', 'experience', 'skills'];
    const currentIndex = tabs.indexOf(this.data.activeTab);

    if (currentIndex < tabs.length - 1) {
      this.setData({ activeTab: tabs[currentIndex + 1] });
    } else {
      // 最后一步，保存并预览
      this.handlePreview();
    }
  }
});
