# 一纸简历小程序 - 快速参考

## 🎯 核心命令

### 在页面中使用工具

```javascript
// 导入工具
const { storage, validate, helpers, pageState, http } = require('../../utils');
const wxAuth = require('../../utils/wx-auth');

// 存储
storage.setUserInfo(info);
storage.getResumeList();
storage.setResumeDraft(id, data);

// 验证
validate.validateForm(data, schema);
validate.isEmail(email);

// 提示
helpers.showLoading();
helpers.showSuccess('成功');
helpers.showError('失败');

// 状态
this.setData(pageState.setLoading(this.data));
this.setData(pageState.setSuccess(this.data, newData));

// 请求
http.get('/api/resumes');
http.post('/api/resumes', data);

// 登录
wxAuth.login();
wxAuth.logout();
wxAuth.isLoggedIn();
```

---

## 📋 常用代码片段

### 1. 页面初始化（带加载状态）

```javascript
const { storage, pageState, http } = require('../../utils');

Page({
  data: {
    list: [],
    ...pageState.init()
  },

  onLoad() {
    this.loadData();
  },

  loadData() {
    this.setData(pageState.setLoading(this.data));

    http.get('/api/data')
      .then(data => {
        this.setData(pageState.setSuccess(this.data, { list: data }));
      })
      .catch(error => {
        this.setData(pageState.setError(this.data, error));
      });
  }
});
```

### 2. 表单验证和提交

```javascript
const { validate, helpers, http } = require('../../utils');

Page({
  data: {
    form: { email: '', phone: '' },
    errors: {}
  },

  handleSubmit() {
    const { isValid, errors } = validate.validateForm(this.data.form, {
      email: [validate.rules.required, validate.rules.email],
      phone: [validate.rules.required, validate.rules.phone]
    });

    if (!isValid) {
      this.setData({ errors });
      return;
    }

    helpers.showLoading('提交中...');

    http.post('/api/submit', this.data.form)
      .then(() => {
        helpers.showSuccess('提交成功');
      })
      .catch(() => {
        helpers.showError('提交失败');
      });
  }
});
```

### 3. 使用公共组件

```xml
<!-- page.json -->
{
  "usingComponents": {
    "button": "/components/button/button",
    "input": "/components/input/input",
    "card": "/components/card/card"
  }
}

<!-- page.wxml -->
<card>
  <input 
    label="邮箱"
    placeholder="请输入邮箱"
    value="{{email}}"
    error="{{errors.email}}"
    bind:change="handleChange" />

  <button 
    type="primary"
    text="提交"
    bind:click="handleSubmit" />
</card>
```

### 4. 本地存储和自动保存

```javascript
const { storage } = require('../../utils');

Page({
  data: {
    resume: { name: '', email: '' }
  },

  onLoad() {
    // 加载草稿
    const draft = storage.getResumeDraft(this.data.resumeId);
    if (draft) {
      this.setData({ resume: draft });
    }
  },

  handleChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;

    const resume = { ...this.data.resume, [field]: value };
    this.setData({ resume });

    // 自动保存
    storage.setResumeDraft(this.data.resumeId, resume);
  },

  onUnload() {
    // 卸载时确保保存
    storage.setResumeDraft(this.data.resumeId, this.data.resume);
  }
});
```

### 5. 登录流程

```javascript
const wxAuth = require('../../utils/wx-auth');
const { helpers, storage } = require('../../utils');

Page({
  handleLogin() {
    helpers.showLoading('登录中...');

    wxAuth.login()
      .then(() => {
        helpers.showSuccess('登录成功');
        const userInfo = storage.getUserInfo();
        // 跳转到首页或更新 UI
      })
      .catch(error => {
        helpers.showError(error);
      });
  }
});
```

---

## 📚 文件映射表

