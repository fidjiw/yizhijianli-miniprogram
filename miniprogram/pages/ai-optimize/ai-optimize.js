// pages/ai-optimize/ai-optimize.js
const db = require('../../utils/db');
const storage = require('../../utils/storage');

Page({
  data: {
    resumeId: null,
    resumeData: null,
    analyzing: true,
    suggestions: [],
    appliedSuggestions: [] // 已应用的建议ID
  },

  onLoad(options) {
    const { resumeId } = options;
    if (resumeId) {
      this.setData({ resumeId });
      this.loadAndAnalyze(resumeId);
    } else {
      wx.showToast({
        title: '简历ID不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 加载简历并分析
  async loadAndAnalyze(resumeId) {
    this.setData({ analyzing: true });

    try {
      // 加载简历数据
      const resume = await db.getResumeById(resumeId);
      this.setData({ resumeData: resume });

      // 分析简历
      await this.analyzeResume(resume);
    } catch (err) {
      console.error('加载失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ analyzing: false });
    }
  },

  // 分析简历
  async analyzeResume(resume) {
    wx.showLoading({ title: 'AI 分析中...' });

    try {
      // TODO: 调用真实的 AI 接口
      // 这里使用模拟数据演示功能
      const suggestions = await this.mockAIAnalysis(resume);

      wx.hideLoading();
      this.setData({ suggestions });

      // 更新 AI 使用次数
      this.updateAICount();
    } catch (err) {
      wx.hideLoading();
      console.error('AI 分析失败:', err);
      wx.showToast({
        title: '分析失败',
        icon: 'none'
      });
    }
  },

  // 模拟 AI 分析（实际项目中替换为真实 AI 接口）
  mockAIAnalysis(resume) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestions = [];

        // 分析基本信息
        if (!resume.summary || resume.summary.length < 50) {
          suggestions.push({
            id: 'summary',
            type: 'add',
            icon: '✨',
            title: '添加个人简介',
            desc: '建议添加 50-100 字的个人简介，突出核心优势',
            field: 'summary',
            originalValue: resume.summary || '',
            suggestedValue: '我是一名拥有3年经验的' + (resume.position || '专业人士') + '，擅长项目管理和团队协作，在过往工作中成功完成多个重要项目。'
          });
        }

        // 分析工作经历
        if (resume.experience && resume.experience.length > 0) {
          resume.experience.forEach((exp, index) => {
            if (exp.description && !exp.description.includes('数据') && !exp.description.includes('%')) {
              suggestions.push({
                id: `exp_${index}`,
                type: 'enhance',
                icon: '📊',
                title: '用数据量化成果',
                desc: `"${exp.company}" 的工作描述可以添加具体数据`,
                field: 'experience',
                index: index,
                originalValue: exp.description,
                suggestedValue: exp.description + '\n• 成功提升团队效率 30%，项目按时交付率达 95%'
              });
            }
          });
        }

        // 分析技能
        if (!resume.skills || resume.skills.length < 3) {
          suggestions.push({
            id: 'skills',
            type: 'add',
            icon: '🎯',
            title: '补充技能标签',
            desc: '建议添加 5-8 个与岗位相关的技能',
            field: 'skills',
            originalValue: resume.skills || [],
            suggestedValue: [
              { name: '项目管理' },
              { name: '团队协作' },
              { name: '数据分析' },
              { name: 'PPT制作' },
              { name: 'Excel' }
            ]
          });
        }

        // 分析教育经历
        if (resume.education && resume.education.length > 0) {
          resume.education.forEach((edu, index) => {
            if (!edu.description) {
              suggestions.push({
                id: `edu_${index}`,
                type: 'add',
                icon: '🎓',
                title: '补充教育亮点',
                desc: `"${edu.school}" 可以补充获奖、成绩等信息`,
                field: 'education',
                index: index,
                originalValue: edu.description || '',
                suggestedValue: '专业排名前 10%，获得优秀毕业生称号'
              });
            }
          });
        }

        // 通用建议
        suggestions.push({
          id: 'general_1',
          type: 'tip',
          icon: '💡',
          title: '使用 STAR 法则',
          desc: '描述工作经历时，建议使用 Situation（情境）、Task（任务）、Action（行动）、Result（结果）的结构',
          field: null
        });

        resolve(suggestions);
      }, 1500);
    });
  },

  // 应用单条建议
  applySuggestion(e) {
    const id = e.currentTarget.dataset.id;
    const suggestion = this.data.suggestions.find(s => s.id === id);

    if (!suggestion || suggestion.type === 'tip') {
      wx.showToast({
        title: '这是提示性建议',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '应用建议',
      content: '确定要应用这条优化建议吗？',
      success: (res) => {
        if (res.confirm) {
          this.doApplySuggestion(suggestion);
        }
      }
    });
  },

  // 执行应用建议
  async doApplySuggestion(suggestion) {
    wx.showLoading({ title: '应用中...' });

    try {
      const resumeData = { ...this.data.resumeData };

      // 根据建议类型修改数据
      switch (suggestion.field) {
        case 'summary':
          resumeData.summary = suggestion.suggestedValue;
          break;

        case 'experience':
          resumeData.experience[suggestion.index].description = suggestion.suggestedValue;
          break;

        case 'education':
          resumeData.education[suggestion.index].description = suggestion.suggestedValue;
          break;

        case 'skills':
          resumeData.skills = suggestion.suggestedValue;
          break;
      }

      // 保存到数据库
      await db.updateResume(this.data.resumeId, resumeData);

      wx.hideLoading();
      wx.showToast({
        title: '已应用',
        icon: 'success'
      });

      // 标记为已应用
      const appliedSuggestions = [...this.data.appliedSuggestions, suggestion.id];
      this.setData({
        appliedSuggestions,
        resumeData
      });
    } catch (err) {
      wx.hideLoading();
      console.error('应用失败:', err);
      wx.showToast({
        title: '应用失败',
        icon: 'none'
      });
    }
  },

  // 一键采纳全部
  applyAll() {
    const canApplySuggestions = this.data.suggestions.filter(s => s.type !== 'tip');

    if (canApplySuggestions.length === 0) {
      wx.showToast({
        title: '没有可应用的建议',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '一键采纳',
      content: `确定要采纳全部 ${canApplySuggestions.length} 条优化建议吗？`,
      success: (res) => {
        if (res.confirm) {
          this.doApplyAll(canApplySuggestions);
        }
      }
    });
  },

  // 执行批量应用
  async doApplyAll(suggestions) {
    wx.showLoading({ title: '应用中...' });

    try {
      let resumeData = { ...this.data.resumeData };

      // 依次应用所有建议
      suggestions.forEach(suggestion => {
        switch (suggestion.field) {
          case 'summary':
            resumeData.summary = suggestion.suggestedValue;
            break;

          case 'experience':
            resumeData.experience[suggestion.index].description = suggestion.suggestedValue;
            break;

          case 'education':
            resumeData.education[suggestion.index].description = suggestion.suggestedValue;
            break;

          case 'skills':
            resumeData.skills = suggestion.suggestedValue;
            break;
        }
      });

      // 保存到数据库
      await db.updateResume(this.data.resumeId, resumeData);

      wx.hideLoading();
      wx.showToast({
        title: '已采纳全部建议',
        icon: 'success'
      });

      // 跳转到编辑器查看结果
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/editor/editor?id=' + this.data.resumeId
        });
      }, 1500);
    } catch (err) {
      wx.hideLoading();
      console.error('批量应用失败:', err);
      wx.showToast({
        title: '应用失败',
        icon: 'none'
      });
    }
  },

  // 更新 AI 使用次数
  updateAICount() {
    const userInfo = storage.getUserInfo();
    userInfo.aiCount = (userInfo.aiCount || 0) + 1;
    storage.setUserInfo(userInfo);
  },

  // 查看建议详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    const suggestion = this.data.suggestions.find(s => s.id === id);

    if (!suggestion) return;

    const content = suggestion.type === 'tip'
      ? suggestion.desc
      : `原内容：\n${suggestion.originalValue || '（无）'}\n\n优化后：\n${suggestion.suggestedValue}`;

    wx.showModal({
      title: suggestion.title,
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 返回编辑器
  handleBack() {
    wx.navigateBack();
  }
});
