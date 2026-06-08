// utils/storage.js
/**
 * 本地存储管理模块
 */

const storage = {
  // 存储键名前缀
  PREFIX: 'yizhijianli_',

  /**
   * 获取完整的键名
   */
  _getKey(key) {
    return this.PREFIX + key;
  },

  /**
   * 保存数据
   */
  setItem(key, value) {
    try {
      const fullKey = this._getKey(key);
      const data = typeof value === 'object' ? JSON.stringify(value) : value;
      wx.setStorageSync(fullKey, data);
      return true;
    } catch (e) {
      console.error('存储失败:', e);
      return false;
    }
  },

  /**
   * 读取数据
   */
  getItem(key, defaultValue = null) {
    try {
      const fullKey = this._getKey(key);
      const data = wx.getStorageSync(fullKey);

      if (!data) return defaultValue;

      // 尝试解析JSON
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch (e) {
      console.error('读取失败:', e);
      return defaultValue;
    }
  },

  /**
   * 删除数据
   */
  removeItem(key) {
    try {
      const fullKey = this._getKey(key);
      wx.removeStorageSync(fullKey);
      return true;
    } catch (e) {
      console.error('删除失败:', e);
      return false;
    }
  },

  /**
   * 清空所有数据
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清空失败:', e);
      return false;
    }
  },

  /**
   * 保存用户信息
   */
  setUserInfo(userInfo) {
    return this.setItem('userInfo', {
      ...userInfo,
      updateTime: Date.now()
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return this.getItem('userInfo', null);
  },

  /**
   * 保存简历列表
   */
  setResumeList(resumes) {
    return this.setItem('resumeList', {
      data: resumes,
      updateTime: Date.now()
    });
  },

  /**
   * 获取简历列表
   */
  getResumeList() {
    const data = this.getItem('resumeList', { data: [] });
    return data.data || [];
  },

  /**
   * 保存单个简历草稿
   */
  setResumeDraft(resumeId, draftData) {
    return this.setItem(`resume_${resumeId}`, {
      ...draftData,
      saveTime: Date.now()
    });
  },

  /**
   * 获取简历草稿
   */
  getResumeDraft(resumeId) {
    return this.getItem(`resume_${resumeId}`, null);
  },

  /**
   * 删除简历草稿
   */
  removeResumeDraft(resumeId) {
    return this.removeItem(`resume_${resumeId}`);
  },

  /**
   * 保存登录信息
   */
  setLoginInfo(loginInfo) {
    return this.setItem('loginInfo', {
      ...loginInfo,
      loginTime: Date.now()
    });
  },

  /**
   * 获取登录信息
   */
  getLoginInfo() {
    return this.getItem('loginInfo', null);
  },

  /**
   * 保存简历预览历史
   */
  addResumeHistory(resumeId, resumeData) {
    const history = this.getItem('resumeHistory', []);
    const newEntry = {
      resumeId,
      title: resumeData.title,
      viewTime: Date.now()
    };

    // 去重并保持最近的记录
    const filtered = history.filter(item => item.resumeId !== resumeId);
    const updated = [newEntry, ...filtered].slice(0, 10); // 最多保存10条

    return this.setItem('resumeHistory', updated);
  },

  /**
   * 获取简历预览历史
   */
  getResumeHistory() {
    return this.getItem('resumeHistory', []);
  }
};

module.exports = storage;