| 功能 | 文件 | 导入方式 |
|------|------|---------|
| 本地存储 | utils/storage.js | `require('../../utils/storage')` |
| 表单验证 | utils/validate.js | `require('../../utils/validate')` |
| HTTP 请求 | utils/http.js | `require('../../utils/http')` |
| 页面状态 | utils/page-state.js | `require('../../utils/page-state')` |
| 工具函数 | utils/helpers.js | `require('../../utils/helpers')` |
| 微信登录 | utils/wx-auth.js | `require('../../utils/wx-auth')` |
| 所有工具 | utils/index.js | `require('../../utils')` |
| 按钮组件 | components/button/ | 在 json 中声明 |
| 输入组件 | components/input/ | 在 json 中声明 |
| 卡片组件 | components/card/ | 在 json 中声明 |

---

## 🔄 常用流程

### 登录流程
1. 用户点击登录
2. 调用 `wxAuth.login()`
3. 前端获取 code
4. 发送 code 到后端
5. 后端返回 token
6. 保存 token 和用户信息
7. 跳转到首页

### 编辑简历流程
1. 从本地加载草稿：`storage.getResumeDraft(id)`
2. 用户编辑表单
3. 实时保存草稿：`storage.setResumeDraft(id, data)`
4. 点击提交时验证：`validate.validateForm(data, schema)`
5. 发送到服务器：`http.put('/api/resumes/' + id, data)`

### 列表加载流程
1. 初始化状态：`pageState.init()`
2. 设置加载状态：`pageState.setLoading()`
3. 发起请求：`http.get('/api/list')`
4. 成功：`pageState.setSuccess(data, { list })`
5. 失败：`pageState.setError(error)`
6. 空结果：`pageState.setEmpty('暂无数据')`

---

## 🎨 验证规则速查

```javascript
validate.rules.required              // 必填
validate.rules.email                // 邮箱
validate.rules.phone                // 手机号
validate.rules.minLength(n)         // 最小长度
validate.rules.maxLength(n)         // 最大长度
validate.rules.range(min, max)      // 数值范围
validate.rules.pattern(regex, msg)  // 自定义正则
```

---

## 🛠 工具函数速查

```javascript
// 时间
helpers.formatTime(timestamp)       // "2小时前"

// UI
helpers.showLoading(title)
helpers.hideLoading()
helpers.showSuccess(title)
helpers.showError(title)
helpers.showInfo(title)
helpers.showConfirm(options)

// 数据
helpers.deepClone(obj)
helpers.generateId()
helpers.isEmptyObject(obj)
helpers.sleep(ms)

// 字符串
helpers.maskPhone(phone)            // "138••••8000"
helpers.maskEmail(email)            // "us****@example.com"
helpers.copyToClipboard(text)

// 性能
helpers.debounce(fn, wait)
helpers.throttle(fn, wait)
```

---

## 📱 页面列表

| 页面 | 路径 | 功能 |
|------|------|------|
| 引导/登录 | /pages/welcome/welcome | 微信登录、品牌介绍 |
| 首页 | /pages/home/home | 快速新建、最近简历 |
| 模板库 | /pages/templates/templates | 分类模板、搜索筛选 |
| 编辑器 | /pages/editor/editor | 表单编辑、AI 辅助 |
| AI 优化 | /pages/ai-optimize/ai-optimize | 评分建议、一键应用 |
| 预览 | /pages/preview/preview | 最终效果、导出入口 |
| 我的简历 | /pages/my-resumes/my-resumes | 列表管理、快速操作 |
| 个人中心 | /pages/profile/profile | 用户信息、会员升级 |

---

## 🚀 快速启动检查

- [ ] 项目在微信开发者工具中打开
- [ ] AppID 配置正确
- [ ] 后端 URL 配置正确
- [ ] 可以看到首页界面
- [ ] 下拉刷新正常工作
- [ ] 点击按钮有反应

---

## 🔗 文档速查

| 需求 | 文档 |
|------|------|
| 整体了解 | README.md |
| 功能详情 | FEATURES.md |
| 微信登录 | WX-AUTH-GUIDE.md |
| 部署上线 | DEPLOY.md |
| 快速参考 | 本文件 |

---

**最后更新：** 2026-06-08  
**版本：** 1.0.0
