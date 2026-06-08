# 微信小程序真实登录实现指南

## 当前状态

❌ **现在的登录是模拟的**
- 使用的是测试 AppID
- 后端接口是 mock 数据
- 无法真实授权和获取用户信息

---

## ✅ 真实登录需要的条件

### 1. 微信小程序 AppID 和 AppSecret
**获取方式：**
- 注册微信公众平台账号 (mp.weixin.qq.com)
- 创建小程序项目
- 在"基本信息"中获取 AppID 和 AppSecret

**AppID 格式示例：** `wx6869eba1c3aed01b`

### 2. 后端服务器
**必须实现的接口：**
- `/api/auth/login` - 用 code 换取 session_key 和 token
- `/api/auth/logout` - 退出登录
- `/api/user/info` - 获取用户信息

### 3. 微信开放平台配置
- 在小程序后台配置服务器域名白名单
- 配置合法域名、业务域名、请求域名、上传/下载域名

---

## 🔧 完整实现方案

### 步骤1：更新 project.config.json

```json
{
  "appid": "wx6869eba1c3aed01b",  // 替换为你的真实 AppID
  "projectname": "一纸简历"
  // 其他配置...
}
```

### 步骤2：更新 HTTP 基础 URL

编辑 `utils/http.js`：
```javascript
const http = {
  baseURL: 'https://your-domain.com',  // 替换为你的后端域名
  timeout: 30000
  // ...
}
```

### 步骤3：实现微信登录逻辑

创建 `utils/wx-auth.js`：
```javascript
// utils/wx-auth.js
const http = require('./http');

const wxAuth = {
  /**
   * 微信登录
   */
  login() {
    return new Promise((resolve, reject) => {
      // 第一步：调用 wx.login() 获取 code
      wx.login({
        success: (res) => {
          const code = res.code;

          if (!code) {
            reject('登录失败，未获取 code');
            return;
          }

          // 第二步：用 code 换取 session_key 和 token
          http.post('/api/auth/login', { code })
            .then((result) => {
              // 保存 token
              const token = result.token;
              wx.setStorageSync('token', token);

              // 保存用户会话信息
              wx.setStorageSync('sessionKey', result.sessionKey);
              wx.setStorageSync('userId', result.userId);

              resolve(result);
            })
            .catch(reject);
        },
        fail: (err) => {
          reject('调用 wx.login() 失败：' + err.errMsg);
        }
      });
    });
  },

  /**
   * 获取用户信息（需要用户授权）
   */
  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          const userInfo = res.userInfo;

          // 将用户信息发送到后端保存
          http.post('/api/user/info', userInfo)
            .then(() => {
              resolve(userInfo);
            })
            .catch(reject);
        },
        fail: (err) => {
          reject('获取用户信息失败：' + err.errMsg);
        }
      });
    });
  },

  /**
   * 退出登录
   */
  logout() {
    return new Promise((resolve, reject) => {
      http.post('/api/auth/logout', {})
        .then(() => {
          // 清除本地存储的 token 和用户信息
          wx.removeStorageSync('token');
          wx.removeStorageSync('sessionKey');
          wx.removeStorageSync('userId');
          
          // 重定向到登录页
          wx.navigateTo({ url: '/pages/welcome/welcome' });
          
          resolve();
        })
        .catch(reject);
    });
  },

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    const token = wx.getStorageSync('token');
    return !!token;
  },

  /**
   * 获取保存的 token
   */
  getToken() {
    return wx.getStorageSync('token');
  },

  /**
   * 获取用户 ID
   */
  getUserId() {
    return wx.getStorageSync('userId');
  }
};

module.exports = wxAuth;
```

### 步骤4：更新登录页面

编辑 `pages/welcome/welcome.js`：
```javascript
const wxAuth = require('../../utils/wx-auth');
const helpers = require('../../utils/helpers');

Page({
  data: {
    statusBarHeight: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({ statusBarHeight: systemInfo.statusBarHeight });

    // 检查是否已登录
    if (wxAuth.isLoggedIn()) {
      setTimeout(() => {
        wx.switchTab({ url: '/pages/home/home' });
      }, 500);
    }
  },

  // 处理登录
  handleLogin() {
    helpers.showLoading('登录中...');

    // 第一步：调用微信登录
    wxAuth.login()
      .then(() => {
        // 第二步：获取用户信息授权
        return wxAuth.getUserProfile();
      })
      .then((userInfo) => {
        helpers.hideLoading();
        helpers.showSuccess('登录成功');

        // 保存用户信息到本地
        const storage = require('../../utils/storage');
        storage.setUserInfo({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        });

        // 延迟跳转
        setTimeout(() => {
          wx.switchTab({ url: '/pages/home/home' });
        }, 1500);
      })
      .catch((error) => {
        helpers.hideLoading();
        console.error('登录错误:', error);
        helpers.showError('登录失败：' + error);
      });
  },

  showAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    });
  },

  showPrivacy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容...',
      showCancel: false
    });
  }
});
```

