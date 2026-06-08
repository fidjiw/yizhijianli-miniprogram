// pages/editor/editor.js
Page({
  data: {
    activeTab: 'basic',
    resumeData: {
      name: '林思禾',
      position: '产品经理',
      phone: '138••••6688',
      email: 'mia@mail.com'
    }
  },

  onLoad(options) {
    const { id, templateId } = options;
    if (id) {
      // 编辑已有简历
      this.loadResumeData(id);
    } else if (templateId) {
      // 使用模板创建新简历
      this.createFromTemplate(templateId);
    }
  },

  // 加载简历数据
  loadResumeData(id) {
    // TODO: 从后端加载简历数据
    console.log('加载简历:', id);
  },

  // 从模板创建
  createFromTemplate(templateId) {
    // TODO: 使用模板初始化简历
    console.log('使用模板:', templateId);
  },

  // 切换tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 返回
  handleBack() {
    wx.navigateBack();
  },

  // 预览
  handlePreview() {
    wx.navigateTo({
      url: '/pages/preview/preview'
    });
  },

  // AI生成
  handleAIGenerate() {
    wx.showLoading({ title: 'AI 生成中...' });

    // TODO: 调用AI接口生成内容
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '生成成功',
        icon: 'success'
      });
    }, 2000);
  },

  // 保存草稿
  handleSaveDraft() {
    wx.showToast({
      title: '已保存',
      icon: 'success'
    });

    // TODO: 保存到后端
  },

  // 下一步
  handleNext() {
    // 切换到下一个tab或跳转到预览
    const tabs = ['basic', 'education', 'experience', 'skills'];
    const currentIndex = tabs.indexOf(this.data.activeTab);

    if (currentIndex < tabs.length - 1) {
      this.setData({ activeTab: tabs[currentIndex + 1] });
    } else {
      // 最后一步，跳转到预览
      wx.navigateTo({
        url: '/pages/preview/preview'
      });
    }
  }
});
