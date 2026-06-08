// components/input/input.js
Component({
  properties: {
    value: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    error: {
      type: String,
      value: ''
    },
    required: {
      type: Boolean,
      value: false
    }
  },

  data: {
    isFocus: false
  },

  methods: {
    handleInput(e) {
      const value = e.detail.value;
      this.setData({ value });
      this.triggerEvent('change', { value });
    },

    handleFocus() {
      this.setData({ isFocus: true });
      this.triggerEvent('focus');
    },

    handleBlur() {
      this.setData({ isFocus: false });
      this.triggerEvent('blur');
    }
  }
});
