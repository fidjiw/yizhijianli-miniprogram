// pages/preview/preview.js
Page({
  data: {},

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadResumeData(id);
    }
  },

  loadResumeData(id) {
    // TODO: 加载简历数据
    console.log('加载简历:', id);
  },

  handleBack() {
    wx.navigateBack();
  },

  handleEdit() {
    wx.navigateBack();
  },

  handleExport() {
    wx.showActionSheet({
      itemList: ['导出为 PDF', '导出为长图', '生成在线链接', '分享到微信'],
      success: (res) => {
        const actions = ['PDF', '长图', '链接', '微信'];
        wx.showLoading({
          title: '生成' + actions[res.tapIndex] + '中...'
        });

        // TODO: 调用导出接口
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: '导出成功',
            icon: 'success'
          });
        }, 2000);
      }
    });
  }
});
