# GitHub 上传指南 - 一纸简历小程序

## 第一步：在 GitHub 创建仓库

### 1. 访问 GitHub
- 打开 https://github.com
- 登录你的账号（没有的话先注册）

### 2. 创建新仓库
- 点击右上角头像 → "Your repositories"
- 点击绿色 "New" 按钮
- 填写仓库信息：

```
Repository name: yizhijianli-miniprogram
Description: 一纸简历小程序 - 智能简历制作工具
Visibility: Public (或 Private)
Initialize: 不勾选（我们用本地初始化）
```

- 点击 "Create repository"

### 3. 复制仓库 URL
创建后会看到提示，复制 HTTPS URL：
```
https://github.com/你的用户名/yizhijianli-miniprogram.git
```

---

## 第二步：本地初始化 Git

打开终端，进入项目目录：

```bash
cd /Users/xfeng/微信小程序/一纸简历-20260606
```

### 1. 初始化 Git 仓库

```bash
git init
```

### 2. 添加所有文件

```bash
git add .
```

### 3. 创建第一次提交

```bash
git commit -m "初始提交：完整的一纸简历小程序项目

- 8 个核心页面（登录、首页、模板库、编辑器、AI优化、预览、简历管理、个人中心）
- 3 个公共组件库（Button、Input、Card）
- 8 个工具函数库（存储、验证、HTTP、状态管理、登录等）
- 完整的微信登录实现
- 详细的项目文档和实现指南"
```

### 4. 连接到 GitHub 仓库

```bash
git remote add origin https://github.com/你的用户名/yizhijianli-miniprogram.git
```

### 5. 推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

---

## 完整的终端命令（一键式）

```bash
# 进入项目目录
cd /Users/xfeng/微信小程序/一纸简历-20260606

# 初始化 git
git init

# 添加所有文件
git add .

# 第一次提交
git commit -m "初始提交：一纸简历小程序 v1.0.0

完整项目包括：
- UI 设计稿：精致的清新年轻风格
- 8 个核心页面：完整的业务流程
- 3 个公共组件：Button、Input、Card
- 8 个工具库：存储、验证、HTTP 等
- 微信登录：完整的登录逻辑
- 详细文档：5 份详细的实现指南"

# 连接到 GitHub
git remote add origin https://github.com/你的用户名/yizhijianli-miniprogram.git

# 重命名主分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

## 推送后的工作

### 1. 验证上传成功
- 打开 https://github.com/你的用户名/yizhijianli-miniprogram
- 应该能看到所有文件

### 2. 添加 .gitignore（可选但建议）

创建文件 `一纸简历-20260606/.gitignore`：

```
# 微信开发者工具
*.temp/
*.tmp

# Node modules
node_modules/
package-lock.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log
npm-debug.log*
yarn-debug.log*
```

然后推送：
```bash
git add .gitignore
git commit -m "添加 .gitignore 文件"
git push
```

### 3. 添加 README（可选）

在 GitHub 仓库根目录创建 `README.md`：

```markdown
# 一纸简历小程序

智能简历制作工具 - 微信小程序版本

## 功能特性

- 📱 8 个核心页面
- 🎨 精致的 UI 设计
- 🛠️ 8 个工具函数库
- ✅ 完整的微信登录
- 💾 智能本地存储
- ✔️ 表单验证系统

## 项目结构

```
miniprogram/
├── components/      # 公共组件
├── pages/          # 核心页面
├── utils/          # 工具函数
└── docs/           # 文档
```

## 快速开始

1. 克隆项目
2. 用微信开发者工具打开 miniprogram 目录
3. 配置 AppID 和后端 URL
4. 编译运行

## 文档

- [README](./miniprogram/README.md) - 项目说明
- [功能详情](./miniprogram/FEATURES.md) - 功能文档
- [微信登录](./miniprogram/WX-AUTH-GUIDE.md) - 登录指南
- [部署指南](./miniprogram/DEPLOY.md) - 上线指南
- [快速参考](./miniprogram/QUICK-REF.md) - 代码参考

## 许可证

MIT

---

**创建时间：** 2026-06-08  
**版本：** 1.0.0  
**状态：** ✅ 可用
```

### 4. 后续更新（日常开发）

每次修改后，使用这些命令提交：

```bash
# 查看修改
git status

# 添加修改
git add .

# 提交
git commit -m "描述你的改动"

# 推送
git push
```

---

## 常见问题

### Q: 推送时出现认证错误？

**解决方案1：** 使用 GitHub 个人访问令牌

```bash
# 生成令牌
# 1. GitHub 右上角头像 → Settings
# 2. Developer settings → Personal access tokens
# 3. Generate new token，选择 repo 权限
# 4. 复制令牌

# 推送时用令牌代替密码
git push -u origin main
# 用户名：你的 GitHub 用户名
# 密码：粘贴令牌
```

**解决方案2：** 配置 SSH（推荐）

```bash
# 生成 SSH 密钥（如果还没有）
ssh-keygen -t ed25519 -C "你的邮箱"

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# 在 GitHub 中添加 SSH 密钥
# Settings → SSH and GPG keys → New SSH key → 粘贴公钥

# 使用 SSH 地址推送
git remote set-url origin git@github.com:你的用户名/yizhijianli-miniprogram.git
git push -u origin main
```

### Q: 想修改仓库信息？

```bash
# 修改仓库描述
git remote set-url origin https://github.com/新用户名/新仓库名.git
```

### Q: 如何删除已提交的内容？

```bash
# 查看提交历史
git log

# 回到上一个提交
git reset --soft HEAD~1

# 或者重新提交
git commit --amend -m "新的提交信息"
git push --force-with-lease
```

---

## 验证检查清单

- [ ] 在 GitHub 创建了仓库
- [ ] 复制了正确的仓库 URL
- [ ] 在本地执行了 `git init`
- [ ] 执行了 `git add .`
- [ ] 执行了 `git commit`
- [ ] 执行了 `git remote add origin`
- [ ] 执行了 `git push -u origin main`
- [ ] 访问 GitHub 可以看到所有文件

---

## 下一步

推送成功后，你可以：

1. **分享项目** - 复制仓库 URL 分享给其他人
2. **添加协作者** - 在 Settings 中邀请其他开发者
3. **启用 Issues** - 用于问题跟踪
4. **启用 Discussions** - 用于讨论和反馈
5. **创建 Release** - 发布版本

---

**需要帮助？** 告诉我你的 GitHub 用户名，我可以一步步指导你！
