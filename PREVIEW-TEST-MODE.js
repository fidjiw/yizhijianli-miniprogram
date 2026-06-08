// pages/preview/preview.js - 添加测试数据模式
const db = require('../../utils/db');
const storage = require('../../utils/storage');

// 测试数据（数据库未配置时使用）
const MOCK_RESUME = {
  _id: 'test-resume-001',
  name: '张小明',
  position: '高级产品经理',
  phone: '138-0000-0000',
  email: 'zhangxm@example.com',
  location: '北京',
  summary: '5年互联网产品经验，擅长从0到1打造产品，曾主导多个千万级用户产品的规划和落地。具备出色的需求分析、产品设计和项目管理能力。',
  education: [
    {
      school: '浙江大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2015.09',
      endDate: '2019.06',
      description: '专业排名前10%，获得优秀毕业生称号'
    }
  ],
  experience: [
    {
      company: '阿里巴巴集团',
      position: '高级产品经理',
      startDate: '2021.07',
      endDate: '至今',
      description: '负责钉钉企业版核心功能规划，主导多个重要项目。成功推动用户增长30%，产品满意度提升至4.8分。带领团队完成功能迭代50+次，获得年度最佳产品经理称号。'
    },
    {
      company: '字节跳动',
      position: '产品经理',
      startDate: '2019.07',
      endDate: '2021.06',
      description: '负责飞书项目管理模块设计，从0到1完成产品规划和上线。与技术团队紧密合作，确保产品按时高质量交付。参与用户调研100+次，深入理解用户需求。'
    }
  ],
  skills: [
    { name: '产品设计' },
    { name: '需求分析' },
    { name: '项目管理' },
    { name: 'Axure' },
    { name: 'Figma' },
    { name: 'SQL' },
    { name: 'Python' },
    { name: '数据分析' }
  ],
  templateId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

Page({
  data: {
    resumeId: null,
    resumeData: null,
    loading: true,
    useMockData: false  // 是否使用测试数据
  },

  onLoad(options) {
    const { id } = options;

    // 如果没有ID或ID是test，使用测试数据
    if (!id || id === 'test') {
      this.setData({
        resumeId: 'test',
        useMockData: true
      });
      this.loadMockData();
      return;
    }

    this.setData({ resumeId: id });
    this.loadResumeData(id);
  },

  // 加载测试数据
  loadMockData() {
    console.log('📝 使用测试数据预览');

    setTimeout(() => {
      this.setData({
        resumeData: MOCK_RESUME,
        loading: false
      });

      wx.showToast({
        title: '测试数据预览',
        icon: 'none',
        duration: 2000
      });
    }, 500);
  },

  // 加载真实简历数据
  loadResumeData(id) {
    wx.showLoading({ title: '加载中...' });

    db.getResumeById(id)
      .then(resume => {
        wx.hideLoading();

        if (!resume) {
          // 询问是否使用测试数据
          wx.showModal({
            title: '简历不存在',
            content: '该简历可能已被删除或数据库未配置。\n\n是否查看测试数据预览？',
            cancelText: '返回',
            confirmText: '查看测试',
            success: (res) => {
              if (res.confirm) {
                this.setData({ useMockData: true });
                this.loadMockData();
              } else {
                wx.navigateBack();
              }
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
          content: '无法加载简历数据。\n\n是否查看测试数据预览？',
          cancelText: '返回',
          confirmText: '查看测试',
          success: (res) => {
            if (res.confirm) {
              this.setData({ useMockData: true });
              this.loadMockData();
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
    if (this.data.useMockData) {
      wx.showToast({
        title: '这是测试数据，无法编辑',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: '/pages/editor/editor?id=' + this.data.resumeId
    });
  },

  // 导出
  handleExport() {
    if (this.data.useMockData) {
      wx.showToast({
        title: '测试数据无法导出',
        icon: 'none',
        duration: 2000
      });
      return;
    }

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

    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '导出图片',
        content: '图片已保存到相册，可以分享给好友或发送到其他平台。',
        showCancel: false,
        confirmText: '知道了'
      });

      this.updateExportCount();
    }, 1500);
  },

  // 导出为 PDF
  exportAsPDF() {
    wx.showLoading({ title: '生成 PDF 中...' });

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

      this.updateExportCount();
    }, 2000);
  },

  // 发送 PDF 到邮箱
  sendPDFByEmail() {
    const email = this.data.resumeData.email || 'user@example.com';

    wx.showLoading({ title: '发送中...' });

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
    if (this.data.useMockData) return;

    const userInfo = storage.getUserInfo();
    userInfo.exportCount = (userInfo.exportCount || 0) + 1;
    storage.setUserInfo(userInfo);
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: `${this.data.resumeData.name}的简历 - ${this.data.resumeData.position}`,
      path: '/pages/preview/preview?id=' + this.data.resumeId
    };
  },

  onShareTimeline() {
    return {
      title: `${this.data.resumeData.name}的简历 - ${this.data.resumeData.position}`,
      query: 'id=' + this.data.resumeId
    };
  }
});
