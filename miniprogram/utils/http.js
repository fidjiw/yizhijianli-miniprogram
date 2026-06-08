// utils/http.js
/**
 * HTTP 请求工具
 * 处理 API 调用、错误处理、请求超时等
 */

const http = {
  // API 基础 URL（需要根据实际后端配置）
  baseURL: 'https://api.yizhijianli.com',
  timeout: 30000,

  /**
   * 发起请求
   */
  request(options = {}) {
    const {
      url,
      method = 'GET',
      data = {},
      header = {},
      timeout = this.timeout
    } = options;

    return new Promise((resolve, reject) => {
      // 添加通用请求头
      const finalHeader = {
        'Content-Type': 'application/json',
        ...header
      };

      // 从存储中获取 token
      const token = wx.getStorageSync('token');
      if (token) {
        finalHeader['Authorization'] = `Bearer ${token}`;
      }

      wx.request({
        url: this.baseURL + url,
        method,
        data,
        header: finalHeader,
        timeout,
        success: (res) => {
          const { statusCode, data: responseData } = res;

          // 检查响应状态码
          if (statusCode === 200) {
            // 成功响应
            if (responseData.code === 0 || responseData.status === 'success') {
              resolve(responseData.data || responseData);
            } else {
              // API 业务错误
              reject({
                code: responseData.code,
                message: responseData.message || '请求失败'
              });
            }
          } else if (statusCode === 401) {
            // 未授权，重新登录
            wx.removeStorageSync('token');
            wx.navigateTo({ url: '/pages/welcome/welcome' });
            reject({ code: 401, message: '登录已过期，请重新登录' });
          } else {
            // HTTP 错误
            reject({
              code: statusCode,
              message: `HTTP ${statusCode} 错误`
            });
          }
        },
        fail: (err) => {
          reject({
            code: -1,
            message: err.errMsg || '网络请求失败'
          });
        }
      });
    });
  },

  /**
   * GET 请求
   */
  get(url, options = {}) {
    return this.request({
      ...options,
      url,
      method: 'GET'
    });
  },

  /**
   * POST 请求
   */
  post(url, data = {}, options = {}) {
    return this.request({
      ...options,
      url,
      method: 'POST',
      data
    });
  },

  /**
   * PUT 请求
   */
  put(url, data = {}, options = {}) {
    return this.request({
      ...options,
      url,
      method: 'PUT',
      data
    });
  },

  /**
   * DELETE 请求
   */
  delete(url, options = {}) {
    return this.request({
      ...options,
      url,
      method: 'DELETE'
    });
  }
};

module.exports = http;