### 步骤5：后端实现（Node.js 示例）

```javascript
// server/routes/auth.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const router = express.Router();
const WX_API = 'https://api.weixin.qq.com/sns/jscode2session';
const APP_ID = 'your-app-id';
const APP_SECRET = 'your-app-secret';
const JWT_SECRET = 'your-jwt-secret';

/**
 * 登录接口
 * POST /api/auth/login
 * Body: { code: string }
 */
router.post('/login', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.json({ code: -1, message: 'code 不能为空' });
    }

    // 调用微信接口换取 session_key 和 openid
    const response = await axios.get(WX_API, {
      params: {
        appid: APP_ID,
        secret: APP_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key, errcode, errmsg } = response.data;

    if (errcode) {
      return res.json({ 
        code: -1, 
        message: '微信服务异常：' + errmsg 
      });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { openid, sessionKey: session_key },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 保存用户到数据库（如果是新用户）
    // await saveUserIfNotExists(openid);

    res.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        sessionKey: session_key,
        userId: openid
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.json({ 
      code: -1, 
      message: '登录失败，请重试' 
    });
  }
});

/**
 * 获取用户信息接口
 * POST /api/user/info
 */
router.post('/info', async (req, res) => {
  try {
    const { nickName, avatarUrl } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ code: -1, message: '未授权' });
    }

    // 验证 token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.openid;

    // 更新用户信息到数据库
    // await updateUserInfo(userId, { nickname: nickName, avatar: avatarUrl });

    res.json({
      code: 0,
      message: '用户信息已保存',
      data: { userId }
    });
  } catch (error) {
    console.error('保存用户信息错误:', error);
    res.status(401).json({ 
      code: -1, 
      message: '未授权' 
    });
  }
});

/**
 * 退出登录接口
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  // 客户端会清除本地 token，后端可以做记录
  res.json({ 
    code: 0, 
    message: '退出成功' 
  });
});

module.exports = router;
```

### 步骤6：微信开放平台配置

在微信小程序后台"设置 - 开发设置"中配置：

```
请求域名:           https://your-domain.com
上传文件域名:       https://your-domain.com
下载文件域名:       https://your-domain.com
业务域名:           your-domain.com
```

---

## 🎯 登录流程图

```
用户点击登录
    ↓
wx.login() 获取 code
    ↓
发送 code 到后端
    ↓
后端调用微信接口 jscode2session
    ↓
微信返回 openid 和 session_key
    ↓
后端生成 JWT token 返回给客户端
    ↓
客户端保存 token
    ↓
wx.getUserProfile() 获取用户授权信息
    ↓
发送用户信息到后端保存
    ↓
登录成功，跳转首页
```

---

## ⚠️ 重要说明

### 微信登录的限制
1. **一个 AppID 只能绑定一个小程序**
2. **开发和生产环境需要不同的 AppID**
3. **测试号有功能限制**（推荐用于开发测试）
4. **真实线上需要企业认证**

### 数据安全
- ❌ 千万不要在客户端暴露 AppSecret
- ✅ AppSecret 只能在后端服务器中使用
- ✅ Token 需要有过期时间
- ✅ 建议使用 HTTPS 加密传输

### 调试技巧
1. 使用微信开发者工具的真机预览测试
2. 在开发工具的"自定义编译"中选择"正常编译"
3. 查看网络请求和错误日志

---

## 📋 实现检查清单

- [ ] 获取正式 AppID 和 AppSecret
- [ ] 部署后端服务器
- [ ] 在 project.config.json 中填入 AppID
- [ ] 在 http.js 中配置后端 URL
- [ ] 创建 wx-auth.js 工具
- [ ] 在微信开放平台配置域名白名单
- [ ] 测试微信登录流程
- [ ] 测试用户授权信息获取
- [ ] 测试 token 保存和验证
- [ ] 测试登录后的页面访问

---

## 🚀 快速开始

**如果你没有后端服务，可以：**

1. **使用云服务** - 使用腾讯云、阿里云的云函数
2. **使用第三方平台** - 如 Firebase、Supabase
3. **先用模拟登录开发** - 后续接真实接口时改动最小

---

**需要帮助实现真实登录吗？** 可以告诉我你的后端技术栈，我来帮你完成后端实现！
