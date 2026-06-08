# 云开发环境配置指南

## 📋 概述

"一纸简历"小程序使用了**微信云开发**来存储用户数据，需要在微信开发者工具中配置云开发环境。

---

## 🚀 配置步骤

### 第一步：开通云开发

1. **打开微信开发者工具**
   - 打开项目：`一纸简历-20260606`

2. **点击云开发按钮**
   - 工具栏上找到"云开发"图标
   - 或者点击：工具 → 云开发

3. **开通云开发**
   - 首次使用需要开通
   - 选择"开通云开发"
   - 同意服务协议

4. **创建环境**
   - 环境名称：`yizhijianli-prod`（或自定义）
   - 选择基础套餐（免费版）
   - 等待环境创建完成（约1-2分钟）

---

### 第二步：配置云数据库

#### 1. 创建集合（数据表）

进入云开发控制台 → 数据库，创建以下集合：

##### 集合 1：`resumes`（简历数据）
```javascript
// 权限设置：仅创建者可读写
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

**字段说明：**
- `_id`: 自动生成（唯一ID）
- `_openid`: 自动生成（用户标识）
- `name`: String - 姓名
- `position`: String - 职位
- `phone`: String - 手机号
- `email`: String - 邮箱
- `summary`: String - 个人简介
- `education`: Array - 教育经历
- `experience`: Array - 工作经历
- `skills`: Array - 技能特长
- `templateId`: Number - 使用的模板ID
- `createdAt`: Date - 创建时间
- `updatedAt`: Date - 更新时间

##### 集合 2：`favorites`（收藏模板）
```javascript
// 权限设置：仅创建者可读写
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```

**字段说明：**
- `_id`: 自动生成
- `_openid`: 自动生成
- `templateId`: Number - 模板ID
- `createdAt`: Date - 收藏时间

#### 2. 配置权限

在每个集合的"权限设置"中：

**方案A：自定义安全规则（推荐）**
```javascript
{
  "read": "doc._openid == auth.openid",
  "write": "doc._openid == auth.openid"
}
```
含义：只允许用户访问自己创建的数据

**方案B：简化权限（开发阶段）**
- 仅在开发阶段使用
- 选择"所有用户可读，仅创建者可写"
- 上线前必须改为方案A

---

### 第三步：配置云函数（可选）

如果需要使用云函数（如生成PDF、发送邮件等），需要创建云函数：

#### 1. 创建云函数目录

在项目根目录创建：
```
cloudfunctions/
├── generatePDF/        # 生成PDF云函数
│   ├── index.js
│   └── package.json
├── sendEmail/          # 发送邮件云函数
│   ├── index.js
│   └── package.json
```

#### 2. 示例云函数（generatePDF）

**cloudfunctions/generatePDF/index.js:**
```javascript
const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const { resumeId } = event;
  
  // TODO: 生成PDF的逻辑
  // 1. 从数据库获取简历数据
  // 2. 使用 PDF 库生成文档
  // 3. 上传到云存储
  // 4. 返回下载链接
  
  return {
    success: true,
    fileUrl: 'https://...'
  };
};
```

#### 3. 上传云函数

在微信开发者工具中：
- 右键云函数目录
- 选择"上传并部署：云端安装依赖"

---

### 第四步：配置云存储（可选）

用于存储用户上传的文件（如头像、简历PDF等）

#### 1. 进入云存储

云开发控制台 → 存储

#### 2. 创建文件夹

```
avatars/        # 用户头像
resumes/        # 简历PDF
templates/      # 模板预览图
```

#### 3. 配置权限

- 所有用户可读
- 仅创建者可写

---

### 第五步：更新环境ID

#### 1. 获取环境ID

在云开发控制台 → 设置 → 环境ID：
```
例如：yizhijianli-xxx
```

#### 2. 更新项目配置

**miniprogram/app.js:**
```javascript
App({
  onLaunch() {
    // 初始化云开发
    wx.cloud.init({
      env: 'yizhijianli-xxx',  // 替换为你的环境ID
      traceUser: true
    });
  }
});
```

---

## 📊 免费额度说明

### 云数据库
- **存储空间：** 2GB
- **读操作：** 50,000次/天
- **写操作：** 30,000次/天
- **集合数量：** 50个

### 云存储
- **存储空间：** 5GB
- **下载流量：** 10GB/月
- **上传流量：** 10GB/月
- **CDN流量：** 5GB/月

### 云函数
- **资源使用量：** 40,000GBs/月
- **调用次数：** 100万次/月
- **外网出流量：** 1GB/月

**个人小程序完全够用！** ✅

---

## 🔧 本地开发配置

### 1. 安装依赖（如果使用云函数）

```bash
cd cloudfunctions/generatePDF
npm install wx-server-sdk
```

### 2. 模拟器设置

在微信开发者工具中：
- 工具 → 构建npm
- 详情 → 本地设置 → 使用npm模块

### 3. 真机调试

- 点击"真机调试"
- 扫码在手机上测试
- 查看云开发数据是否正常

---

## ✅ 配置检查清单

完成以下步骤后，云开发环境就配置好了：

- [ ] 开通云开发
- [ ] 创建环境（如：yizhijianli-prod）
- [ ] 创建 `resumes` 集合
- [ ] 创建 `favorites` 集合
- [ ] 配置集合权限
- [ ] 更新 app.js 中的环境ID
- [ ] 测试数据读写

**可选（按需配置）：**
- [ ] 创建云函数
- [ ] 配置云存储
- [ ] 上传模板图片到云存储

---

## 🧪 测试验证

### 测试云数据库

在云开发控制台 → 数据库 → resumes：
1. 手动添加一条测试数据
2. 在小程序中查看是否能读取
3. 在小程序中创建简历，查看是否保存成功

### 测试登录

1. 在小程序中点击登录
2. 查看是否获取到 openid
3. 创建数据后查看 _openid 字段

---

## 🚨 常见问题

### Q1: 提示"未开通云开发"
**A:** 在微信开发者工具中点击"云开发"按钮开通

### Q2: 数据库操作失败
**A:** 检查：
1. 环境ID是否正确
2. 集合是否已创建
3. 权限设置是否正确
4. 是否已登录（获取openid）

### Q3: 云函数调用失败
**A:** 检查：
1. 云函数是否已上传
2. 云函数名称是否正确
3. 是否已安装依赖

### Q4: 免费额度用完了
**A:** 
- 查看云开发控制台 → 统计分析
- 升级到付费套餐
- 或者优化数据访问频率

---

## 💡 最佳实践

### 1. 开发/生产环境分离
- 开发环境：`yizhijianli-dev`
- 生产环境：`yizhijianli-prod`

### 2. 数据备份
- 定期导出数据库
- 云开发控制台 → 数据库 → 导出

### 3. 监控
- 查看云开发控制台的统计数据
- 关注资源使用情况

### 4. 安全
- 使用自定义安全规则
- 不要在客户端暴露敏感信息
- 重要操作使用云函数

---

## 📚 参考文档

- **微信云开发文档：** https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- **云数据库指南：** https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html
- **云函数指南：** https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/functions.html
- **云存储指南：** https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage.html

---

## 🎉 配置完成！

按照以上步骤配置完成后，小程序就可以：
- ✅ 存储用户简历数据
- ✅ 记录收藏的模板
- ✅ 用户数据隔离和安全
- ✅ 随时随地访问数据

现在可以开始测试和使用小程序了！🚀
