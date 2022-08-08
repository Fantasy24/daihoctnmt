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
          :key="item.code"
          :title="item.name"
          :label="`${(item.name || '').substring(0, 60)}`"
          :value="item.code"
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
      default: 'Loại hình XNK'
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
      default: 'Loại hình XNK'
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
        return [{ required: true, message: 'Loại hình XNK bắt buộc nhập' }]
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
        this.$store.state['common'].listCommonData.danhSachLoaiHinhXNK || []
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
        apiFactory
          .callAPI(
            ConstantAPI['DMDC'].STRADE_TYPE,
            {},
            ConstantAPI['DMDC'].STRADE_TYPE.params
          )
          .then(rs => {
            this.loading = false
            this.$store.dispatch(
              'common/listCommonData/setDanhSachLoaiHinhXNK',
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

    onChange(value) {
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped></style>
