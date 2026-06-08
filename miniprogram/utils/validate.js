// utils/validate.js
/**
 * 表单验证工具
 */

const validate = {
  // 验证规则
  rules: {
    required: (value) => {
      if (!value || value.toString().trim() === '') {
        return '此项不能为空';
      }
      return '';
    },

    email: (value) => {
      const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailReg.test(value)) {
        return '邮箱格式不正确';
      }
      return '';
    },

    phone: (value) => {
      const phoneReg = /^1[3-9]\d{9}$/;
      if (value && !phoneReg.test(value)) {
        return '手机号格式不正确';
      }
      return '';
    },

    minLength: (min) => (value) => {
      if (value && value.length < min) {
        return `至少需要 ${min} 个字符`;
      }
      return '';
    },

    maxLength: (max) => (value) => {
      if (value && value.length > max) {
        return `最多 ${max} 个字符`;
      }
      return '';
    },

    range: (min, max) => (value) => {
      const num = Number(value);
      if (isNaN(num) || num < min || num > max) {
        return `请输入 ${min} 到 ${max} 之间的数字`;
      }
      return '';
    },

    pattern: (pattern, message) => (value) => {
      if (value && !pattern.test(value)) {
        return message || '格式不正确';
      }
      return '';
    }
  },

  /**
   * 执行单个验证规则
   */
  executeRule(rule, value) {
    if (typeof rule === 'function') {
      return rule(value);
    }
    return '';
  },

  /**
   * 验证表单字段
   */
  validateField(value, rules = []) {
    if (!Array.isArray(rules)) {
      rules = [rules];
    }

    for (let rule of rules) {
      const error = this.executeRule(rule, value);
      if (error) return error;
    }

    return '';
  },

  /**
   * 验证整个表单
   */
  validateForm(formData, schema) {
    const errors = {};
    let isValid = true;

    for (const [key, rules] of Object.entries(schema)) {
      const value = formData[key];
      const error = this.validateField(value, rules);

      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }

    return {
      isValid,
      errors
    };
  },

  /**
   * 验证单个邮箱
   */
  isEmail(email) {
    return this.executeRule(this.rules.email, email) === '';
  },

  /**
   * 验证单个手机号
   */
  isPhone(phone) {
    return this.executeRule(this.rules.phone, phone) === '';
  },

  /**
   * 验证是否为空
   */
  isEmpty(value) {
    return !value || value.toString().trim() === '';
  }
};

module.exports = validate;
