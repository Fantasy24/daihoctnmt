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
          :key="item.fullname "
          :title="item.fullname"
          :label="`${(item.fullname || '').substring(0, 60)}`"
          :value="item.fullname"
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
    idContainer: {
      type: String,
      default: 'idSelectLoaiHinhXnk'
    },
    popperClass: {
      type: String,
      default: 'idSelectLoaiHinhXnk'
    },
    label: {
      type: String,
      default: 'Công chức HQ lấy mẫu'
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
      default: 'Công chức HQ lấy mẫu'
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
        return [{ required: true, message: 'Công chức HQ lấy mẫu bắt buộc nhập' }]
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
      return (
        this.$store.state['common'].listCommonData.danhSachCanBoHQ || []
      )
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
          orgCode: this.$store.getters.userInfo.org,
          page: 0,
          size: 5000
        }
        apiFactory
          .callAPI(
            ConstantAPI['DMDC'].USER,
            {},
            param
          )
          .then(rs => {
            this.loading = false
            this.$store.dispatch(
              'common/listCommonData/setDanhSachCanBoHQ',
              rs.result || []
            )
          })
          .catch(err => {
            this.loading = false
            errAlert(this, err)
            // console.log(err)
          })
      }
    },

    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped></style>
