// pages/favorites/favorites.js
const db = require('../../utils/db');

Page({
  data: {
    templates: [],
    loading: true,
    empty: false
  },

  onLoad() {
    this.loadFavorites();
  },

  onShow() {
    this.loadFavorites();
  },

  // 加载收藏的模板
  loadFavorites() {
    this.setData({ loading: true });

    db.getUserFavoriteTemplates()
      .then(favorites => {
        // TODO: 根据 templateId 获取模板详情
        this.setData({
          templates: favorites,
          loading: false,
          empty: favorites.length === 0
        });
      })
      .catch(err => {
        console.error('加载收藏失败:', err);
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

  // 取消收藏
  handleUnfavorite(e) {
    const templateId = e.currentTarget.dataset.id;

    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这个模板吗？',
      success: (res) => {
        if (res.confirm) {
          db.removeFavoriteTemplate(templateId)
            .then(() => {
              wx.showToast({
                title: '已取消收藏',
                icon: 'success'
              });
              this.loadFavorites();
            })
            .catch(err => {
              console.error('取消收藏失败:', err);
              wx.showToast({
                title: '操作失败',
                icon: 'none'
              });
            });
        }
      }
    });
  },

  // 使用模板
  handleUseTemplate(e) {
    const templateId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/editor/editor?templateId=' + templateId
    });
  }
});
