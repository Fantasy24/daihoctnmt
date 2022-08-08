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
        <el-option v-if="isShowOptionAll" :label="labelOption" :value="null" />
        <el-option
          v-for="item in listData"
          :key="item.ma"
          :title="item.ten"
          :label="`${(item.ten || '').substring(0, 60)}`"
          :value="item.ma"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { errAlert } from 'ff24-js/src/utils/AlertMessage'
import apiFactory from '../../api/apiFactory'
import ConstantAPI from '../../utils/ConstantAPI'
import { LIST_TRANG_THAI_PTPL } from '../../utils/ECustomsUtils'

export default {
  props: {
    value: {
      type: Number,
      default: null
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
      default: 'Trạng thái'
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
      default: 'Trạng thái phiếu PTPL'
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
          { required: true, message: 'Trạng thái phiếu PTPL bắt buộc nhập' }
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
      type: Number,
      default: null
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
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    },
    listData() {
      return this.loadFilterData(this.filterData)
    }
  },
  mounted() {
    if (this.getList !== undefined && this.getList !== null) {
      this.getList(this.listData)
    }
    // this.onLoadList()
  },
  methods: {
    onLoadList() {
      if (!this.listData.length) {
        this.loading = true
        apiFactory
          .callAPI(ConstantAPI['DMNV'].STATUS_PTPL)
          .then(rs => {
            this.loading = false
            this.$store.dispatch(
              'common/listCommonData/setDanhSachTrangThaiPTPL',
              rs || []
            )
          })
          .catch(err => {
            this.loading = false
            errAlert(this, err)
            // console.log(err)
          })
      }
    },
    loadFilterData(code) {
      const arrDK = [undefined, null, '']
      const lstTrangThai = JSON.parse(
        localStorage.getItem(LIST_TRANG_THAI_PTPL)
      )
      const lstTrangThaiFilter = lstTrangThai

      if (this.isFilter && arrDK.indexOf(code) === -1) {
        const lstStatus =
          lstTrangThaiFilter !== null
            ? lstTrangThaiFilter.filter(
              obj => obj.loai_chuc_nang === parseInt(code)
            )
            : []
        return this.getStatusByListSts(lstStatus)
      } else {
        return this.getStatusByListSts(lstTrangThaiFilter)
      }
    },
    getStatusByListSts(arrFilter) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(this.listStatus) === -1) {
        const lstSts = this.listStatus
        return arrFilter.filter(obj => lstSts.indexOf(obj.ma) > -1)
      }
      return arrFilter
    },
    onChange(value) {
      this.$emit('change', value)
    },
    onClear() {
      this.$emit('update:value', null)
    }
  }
}
</script>

<style scoped></style>
