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
        :clearable="false"
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
          :key="item.ma_chuong"
          :title="item.ma_chuong"
          :label="`${((item.ma_chuong + ' - '+ item.ten_chuong)|| '').substring(0, 60)}`"
          :value="item.ma_chuong"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>

import { LIST_CHUONG_HH } from '@/utils/ECustomsUtils'

export default {
  props: {
    vModel: {
      type: String,
      default: ''
    },
    idContainer: {
      type: String,
      default: 'idSelectChuongHh'
    },
    popperClass: {
      type: String,
      default: 'idSelectChuongHh'
    },
    label: {
      type: String,
      default: 'Chương'
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
          { required: true, message: 'Chương của hàng hóa bắt buộc nhập' }
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
    getList: Function
  },
  data() {
    return {
      loading: false,
      lstDataChuong: []
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
      return this.loadFilterData(this.filterData) || []
    }
  },
  created() {
    // this.loadFilterData(this.filterData)
  },
  mounted() {
    if (this.getList !== undefined && this.getList !== null) {
      this.getList(this.listData)
    }
    this.onLoadList()
  },
  methods: {
    onLoadList() {
      const lstChuong = JSON.parse(
        localStorage.getItem(LIST_CHUONG_HH)
      )
      this.lstDataChuong = lstChuong
      console.log(lstChuong)
    },
    loadFilterData(code) {
      const arrDK = [undefined, null, '']
      const lstChuong = JSON.parse(
        localStorage.getItem(LIST_CHUONG_HH)
      )
      const lstTrangThaiFilter = lstChuong

      if (arrDK.indexOf(code) === -1) {
        const lstCurrent =
          lstTrangThaiFilter !== null
            ? lstTrangThaiFilter.filter(
              obj => obj.ma_phan === code
            )
            : []
        this.lstDataChuong = lstCurrent
      } else {
        this.lstDataChuong = lstTrangThaiFilter
      }
      return this.lstDataChuong
    },
    getListData() {
      return this.lstDataChuong
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
