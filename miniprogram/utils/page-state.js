// utils/page-state.js
/**
 * 页面状态管理工具
 * 处理加载、错误、空状态等
 */

const pageState = {
  // 页面状态常量
  STATE: {
    LOADING: 'loading',
    EMPTY: 'empty',
    ERROR: 'error',
    SUCCESS: 'success'
  },

  /**
   * 初始化页面状态
   */
  init() {
    return {
      state: 'success',
      loading: false,
      error: '',
      emptyText: '暂无数据',
      errorText: '加载失败，请重试'
    };
  },

  /**
   * 设置加载状态
   */
  setLoading(data) {
    return {
      ...data,
      state: this.STATE.LOADING,
      loading: true,
      error: ''
    };
  },

  /**
   * 设置成功状态
   */
  setSuccess(data, newData = {}) {
    return {
      ...data,
      ...newData,
      state: this.STATE.SUCCESS,
      loading: false,
      error: ''
    };
  },

  /**
   * 设置错误状态
   */
  setError(data, error = '加载失败') {
    return {
      ...data,
      state: this.STATE.ERROR,
      loading: false,
      error: error
    };
  },

  /**
   * 设置空状态
   */
  setEmpty(data, emptyText = '暂无数据') {
    return {
      ...data,
      state: this.STATE.EMPTY,
      loading: false,
      emptyText: emptyText
    };
  },

  /**
   * 检查是否加载中
   */
  isLoading(state) {
    return state === this.STATE.LOADING;
  },

  /**
   * 检查是否出错
   */
  isError(state) {
    return state === this.STATE.ERROR;
  },

  /**
   * 检查是否为空
   */
  isEmpty(state) {
    return state === this.STATE.EMPTY;
  }
};

module.exports = pageState;
