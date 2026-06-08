// components/button/button.js
Component({
  properties: {
    type: {
      type: String,
      value: 'primary'  // primary | secondary
    },
    size: {
      type: String,
      value: 'medium'  // small | medium | large
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    text: {
      type: String,
      value: ''
    }
  },

  data: {
    // 组件内部数据
  },

  methods: {
    handleTap() {
      if (this.data.disabled || this.data.loading) return;
      this.triggerEvent('click');
    }
  }
});
