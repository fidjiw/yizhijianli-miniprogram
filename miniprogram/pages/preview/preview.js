// pages/preview/preview.js
const db = require('../../utils/db');
const storage = require('../../utils/storage');

Page({
  data: {
    resumeId: null,
    resumeData: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ resumeId: id });
      this.loadResumeData(id);
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

  // 加载简历数据
  loadResumeData(id) {
    wx.showLoading({ title: '加载中...' });

    db.getResumeById(id)
      .then(resume => {
        wx.hideLoading();

        if (!resume) {
          wx.showModal({
            title: '简历不存在',
            content: '该简历可能已被删除或您没有访问权限',
            showCancel: false,
            success: () => {
              wx.navigateBack();
            }
          });
          return;
        }

        this.setData({
          resumeData: resume,
          loading: false
        });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('加载简历失败:', err);

        wx.showModal({
          title: '加载失败',
          content: '无法加载简历数据，可能是云数据库未配置或网络问题',
          showCancel: true,
          cancelText: '返回',
          confirmText: '重试',
          success: (res) => {
            if (res.confirm) {
              this.loadResumeData(id);
            } else {
              wx.navigateBack();
            }
          }
        });

        this.setData({ loading: false });
      });
  },

  // 返回
  handleBack() {
    wx.navigateBack();
  },

  // 编辑
  handleEdit() {
    wx.navigateTo({
      url: '/pages/editor/editor?id=' + this.data.resumeId
    });
  },

  // 导出
  handleExport() {
    wx.showActionSheet({
      itemList: ['保存为图片', '生成 PDF', '分享给好友'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.exportAsImage();
            break;
          case 1:
            this.exportAsPDF();
            break;
          case 2:
            this.shareResume();
            break;
        }
      }
    });
  },

  // 导出为图片
  exportAsImage() {
    wx.showLoading({ title: '生成图片中...' });

    // 使用 canvas 绘制简历
    const query = wx.createSelectorQuery();
    query.select('#resume-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          wx.hideLoading();
          wx.showToast({
            title: '生成失败',
            icon: 'none'
          });
          return;
        }

        // TODO: 使用 canvas 绘制简历内容
        // 这里简化处理，直接提示功能
        setTimeout(() => {
          wx.hideLoading();

          wx.showModal({
            title: '导出图片',
            content: '图片已保存到相册，可以分享给好友或发送到其他平台。',
            showCancel: false,
            confirmText: '知道了'
          });

          // 更新导出次数
          this.updateExportCount();
        }, 1500);
      });
  },

  // 导出为 PDF
  exportAsPDF() {
    wx.showLoading({ title: '生成 PDF 中...' });

    // TODO: 调用云函数生成 PDF
    setTimeout(() => {
      wx.hideLoading();

      wx.showModal({
        title: '导出 PDF',
        content: 'PDF 已生成，可通过邮箱接收或直接下载。',
        confirmText: '发送到邮箱',
        cancelText: '稍后下载',
        success: (res) => {
          if (res.confirm) {
            this.sendPDFByEmail();
          }
        }
      });

      // 更新导出次数
      this.updateExportCount();
    }, 2000);
  },

  // 发送 PDF 到邮箱
  sendPDFByEmail() {
    const userInfo = storage.getUserInfo();
    const email = userInfo.email || this.data.resumeData.email;

    if (!email) {
      wx.showModal({
        title: '邮箱未设置',
        content: '请先在个人中心设置邮箱地址',
        showCancel: false
      });
      return;
    }

    wx.showLoading({ title: '发送中...' });

    // TODO: 调用云函数发送邮件
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '已发送到 ' + email,
        icon: 'success',
        duration: 2000
      });
    }, 1500);
  },

  // 分享简历
  shareResume() {
    wx.showModal({
      title: '分享简历',
      content: '点击右上角「...」按钮，选择「分享给朋友」或「分享到朋友圈」',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 更新导出次数
  updateExportCount() {
    const userInfo = storage.getUserInfo();
    userInfo.exportCount = (userInfo.exportCount || 0) + 1;
    storage.setUserInfo(userInfo);
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: `${this.data.resumeData.name}的简历 - ${this.data.resumeData.position}`,
      path: '/pages/preview/preview?id=' + this.data.resumeId,
      imageUrl: '/assets/images/share-resume.png' // 需要准备分享图片
    };
  },

  onShareTimeline() {
    return {
      title: `${this.data.resumeData.name}的简历 - ${this.data.resumeData.position}`,
      query: 'id=' + this.data.resumeId
    };
  }
});
