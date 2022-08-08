<template>
  <select-list
    :label="label"
    :required="required"
    :rules="rules"
    :v-modal.sync="selectedValue"
    :constant-api="ConstantAPI[menuCodeApi].GET_TRADE_TYPE_ALL"
    key-prop="code"
    label-prop="name"
    :prop="prop"
    :default-first-option="false"
    :placeholder="placeholder"
    :clearable="clearable"
  />
</template>

<script>
/* eslint-disable vue/require-default-prop */
import SelectList from '@/components/BaseFormCustoms/SelectList'
import ConstantAPI from '@/utils/ConstantAPI'

export default {
  name: 'SelectTradeType',
  components: {
    SelectList
  },
  props: {
    vModel: {
      type: String,
      required: true,
      default: ''
    },
    rules: Array,
    required: {
      type: Boolean,
      default: false
    },
    prop: {
      type: String,
      default: 'tradeType'
    },
    label: {
      type: String,
      default: 'Mã loại hình'
    },
    placeholder: {
      type: String,
      default: 'Chọn mã loại hình'
    },
    menuCodeApi: {
      type: String,
      required: true
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      ConstantAPI
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.vModel
      },
      set(val) {
        this.$emit('update:vModel', val)
      }
    },
    orgCode() {
      return { orgCode: this.form.orgCode }
    }
  }
}
</script>

<style scoped>

</style>
