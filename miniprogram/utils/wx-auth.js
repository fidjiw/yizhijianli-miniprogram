// utils/wx-auth.js
/**
 * 微信真实登录工具 + 微信云开发集成
 * 实现完整的微信登录、授权、token 管理流程
 */

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
   * 第二步：用 code 换取 session_key 和 token（调用云函数）
   */
  _exchangeToken(code) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: { code },
        success: (result) => {
          if (result.result.code === 0) {
            resolve(result.result.data);
          } else {
            reject(result.result.msg || '云函数调用失败');
          }
        },
        fail: (error) => {
          reject('云函数调用失败：' + error.errMsg);
        }
      });
    });
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
   * 第一步：获取 code 并交换 token（自动）
   * 第二步：获取用户信息（需要用户手动授权）
   */
  login() {
    return new Promise(async (resolve, reject) => {
      try {
        // 步骤1：获取 code
        const code = await this._getCode();
        console.log('✓ 获取 code 成功');

        // 步骤2：用 code 换取 token（调用云函数）
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

        // 步骤3：登录成功，返回
        resolve({
          token,
          userId
        });

        // 步骤4：询问用户是否授权头像和昵称（可选，不阻塞登录）
        // 用户可以在授权后调用 authorizeUserProfile() 手动授权
      } catch (error) {
        console.error('登录失败:', error);
        reject(error);
      }
    });
  },

  /**
   * 单独的用户授权方法
   * 由用户主动点击调用（比如在登录后的设置页面）
   */
  authorizeUserProfile() {
    return new Promise(async (resolve, reject) => {
      try {
        // 步骤1：获取用户信息（需要用户点击授权）
        const userInfo = await this._getUserProfile();
        console.log('✓ 获取用户信息成功');

        const userId = wx.getStorageSync('userId');

        // 步骤2：保存用户信息到云数据库
        await new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'getUserInfo',
            data: {
              nickName: userInfo.nickName,
              avatarUrl: userInfo.avatarUrl
            },
            success: (result) => {
              if (result.result.code === 0) {
                console.log('✓ 用户信息已保存');
                resolve();
              } else {
                reject(result.result.msg || '保存失败');
              }
            },
            fail: (error) => {
              reject('保存用户信息失败：' + error.errMsg);
            }
          });
        });

        // 保存到本地存储
        storage.setUserInfo({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          userId: userId
        });

        resolve({
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          userId: userId
        });
      } catch (error) {
        console.error('授权失败:', error);
        reject(error);
      }
    });
  },

  /**
   * 登出
   */
  logout() {
    return new Promise((resolve, reject) => {
      try {
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
   */
  validateToken() {
    const token = wx.getStorageSync('token');
    return !!token;
  }
};

module.exports = wxAuth;
