<template>
  <div :id="idContainer">
    <el-form-item
      :prop="propForm"
      :rules="required ? rules : null"
      :required="required"
      :label="showLabel ? label : ''"
      :label-width="labelWidth"
    >
      <el-select
        v-model="valueSync"
        :popper-class="popperClass"
        clearable
        filterable
        :placeholder="placeholder"
        style="width: 100%"
        :disabled="disabled"
        :loading="loading"
        @change="onChange"
        @clear="onClear"
      >
        <el-option v-if="isShowOptionAll" :label="labelOption" :value="''" />
        <el-option
          v-for="item in listData"
          :key="item.ma_phan"
          :title="item.ten_phan"
          :label="`${((item.ma_phan + ' - '+ item.ten_phan)|| '').substring(0, 60)}`"
          :value="item.ma_phan"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>

import { LIST_PHAN_HH } from '../../utils/ECustomsUtils'

export default {
  props: {
    vModel: {
      type: String,
      default: ''
    },
    idContainer: {
      type: String,
      default: 'idSelectTrangThaiPtpl'
    },
    popperClass: {
      type: String,
      default: 'idSelectTrangThaiPtpl'
    },
    label: {
      type: String,
      default: 'Phần'
    },
    isShowOptionAll: {
      type: Boolean,
      default: true
    },
    labelOption: {
      type: String,
      default: 'Tất cả'
    },
    placeholder: {
      type: String,
      default: 'Phần của hàng hóa'
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    rules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: 'Phần của hàng hóa bắt buộc nhập' }
        ]
      }
    },
    propForm: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    isFilter: {
      type: Boolean,
      default: false
    },
    filterData: {
      type: String,
      default: ''
    },
    listStatus: {
      type: String,
      default: ''
    },
    getList: Function
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    valueSync: {
      get() {
        return this.vModel
      },
      set(val) {
        this.$emit('update:vModel', val)
      }
    },
    listData() {
      return this.loadData()
    }
  },
  mounted() {
    if (this.getList !== undefined && this.getList !== null) {
      this.getList(this.listData)
    }
    // this.onLoadList()
  },
  methods: {
    loadData() {
      const lstPhanHh = JSON.parse(
        localStorage.getItem(LIST_PHAN_HH)
      )
      return lstPhanHh
    },
    onChange(value) {
      this.$emit('change', value)
    },
    onClear() {
      this.$emit('update:vModel', null)
    }
  }
}
</script>

<style scoped></style>
