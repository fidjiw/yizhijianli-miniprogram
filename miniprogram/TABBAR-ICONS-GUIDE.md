# TabBar 图标制作指南

## 📋 图标规格要求

### 尺寸标准
- **普通屏幕：** 81px × 81px
- **高清屏幕：** 162px × 162px（推荐）
- **格式：** PNG（支持透明背景）

### 文件命名
```
assets/icons/
├── home.png              # 首页 - 未选中
├── home-active.png       # 首页 - 选中
├── template.png          # 模板 - 未选中
├── template-active.png   # 模板 - 选中
├── ai.png               # AI - 未选中
├── ai-active.png        # AI - 选中
├── profile.png          # 我的 - 未选中
└── profile-active.png   # 我的 - 选中
```

---

## 🎨 设计建议

### 颜色方案
- **未选中颜色：** #8F9BA8（灰色）
- **选中颜色：** #0FB9A6（青色，品牌色）

### 图标风格
- 线性图标（line icon）
- 圆角设计
- 2-3px 线条粗细
- 简洁现代

---

## 🎯 图标设计内容

### 1. 首页（home）
**未选中：** 房屋轮廓线条图标
**选中：** 房屋填充图标
```
简单的房子形状：
- 三角形屋顶
- 方形底部
- 可选：小门或窗户
```

### 2. 模板（template）
**未选中：** 文档/简历轮廓图标
**选中：** 文档填充图标
```
A4 纸张形状：
- 矩形边框
- 内部 3-4 条横线表示文本
- 可选：折角
```

### 3. AI（ai）
**未选中：** 魔法棒/星星/脑袋轮廓图标
**选中：** 填充版本
```
推荐设计：
- 魔法棒 + 星星
- 或：带电路纹路的脑袋
- 或：AI 字母组合
```

### 4. 我的（profile）
**未选中：** 人物头像轮廓图标
**选中：** 人物填充图标
```
简单人形：
- 圆形头部
- 半圆或弧形肩膀
```

---

## 🛠️ 制作方法

### 方法 1：在线图标生成器（推荐）
1. 访问 [Iconfont](https://www.iconfont.cn/)
2. 搜索所需图标
3. 下载 PNG 格式，尺寸 162×162
4. 使用在线工具修改颜色

### 方法 2：设计软件
**Figma / Sketch / Adobe XD：**
1. 创建 162×162 画布
2. 使用矢量工具绘制图标
3. 导出 PNG（2x）
4. 分别导出未选中和选中状态

### 方法 3：使用 Emoji（临时方案）
虽然不推荐用于正式发布，但可以先用 emoji 测试：
```
首页：🏠
模板：📄
AI：✨
我的：👤
```

---

## 📦 使用图标库推荐

### Iconify
- 网址：https://icon-sets.iconify.design/
- 免费、开源
- 支持导出 PNG

### Feather Icons
- 网址：https://feathericons.com/
- 极简线性风格
- 符合现代设计

### Remix Icon
- 网址：https://remixicon.com/
- 中国团队制作
- 线性+填充双版本

---

## 🚀 快速实施步骤

### 第一步：下载图标
去 Iconfont 或其他图标网站搜索下载：
- home / house
- document / file / resume
- magic / sparkle / brain
- user / profile / person

### 第二步：调整颜色和大小
使用在线工具（如 Photopea）：
1. 打开图标
2. 调整画布大小为 162×162
3. 未选中：改为 #8F9BA8
4. 选中：改为 #0FB9A6
5. 导出 PNG

### 第三步：放入项目
```bash
cp home.png miniprogram/assets/icons/
cp home-active.png miniprogram/assets/icons/
# ... 其他图标
```

### 第四步：重新编译
微信开发者工具会自动识别新图标

---

## ⚠️ 注意事项

1. **图标必须存在**
   - 如果图标路径错误，tabBar 会显示空白
   - 建议先用纯文字 tabBar，图标准备好后再添加

2. **图标大小限制**
   - 单个图标不超过 40KB
   - 建议使用 PNG-8 格式压缩

3. **iOS 和 Android 显示差异**
   - iOS 图标略小
   - Android 图标略大
   - 建议真机测试

4. **高清屏适配**
   - 使用 162×162 可以自动适配各种屏幕
   - 微信会自动缩放

---

## 🎨 当前配置（纯文字版）

如果暂时没有图标，可以先用纯文字版本：

```json
"tabBar": {
  "color": "#8F9BA8",
  "selectedColor": "#0FB9A6",
  "backgroundColor": "#ffffff",
  "borderStyle": "white",
  "fontSize": "11px",
  "list": [
    {
      "pagePath": "pages/home/home",
      "text": "首页"
    },
    {
      "pagePath": "pages/templates/templates",
      "text": "模板"
    },
    {
      "pagePath": "pages/ai-optimize/ai-optimize",
      "text": "AI"
    },
    {
      "pagePath": "pages/profile/profile",
      "text": "我的"
    }
  ]
}
```

纯文字版也很简洁，等图标准备好后再添加。

---

## 📚 参考资源

- [微信小程序 tabBar 官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabBar)
- [Iconfont 图标库](https://www.iconfont.cn/)
- [Iconify 图标搜索](https://icon-sets.iconify.design/)
- [在线图片编辑 Photopea](https://www.photopea.com/)
