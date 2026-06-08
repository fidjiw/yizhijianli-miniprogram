# 微信小程序获取用户信息变更说明

## ⚠️ 重要变更

微信在 2021年4月13日 后调整了用户信息获取规则：

### 已废弃的API：
- `wx.getUserProfile()` - 已停止维护
- `wx.getUserInfo()` - 仅返回匿名信息

### 新的获取方式：

**方式1：使用头像昵称填写组件（推荐）**

在页面中使用 `<button open-type="chooseAvatar">` 和 `<input type="nickname">` 组件：

```xml
<!-- 获取头像 -->
<button class="avatar-wrapper" open-type="chooseAvatar" bindchooseavatar="onChooseAvatar">
  <image class="avatar" src="{{avatarUrl}}"></image>
</button>

<!-- 获取昵称 -->
<input type="nickname" placeholder="请输入昵称" bindblur="onNicknameChange" />
```

```javascript
Page({
  data: {
    avatarUrl: '',
    nickname: ''
  },
  
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ avatarUrl });
  },
  
  onNicknameChange(e) {
    const { value } = e.detail;
    this.setData({ nickname: value });
  }
})
```

**方式2：使用 wx.login + 后端获取手机号**

需要用户主动授权手机号，后端通过手机号获取用户信息。

**方式3：让用户手动输入**

提供表单让用户自己填写头像和昵称。

## 本项目的解决方案

由于 `wx.getUserProfile` 已废弃，我们需要：

1. 使用头像昵称填写组件让用户手动选择
2. 或者使用手机号授权（需要企业认证）
3. 或者让用户在个人中心手动填写

**当前状态：** 代码中使用的 `wx.getUserProfile` 在真机上无法获取真实信息。

## 参考文档

- 官方公告：https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801
- 头像昵称填写：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
