# 简历预览图资源说明

## 📁 图片存放位置

```
miniprogram/
├── assets/
│   ├── images/
│   │   ├── templates/           # 模板预览图
│   │   │   ├── template-1.png
│   │   │   ├── template-2.png
│   │   │   ├── template-3.png
│   │   │   ├── template-4.png
│   │   │   └── template-5.png
│   │   ├── resumes/             # 简历预览图（自动生成）
│   │   └── placeholder.png      # 默认占位图
```

## 🎨 图片规格要求

### 模板预览图
- **尺寸：** 750px × 1000px（宽高比 3:4）
- **格式：** PNG（支持透明背景）
- **大小：** < 200KB（优化后）
- **内容：** 完整的简历样式展示

### 简历预览图
- **尺寸：** 750px × 1000px（宽高比 3:4）
- **格式：** PNG 或 JPG
- **大小：** < 150KB
- **生成方式：** Canvas 自动生成或默认占位图

## 📋 模板预览图列表

### 1. 经典商务模板（template-1.png）
- 风格：简洁专业
- 颜色：蓝色系
- 适用：互联网、金融、咨询

### 2. 现代简约模板（template-2.png）
- 风格：现代简约
- 颜色：绿色系
- 适用：产品、运营、市场

### 3. 创意设计模板（template-3.png）
- 风格：创意时尚
- 颜色：紫色系
- 适用：设计、创意、艺术

### 4. 清新校招模板（template-4.png）
- 风格：清新活力
- 颜色：橙色系
- 适用：应届生、实习生

### 5. 高端商务模板（template-5.png）
- 风格：高端大气
- 颜色：黑金色系
- 适用：高管、资深职位

## 🖼️ 占位图设计

如果没有真实预览图，使用渐变色占位图：

```css
/* 占位图样式 */
background: linear-gradient(135deg, #E6FBF7, #D6F5F1);
```

中央显示图标：
- 📄 简历图标
- 尺寸：80rpx
- 颜色：#0FB9A6（半透明）

## 🔧 图片优化建议

1. **使用 TinyPNG 压缩**
   - 网址：https://tinypng.com/
   - 可减少 60-80% 文件大小

2. **WebP 格式（可选）**
   - 更好的压缩率
   - 需要检查小程序兼容性

3. **懒加载**
   - 使用 `lazy-load` 属性
   - 提升页面性能

4. **CDN 加速**
   - 将图片上传到云存储
   - 使用 CDN 分发

## 📝 使用示例

### 在模板库中使用
```javascript
// templates.js
data: {
  templates: [
    {
      id: 1,
      name: '经典商务',
      preview: '/assets/images/templates/template-1.png',
      bgColor: '#E6F3FF'
    }
  ]
}
```

### 在 WXML 中使用
```xml
<image 
  class="template-preview" 
  src="{{item.preview}}" 
  mode="aspectFill"
  lazy-load="{{true}}"
/>
```

## 🎯 临时解决方案

在没有真实图片的情况下，可以：

1. **使用渐变背景 + 图标**
   - 不同模板使用不同渐变色
   - 中央显示简历图标

2. **使用在线占位图服务**
   - https://placeholder.com/
   - https://via.placeholder.com/

3. **使用 Canvas 动态生成**
   - 根据简历内容生成预览图
   - 保存到云存储

---

**注意：** 真实的预览图需要设计师提供或使用 Canvas 动态生成。当前代码已支持图片路径配置。
