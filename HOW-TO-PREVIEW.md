# 查看预览效果的方法

## 🎯 为什么预览不了？

因为数据库中还没有简历数据！预览功能需要先创建简历。

---

## 📋 解决方案

### 方案 1：配置云数据库后创建简历（推荐）

这是正式使用小程序的方式：

**步骤：**
1. 按照 `CLOUD-SETUP-GUIDE.md` 配置云数据库（5分钟）
2. 在小程序首页点击"+ 新建简历"
3. 填写简历信息
4. 点击"保存" → "下一步" 完成所有模块
5. 在"我的简历"列表中点击简历
6. 点击"预览"按钮 ✅

---

### 方案 2：查看测试预览（快速体验）

如果只是想快速看看预览页面的效果，不想配置数据库：

#### 步骤 1：修改预览页面代码

在 `miniprogram/pages/preview/preview.js` 文件的开头添加测试数据：

```javascript
// pages/preview/preview.js
const db = require('../../utils/db');
const storage = require('../../utils/storage');

// ⭐ 添加这段测试数据
const TEST_RESUME = {
  _id: 'test',
  name: '张小明',
  position: '产品经理',
  phone: '138-0000-0000',
  email: 'test@example.com',
  location: '北京',
  summary: '5年互联网产品经验，擅长从0到1打造产品。',
  education: [{
    school: '浙江大学',
    major: '计算机科学',
    degree: '本科',
    startDate: '2015.09',
    endDate: '2019.06'
  }],
  experience: [{
    company: '阿里巴巴',
    position: '产品经理',
    startDate: '2019.07',
    endDate: '至今',
    description: '负责钉钉产品设计，主导多个重要项目。'
  }],
  skills: [
    { name: '产品设计' },
    { name: '需求分析' },
    { name: 'Axure' }
  ]
};

Page({
  data: {
    resumeId: null,
    resumeData: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    
    // ⭐ 如果ID是'test'，使用测试数据
    if (id === 'test') {
      this.setData({
        resumeId: 'test',
        resumeData: TEST_RESUME,
        loading: false
      });
      return;
    }
    
    // 原有代码...
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
  
  // ... 其他代码保持不变
});
```

#### 步骤 2：访问测试预览

在小程序模拟器的地址栏输入：
```
pages/preview/preview?id=test
```

或者在任何页面的代码中跳转：
```javascript
wx.navigateTo({
  url: '/pages/preview/preview?id=test'
});
```

---

### 方案 3：使用模拟器调试（最简单）

**步骤：**
1. 在微信开发者工具中打开项目
2. 点击顶部的"编译"按钮旁边的下拉箭头
3. 点击"添加编译模式"
4. 填写：
   - 模式名称：`测试预览`
   - 启动页面：`pages/preview/preview`
   - 启动参数：`id=test`
5. 点击"确定"
6. 点击"编译" - 选择"测试预览"模式

**注意：** 需要先按照"方案2"添加测试数据代码

---

## 💡 推荐流程

### 如果你想正式使用小程序：
1. ✅ 配置云数据库（必需）
2. ✅ 创建真实简历
3. ✅ 预览和导出

### 如果只是想看界面效果：
1. ✅ 添加测试数据代码
2. ✅ 使用编译模式查看
3. ⏳ 以后再配置云数据库

---

## 🎉 总结

**预览功能本身没有问题！** ✅

只是需要：
- **有简历数据** - 通过创建简历或使用测试数据
- **云数据库配置好** - 正式使用需要

现在你可以选择：
- 🚀 配置云数据库，完整体验所有功能
- 👀 添加测试数据，快速查看预览效果

---

## 📞 需要帮助？

如果遇到任何问题，可以查看：
- `CLOUD-SETUP-GUIDE.md` - 云数据库配置指南
- `PROJECT-SUMMARY.md` - 项目功能总结
- `DEPLOY.md` - 部署指南
