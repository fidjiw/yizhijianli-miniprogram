// utils/wx-auth.js
/**
 * 微信真实登录工具
 * 实现完整的微信登录、授权、token 管理流程
 */

const http = require('./http');
const storage = require('./storage');

const wxAuth = {
  /**
   * 第一步：调用微信登录获取 code
   */
  _getCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code);
          } else {
            reject('wx.login 返回 code 失败：' + res.errMsg);
          }
        },
        fail: (err) => {
          reject('wx.login 调用失败：' + err.errMsg);
        }
      });
    });
  },

  /**
   * 第二步：用 code 换取 session_key 和 token
   */
  _exchangeToken(code) {
    return http.post('/api/auth/login', { code });
  },

  /**
   * 第三步：获取用户授权信息
   */
  _getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          resolve(res.userInfo);
        },
        fail: (err) => {
          reject('获取用户信息失败：' + err.errMsg);
        }
      });
    });
  },

  /**
   * 完整登录流程
   */
  login() {
    return new Promise(async (resolve, reject) => {
      try {
        // 步骤1：获取 code
        const code = await this._getCode();
        console.log('✓ 获取 code 成功');

        // 步骤2：用 code 换取 token
        const tokenResult = await this._exchangeToken(code);
        const token = tokenResult.token;
        const userId = tokenResult.userId;

        // 保存 token
        wx.setStorageSync('token', token);
        wx.setStorageSync('userId', userId);
        storage.setLoginInfo({
          token,
          userId,
          loginTime: Date.now()
        });

        console.log('✓ Token 交换成功');

        // 步骤3：获取用户信息（需要用户授权）
        const userInfo = await this._getUserProfile();
        console.log('✓ 获取用户信息成功');

        // 步骤4：保存用户信息到后端
        await http.post('/api/user/info', userInfo);
        console.log('✓ 用户信息已保存');

        // 保存到本地存储
        storage.setUserInfo({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          userId: userId
        });

        resolve({
          token,
          userId,
          userInfo
        });
      } catch (error) {
        console.error('登录失败:', error);
        reject(error);
      }
    });
  },

  /**
   * 登出
   */
  logout() {
    return new Promise(async (resolve, reject) => {
      try {
        // 调用后端登出接口
        await http.post('/api/auth/logout', {});

        // 清除本地存储
        wx.removeStorageSync('token');
        wx.removeStorageSync('userId');
        storage.removeItem('loginInfo');
        storage.removeItem('userInfo');

        console.log('✓ 登出成功');
        resolve();
      } catch (error) {
        console.error('登出失败:', error);
        reject(error);
      }
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
   * 获取 token
   */
  getToken() {
    return wx.getStorageSync('token');
  },

  /**
   * 获取用户 ID
   */
  getUserId() {
    return wx.getStorageSync('userId');
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return storage.getUserInfo();
  },

  /**
   * 刷新 token（当 token 过期时）
   */
  refreshToken() {
    return new Promise(async (resolve, reject) => {
      try {
        const code = await this._getCode();
        const result = await this._exchangeToken(code);
        const token = result.token;

        wx.setStorageSync('token', token);
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * 检查 token 是否有效
   * 可选：向后端验证 token
   */
  validateToken() {
    return http.get('/api/auth/validate');
  }
};

module.exports = wxAuth;
