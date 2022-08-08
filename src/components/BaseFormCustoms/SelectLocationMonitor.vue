<template>
  <select-list
    :label="label"
    :required="required"
    :rules="rules"
    :v-modal.sync="selectedValue"
    :request-param="orgCode"
    :constant-api="ConstantAPI[menuCodeApi].GET_LIST_LOCATION_MONITOR"
    key-prop="maDiaDiem"
    label-prop="tenDiaDiem"
    :disabled="disable"
    :fill-data-begin="fillDataBegin"
    :prop="prop"
    placeholder="Chọn địa điểm giám sát"
    :default-first-option="true"
    @change="change"
    @get-item="onGetItem"
  />
</template>

<script>
/* eslint-disable vue/require-default-prop */
import SelectList from '@/components/BaseFormCustoms/SelectList'
import ConstantAPI from '@/utils/ConstantAPI'

export default {
  name: 'SelectLocation',
  components: {
    SelectList
  },
  props: {
    vModel: {
      type: String,
      required: true,
      default: ''
    },
    form: {
      type: Object,
      required: true
    },
    required: {
      type: Boolean,
      default: true
    },
    prop: {
      type: String,
      default: 'diaDiemXepHangMa'
    },
    rules: {
      type: Array,
      default: () => {
      }
    },
    menuCodeApi: {
      type: String,
      required: true
    },
    disable: {
      type: Boolean,
      required: false
    },
    fillDataBegin: {
      type: Boolean,
      default: true
    },
    orgProp: {
      type: String,
      default: 'orgCode'
    },
    label: {
      type: String,
      default: 'Địa điểm giám sát'
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
      return { orgCode: this.form[this.orgProp] }
    }
  },
  methods: {
    change(val) {
      this.$emit('change', val)
    },
    onGetItem(item) {
      this.$emit('get-item', item)
    }
  }
}
</script>

<style scoped>

</style>
