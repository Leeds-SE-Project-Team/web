<template>
  <div
    class="form-group"
    :class="[
      { 'input-group': hasIcon },
      { 'has-danger': error },
      { 'input-group-focus': focused },
      { 'has-label': label || $slots.label }
    ]"
  >
    <slot name="label">
      <label v-if="label" class="control-label" :class="labelClasses">
        {{ label }}
        <span v-if="required">*</span>
      </label>
    </slot>

    <div :class="[{ 'input-group': hasIcon }]">
      <slot name="addonLeft">
        <div v-if="addonLeftIcon" class="input-group-prepend">
          <i class="input-group-text" :class="addonLeftIcon"></i>
        </div>
      </slot>
      <slot>
        <input
          :value="value"
          @input="updateValue"
          @focus="onFocus"
          @blur="onBlur"
          v-bind="$attrs"
          class="form-control"
          :class="[{ valid: value && !error }, inputClasses]"
          aria-describedby="addon-right addon-left"
        />
      </slot>
      <slot name="addonRight">
        <span v-if="addonRightIcon" class="input-group-addon input-group-append">
          <i class="input-group-text" :class="addonRightIcon"></i>
        </span>
      </slot>

      <slot name="infoBlock"></slot>
      <slot name="helpBlock">
        <div
          class="text-danger invalid-feedback"
          style="display: block"
          :class="{ 'mt-2': hasIcon }"
          v-if="error"
        >
          {{ error }}
        </div>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'fg-input',
  props: {
    required: Boolean,
    label: String,
    error: String,
    labelClasses: String,
    inputClasses: String,
    value: {
      type: [String, Number],
      default: ''
    },
    addonRightIcon: String,
    addonLeftIcon: String
  },
  data() {
    return {
      focused: false
    }
  },
  computed: {
    hasIcon() {
      const { addonRight, addonLeft } = this.$slots
      return (
        addonRight !== undefined ||
        addonLeft !== undefined ||
        this.addonRightIcon !== undefined ||
        this.addonLeftIcon !== undefined
      )
    }
  },
  methods: {
    updateValue(evt) {
      let value = evt.target.value
      this.$emit('input', value)
    },
    onFocus(evt) {
      this.focused = true
      this.$emit('focus', evt)
    },
    onBlur(evt) {
      this.focused = false
      this.$emit('blur', evt)
    }
  }
}
</script>
<style></style>
