// utils/helpers.js
/**
 * 实用工具函数集合
 */

const helpers = {
  /**
   * 格式化时间
   */
  formatTime(timestamp) {
    if (!timestamp) return '';

    const now = Date.now();
    const diff = now - timestamp;

    // 1分钟内
    if (diff < 60 * 1000) {
      return '刚刚';
    }

    // 1小时内
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}分钟前`;
    }

    // 1天内
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}小时前`;
    }

    // 1周内
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}天前`;
    }

    // 格式化日期
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },

  /**
   * 防抖函数
   */
  debounce(func, wait = 300) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  },

  /**
   * 节流函数
   */
  throttle(func, wait = 300) {
    let lastTime = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastTime >= wait) {
        func.apply(this, args);
        lastTime = now;
      }
    };
  },

  /**
   * 深度克隆
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item));
    }

    if (obj instanceof Object) {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
  },

  /**
   * 根据手机号脱敏
   */
  maskPhone(phone) {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1••••$2');
  },

  /**
   * 根据邮箱脱敏
   */
  maskEmail(email) {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (name.length <= 2) {
      return '*' + name.slice(-1) + '@' + domain;
    }
    return name.slice(0, 2) + '*'.repeat(name.length - 2) + '@' + domain;
  },

  /**
   * 显示加载提示
   */
  showLoading(title = '加载中...', mask = true) {
    wx.showLoading({
      title,
      mask
    });
  },

  /**
   * 隐藏加载提示
   */
  hideLoading() {
    wx.hideLoading();
  },

  /**
   * 显示成功提示
   */
  showSuccess(title = '成功', duration = 1500) {
    wx.showToast({
      title,
      icon: 'success',
      duration
    });
  },

  /**
   * 显示错误提示
   */
  showError(title = '失败', duration = 1500) {
    wx.showToast({
      title,
      icon: 'error',
      duration
    });
  },

  /**
   * 显示信息提示
   */
  showInfo(title = '提示', duration = 1500) {
    wx.showToast({
      title,
      icon: 'none',
      duration
    });
  },

  /**
   * 显示确认对话框
   */
  showConfirm(options = {}) {
    return new Promise((resolve) => {
      wx.showModal({
        title: options.title || '提示',
        content: options.content || '',
        confirmText: options.confirmText || '确定',
        cancelText: options.cancelText || '取消',
        success: (res) => {
          resolve(res.confirm);
        }
      });
    });
  },

  /**
   * 复制到剪贴板
   */
  copyToClipboard(text) {
    wx.setClipboardData({
      data: text,
      success: () => {
        this.showSuccess('已复制到剪贴板');
      }
    });
  },

  /**
   * 生成唯一ID
   */
  generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  },

  /**
   * 判断是否为空对象
   */
  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  },

  /**
   * 延迟执行
   */
  sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

module.exports = helpers;
