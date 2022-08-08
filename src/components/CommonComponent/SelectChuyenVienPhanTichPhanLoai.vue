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
      >
        <el-option v-if="isShowOptionAll" :label="labelOption" :value="''" />
        <el-option
          v-for="item in listData"
          :key="item.user_name"
          :title="item.ho_ten"
          :label="`${(item.ho_ten || '').substring(0, 80)}`"
          :value="item.user_name"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { errAlert } from 'ff24-js/src/utils/AlertMessage'
import apiFactory from '../../api/apiFactory'
import ConstantAPI from '../../utils/ConstantAPI'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    maDonVi: {
      type: String,
      default: ''
    },
    loaiChuyenVien: {
      type: Number,
      default: 0
    },
    idContainer: {
      type: String,
      default: 'idSelectChuyenVienPhanTichPhanLoai'
    },
    popperClass: {
      type: String,
      default: 'idSelectChuyenVienPhanTichPhanLoai'
    },
    label: {
      type: String,
      default: 'Chuyên viên phân tích phân loại'
    },
    placeholder: {
      type: String,
      default: 'Chọn chuyên viên'
    },
    isShowOptionAll: {
      type: Boolean,
      default: true
    },
    labelOption: {
      type: String,
      default: 'Tất cả'
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
          { required: true, message: 'Chuyên viên phân tích phân loại bắt buộc nhập' }
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
    }
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
      if (
        this.loaiChuyenVien !== undefined &&
        this.loaiChuyenVien !== null &&
        this.loaiChuyenVien !== 0
      ) {
        return (
          this.$store.state['common'].listCommonData.danhSachChuyenVienPhanTichPhanLoai.filter(
            obj => (obj.ma_chi_cuc === this.maDonVi) && (obj.loai_hanh_dong === parseInt(this.loaiChuyenVien) || (obj.loai_hanh_dong === 3 && parseInt(this.loaiChuyenVien) !== 4))
          ) || []
        )
      } else {
        return this.$store.state['common'].listCommonData.danhSachChuyenVienPhanTichPhanLoai || []
      }
    }
  },
  mounted() {
    this.onLoadList()
  },
  methods: {
    onLoadList() {
      if (!this.listData.length) {
        this.loading = true
        const param = {
          maChiCuc: this.maDonVi
        }
        apiFactory
          .callAPI(ConstantAPI['DMCVPTPL'].SEARCH_BY_MA_DV, {}, param)
          .then(rs => {
            this.loading = false
            this.$store.dispatch(
              'common/listCommonData/setDanhSachChuyenVienPhanTichPhanLoai',
              rs || []
            )
          })
          .catch(err => {
            this.loading = false
            errAlert(this, err)
            console.log(err)
          })
      }
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
