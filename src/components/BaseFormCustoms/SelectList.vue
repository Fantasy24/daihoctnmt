<template>
  <div>
    <el-form-item
      :label="label"
      :prop="prop"
      :required="required"
      :rules="rules"
      :label-width="labelWidth"
    >
      <el-select
        :id="prop"
        v-model="selectedValue"
        :disabled="disabled"
        filterable
        :placeholder="placeholder"
        style="width: 100%"
        :popper-class="popperClass"
        :remote="remote"
        :remote-method="remoteMethod"
        :loading="loading"
        :clearable="clearable"
        :value-key="selectedValue"
        filter
        @change="onChange"
        @focus="onfocus"
      >
        <el-option
          v-for="(item, i) in constantApi ? listData: dataSource"
          :key="item[keyProp] + i"
          :title="item[labelProp]"
          :label="showLabel(item[keyProp],item[labelProp])"
          :value="item[keyProp]"
        >
          <el-row>
            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="4">
              <span>{{ item[keyProp] }}</span>
            </el-col>
            <el-col :xs="12" :sm="12" :md="16" :lg="16" :xl="20">
              <span>{{ item[labelProp] }}</span>
            </el-col>
          </el-row>
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop,vue/require-prop-types */
import _ from 'lodash'
import apiFactory from 'ff24-js/src/api/apiFactory'
import { errAlert } from 'ff24-js/src/utils/AlertMessage'

export default {
  name: 'SelectList',
  props: {
    isFirst: Boolean,
    dataSource: {
      type: Array,
      default: () => []
    },
    popperClass: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    keyProp: {
      type: String,
      default: 'code'
    },
    labelProp: {
      type: String,
      default: 'name'
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    clearable: Boolean,
    fillDataBegin: {
      type: Boolean,
      default: true
    },
    isShowId: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    prop: {
      type: String,
      default: ''
    },
    vModal: {
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    remote: {
      type: Boolean,
      default: false
    },
    defaultFirstOption: {
      type: Boolean,
      default: true
    },
    remoteMethod: Function,
    constantApi: Object,
    requestParam: [Object, String],
    responseProp: String,
    allOption: Boolean
  },
  data() {
    return {
      loading: false,
      listData: [],
      max: 100
    }
  },
  computed: {
    selectedValue: {
      get() {
        return this.vModal
      },
      set(val) {
        this.$emit('update:vModal', val)
        const text = _.find(this.dataSource || this.listData, [this.keyProp, val])
        this.$emit('update:text', text ? text[this.labelProp] : '')
      }
    },
    syncParam: {
      get() {
        return this.requestParam
      },
      set(val) {
        this.$emit('update:requestParam', val)
      }
    }
  },
  watch: {
    requestParam() {
      if (this.constantApi && this.requestParam.orgCode) {
        this.$emit('update:vModal', '')
        this.getList()
      }
    },
    selectedValue() {
      if (!this.selectedValue && this.required && this.listData.length && this.defaultFirstOption) {
        this.selectedValue = this.listData && this.listData.length ? this.listData[0][this.keyProp] : ''
      }
    }
  },
  mounted() {
    if (this.fillDataBegin) {
      this.getList()
    }
    if (this.isFirst) {
      document.getElementById(this.prop).focus()
    }
  },
  methods: {
    showLabel(key, label) {
      const etc = label.length > this.max ? '...' : ''
      const labelSubstr = label.substring(0, this.max)
      const dash = key && key !== ' ' ? ' - ' : ''
      const isKeyLabel = this.isShowId ? key + dash + labelSubstr : labelSubstr
      return isKeyLabel + etc
    },
    onChange(value) {
      this.$emit('change', value)
      this.$emit('get-list', this.listData)
      const item = this.listData.filter(e => e[this.keyProp] === value)[0]
      this.$emit('get-item', item)
    },

    onfocus() {
      this.$emit('focus')
    },

    getList() {
      this.loading = true
      apiFactory.callAPI(this.constantApi, {}, this.syncParam).then((rs) => {
        this.listData = this.responseProp ? rs[this.responseProp] : rs
        if (this.allOption) {
          this.listData.unshift({ code: ' ', name: 'Tất cả' })
        }
        setTimeout(_ => {
          if (this.defaultFirstOption) {
            this.selectedValue = this.listData && this.listData.length ? this.listData[0][this.keyProp] : ''
          }
        })
        this.$emit('get-item', this.listData[0])
        this.loading = false
      }).catch(err => {
        this.loading = false
        this.listData = []
        this.selectedValue = ''
        errAlert(this, err)
      })
    }
  }
}
</script>
