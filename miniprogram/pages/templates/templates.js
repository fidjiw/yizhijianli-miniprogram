// pages/templates/templates.js
Page({
  data: {
    activeCategory: 'all',
    templates: [
      {
        id: 1,
        name: '清新简约',
        category: '通用',
        vip: false,
        hot: true,
        bgColor: 'linear-gradient(160deg, #E6FBF7, #C9F3EC)'
      },
      {
        id: 2,
        name: '活力橙调',
        category: '设计',
        vip: true,
        hot: false,
        bgColor: 'linear-gradient(160deg, #FFF1E9, #FFE0D2)'
      },
      {
        id: 3,
        name: '商务蓝调',
        category: '求职',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #EAF0FF, #D5E2FF)'
      },
      {
        id: 4,
        name: '紫调创意',
        category: '运营',
        vip: true,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F3ECFF, #E5D9FF)'
      },
      {
        id: 5,
        name: '极简黑白',
        category: '通用',
        vip: false,
        hot: false,
        bgColor: 'linear-gradient(160deg, #F8F9FA, #E9ECEF)'
      },
      {
        id: 6,
        name: '活力青春',
        category: '校招',
        vip: false,
        hot: true,
        bgColor: 'linear-gradient(160deg, #FFF5E6, #FFE8CC)'
      }
    ]
  },

  onLoad() {
    // 加载模板数据
  },

  // 切换分类
  handleCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      activeCategory: category
    });

    // TODO: 根据分类筛选模板
    console.log('切换分类:', category);
  },

  // 点击模板
  handleTemplateClick(e) {
    const id = e.currentTarget.dataset.id;
    const template = this.data.templates.find(t => t.id === id);

    // 如果是VIP模板，检查会员状态
    if (template.vip) {
      wx.showModal({
        title: '会员专享',
        content: '该模板为会员专享，是否开通会员？',
        confirmText: '去开通',
        success: (res) => {
          if (res.confirm) {
            // TODO: 跳转到会员购买页
            console.log('跳转到会员页');
          }
        }
      });
      return;
    }

    // 使用模板创建简历
    wx.showModal({
      title: '使用模板',
      content: '是否使用此模板创建新简历？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/editor/editor?templateId=' + id
          });
        }
      }
    });
  }
});
