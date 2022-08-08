<template>
  <el-form-item :label="label" :prop="prop">
    <el-checkbox v-model="syncModel"/>
  </el-form-item>
</template>

<script>
export default {
  name: 'BarCode',
  props: {
    vModel: {
      type: Boolean,
      default: true
    },
    idFocus: {
      type: String,
      default: 'decId'
    },
    label: {
      type: String,
      default: 'Quét mã vạch'
    },
    prop: {
      type: String,
      default: 'barCode'
    }
  },
  mounted() {
    document.getElementById(this.idFocus).focus()
  },
  watch: {
    syncModel() {
      if (this.syncModel) {
        document.getElementById(this.idFocus).focus()
      }
    }
  },
  computed: {
    syncModel: {
      get() {
        return this.vModel
      },
      set(isChecked) {
        this.$emit('update:vModel', isChecked)
      }
    }
  }
}
</script>

<style scoped>

</style>
