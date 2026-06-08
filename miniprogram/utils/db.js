// utils/db.js
/**
 * 云数据库操作工具
 */

const db = wx.cloud.database();
const _ = db.command;

const dbUtil = {
  /**
   * 获取用户的简历列表
   */
  getUserResumes() {
    return new Promise((resolve, reject) => {
      db.collection('resumes')
        .where({
          _openid: _.exists(true) // 自动匹配当前用户
        })
        .orderBy('updatedAt', 'desc')
        .get()
        .then(res => {
          console.log('✓ 获取简历列表成功:', res.data);
          resolve(res.data);
        })
        .catch(err => {
          console.error('❌ 获取简历列表失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 获取单个简历详情
   */
  getResumeById(id) {
    return new Promise((resolve, reject) => {
      db.collection('resumes')
        .doc(id)
        .get()
        .then(res => {
          console.log('✓ 获取简历详情成功:', res.data);
          resolve(res.data);
        })
        .catch(err => {
          console.error('❌ 获取简历详情失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 创建新简历
   */
  createResume(data) {
    return new Promise((resolve, reject) => {
      db.collection('resumes')
        .add({
          data: {
            ...data,
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        })
        .then(res => {
          console.log('✓ 创建简历成功:', res._id);
          resolve(res._id);
        })
        .catch(err => {
          console.error('❌ 创建简历失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 更新简历
   */
  updateResume(id, data) {
    return new Promise((resolve, reject) => {
      db.collection('resumes')
        .doc(id)
        .update({
          data: {
            ...data,
            updatedAt: db.serverDate()
          }
        })
        .then(res => {
          console.log('✓ 更新简历成功:', res);
          resolve(res);
        })
        .catch(err => {
          console.error('❌ 更新简历失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 删除简历
   */
  deleteResume(id) {
    return new Promise((resolve, reject) => {
      db.collection('resumes')
        .doc(id)
        .remove()
        .then(res => {
          console.log('✓ 删除简历成功:', res);
          resolve(res);
        })
        .catch(err => {
          console.error('❌ 删除简历失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 获取用户收藏的模板
   */
  getUserFavoriteTemplates() {
    return new Promise((resolve, reject) => {
      db.collection('favorites')
        .where({
          _openid: _.exists(true)
        })
        .get()
        .then(res => {
          console.log('✓ 获取收藏模板成功:', res.data);
          resolve(res.data);
        })
        .catch(err => {
          console.error('❌ 获取收藏模板失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 收藏模板
   */
  addFavoriteTemplate(templateId) {
    return new Promise((resolve, reject) => {
      db.collection('favorites')
        .add({
          data: {
            templateId: templateId,
            createdAt: db.serverDate()
          }
        })
        .then(res => {
          console.log('✓ 收藏模板成功:', res._id);
          resolve(res._id);
        })
        .catch(err => {
          console.error('❌ 收藏模板失败:', err);
          reject(err);
        });
    });
  },

  /**
   * 取消收藏模板
   */
  removeFavoriteTemplate(templateId) {
    return new Promise((resolve, reject) => {
      db.collection('favorites')
        .where({
          _openid: _.exists(true),
          templateId: templateId
        })
        .remove()
        .then(res => {
          console.log('✓ 取消收藏成功:', res);
          resolve(res);
        })
        .catch(err => {
          console.error('❌ 取消收藏失败:', err);
          reject(err);
        });
    });
  }
};

module.exports = dbUtil;
