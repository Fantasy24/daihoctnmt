<template>
  <select-list
    :label="label"
    :required="required"
    :disabled="disabled"
    :rules="rules"
    :v-modal.sync="selectedValue"
    :fill-data-begin="true"
    :constant-api="ConstantAPI[menuCodeApi].GET_LIST_TONG_TL_DVT"
    key-prop="code"
    label-prop="name"
    :prop="prop"
    placeholder="Chọn"
    @change="change"
  />
</template>

<script>
/* eslint-disable vue/require-default-prop */
import SelectList from '@/components/BaseFormCustoms/SelectList'
import ConstantAPI from '@/utils/ConstantAPI'

export default {
  components: {
    SelectList
  },
  props: {
    vModel: {
      type: String,
      required: true,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      required: true
    },
    rules: {
      type: Array,
      default: () => {
        return [{ required: true, message: 'ĐVT tổng trọng lượng bắt buộc' }]
      }
    },
    required: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'ĐVT tổng trọng lượng'
    },
    prop: {
      type: String,
      default: 'tongTrongLuongDvt'
    },
    menuCodeApi: {
      type: String,
      required: true
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
    }
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
