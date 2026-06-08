# 一纸简历小程序 - GitHub 上传命令清单

## 准备工作

### 第一步：在 GitHub 创建仓库

1. 打开 https://github.com
2. 点击右上角 "+" → "New repository"
3. 填写：
   - Repository name: `yizhijianli-miniprogram`
   - Description: `一纸简历 - 智能简历制作小程序`
   - Public
4. 点击 "Create repository"
5. **复制仓库 URL**（HTTPS 或 SSH）

---

## 上传命令（复制粘贴执行）

### 方案 A：使用 HTTPS（更简单）

```bash
# 进入项目目录
cd /Users/xfeng/微信小程序/一纸简历-20260606

# 初始化 Git 仓库
git init

# 配置 Git 用户（首次使用）
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"

# 添加所有文件
git add .

# 创建第一个提交
git commit -m "初始提交：一纸简历小程序 v1.0.0

完整的微信小程序项目：
- 8 个核心页面（登录、首页、模板库、编辑器等）
- 3 个公共组件库（Button、Input、Card）
- 8 个工具函数库（存储、验证、HTTP、登录等）
- 完整的微信真实登录实现
- 智能本地存储管理系统
- 灵活的表单验证框架
- 详细的项目文档和实现指南"

# 添加远程仓库（将 URL 替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/yizhijianli-miniprogram.git

# 重命名分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

### 方案 B：使用 SSH（更安全，推荐）

如果你已配置 SSH 密钥，使用这个：

```bash
# 进入项目目录
cd /Users/xfeng/微信小程序/一纸简历-20260606

# 初始化 Git 仓库
git init

# 配置 Git 用户（首次使用）
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"

# 添加所有文件
git add .

# 创建第一个提交
git commit -m "初始提交：一纸简历小程序 v1.0.0"

# 添加远程仓库（使用 SSH）
git remote add origin git@github.com:你的用户名/yizhijianli-miniprogram.git

# 重命名分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

## 如果出现错误

### 错误：fatal: not a git repository

```bash
# 确保在正确目录
cd /Users/xfeng/微信小程序/一纸简历-20260606
git init
```

### 错误：remote origin already exists

```bash
# 移除旧的远程
git remote remove origin

# 重新添加
git remote add origin https://github.com/你的用户名/yizhijianli-miniprogram.git
```

### 错误：Authentication failed

**使用 HTTPS + GitHub Token：**

```bash
# GitHub → Settings → Developer settings → Personal access tokens
# 生成 token 并复制

# 推送时会提示输入密码，粘贴 token 即可
git push -u origin main
```

**或使用 SSH（需要先配置）：**

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "你的GitHub邮箱"

# 一直按 Enter 使用默认设置

# 复制公钥
cat ~/.ssh/id_ed25519.pub

# GitHub → Settings → SSH and GPG keys → New SSH key
# 粘贴公钥

# 然后重新推送
git push -u origin main
```

---

## 推送成功后的验证

### 1. 检查是否上传成功

```bash
# 查看远程状态
git remote -v

# 应该看到：
# origin  https://github.com/你的用户名/yizhijianli-miniprogram.git (fetch)
# origin  https://github.com/你的用户名/yizhijianli-miniprogram.git (push)
```

### 2. 访问 GitHub 验证

打开浏览器访问：
```
https://github.com/你的用户名/yizhijianli-miniprogram
```

应该能看到所有文件都已上传。

---

## 后续开发的常用命令

### 查看状态
```bash
git status
```

### 提交新改动
```bash
git add .
git commit -m "描述你的改动"
git push
```

### 查看提交历史
```bash
git log --oneline
```

### 创建新分支
```bash
git checkout -b feature/新功能名称
git push -u origin feature/新功能名称
```

---

## 最终检查清单

执行前检查：
- [ ] 已在 GitHub 创建仓库
- [ ] 已复制正确的仓库 URL
- [ ] 已配置 Git 用户名和邮箱
- [ ] 在正确的目录：`/Users/xfeng/微信小程序/一纸简历-20260606`

执行后检查：
- [ ] `git push` 命令成功（没有错误）
- [ ] GitHub 网页上可以看到所有文件
- [ ] miniprogram 目录在仓库中

---

## 💡 提示

- 建议用 **HTTPS + GitHub Token** 最简单
- 如果频繁推送，配置 **SSH** 更方便
- 第一次可能需要 2-3 分钟（文件较多）
- 推送成功后可以在 GitHub 网页上看到提交记录

---

**准备好了？复制上面的命令开始上传！** 🚀
