// pages/ai-optimize/ai-optimize.js
Page({
  data: {
    suggestions: [
      {
        id: 1,
        icon: '✨',
        title: '用数据量化成果',
        desc: '"提升了转化率" → "将转化率提升 28%"'
      },
      {
        id: 2,
        icon: '🎯',
        title: '补充关键词',
        desc: '岗位 JD 中"数据分析"未出现'
      },
      {
        id: 3,
        icon: '📐',
        title: '精简篇幅',
        desc: '建议控制在 1 页内'
      }
    ]
  },

  onLoad() {
    // 加载简历数据并分析
    this.analyzeResume();
  },

  // 分析简历
  analyzeResume() {
    wx.showLoading({ title: 'AI 分析中...' });

    // TODO: 调用AI接口分析简历
    setTimeout(() => {
      wx.hideLoading();
    }, 1500);
  },

  // 应用单条建议
  applySuggestion(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '已应用',
      icon: 'success'
    });

    // TODO: 应用优化建议
    console.log('应用建议:', id);
  },

  // 一键采纳全部
  applyAll() {
    wx.showLoading({ title: '应用中...' });

    // TODO: 批量应用所有建议
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '已采纳全部建议',
        icon: 'success'
      });

      // 跳转到编辑器查看结果
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/editor/editor'
        });
      }, 1500);
    }, 1500);
  }
});
