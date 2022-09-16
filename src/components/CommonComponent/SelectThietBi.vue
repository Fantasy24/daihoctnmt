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
      >
        <el-option v-if="isShowOptionAll" :label="labelOption" :value="''" />
        <el-option
          v-for="item in listData"
          :key="item.deviceId"
          :title="item.deviceName"
          :label="`${(item.deviceName || '').substring(0, 60)}`"
          :value="item.deviceId"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { errAlert } from "ff24-js/src/utils/AlertMessage";
import apiFactory from "../../api/apiFactory";
import ConstantAPI from "../../utils/ConstantAPI";

export default {
  props: {
    vModel: {
      type: Number,
      default: null,
    },
    idContainer: {
      type: String,
      default: "idSelectThietBi",
    },
    popperClass: {
      type: String,
      default: "idSelectThietBi",
    },
    label: {
      type: String,
      default: "Thiết bị",
    },
    isShowOptionAll: {
      type: Boolean,
      default: true,
    },
    labelOption: {
      type: String,
      default: "Tất cả",
    },
    placeholder: {
      type: String,
      default: "Thiết bị",
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    rules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "Thiết bị bắt buộc nhập" }];
      },
    },
    propForm: {
      type: String,
      default: "",
    },
    labelWidth: {
      type: String,
      default: "",
    },
    isFilter: {
      type: Boolean,
      default: false,
    },
    filterData: {
      type: Number,
      default: null,
    },
    getList: Function,
  },
  data() {
    return {
      loading: false,
      lstDataTB: [],
    };
  },
  computed: {
    valueSync: {
      get() {
        return this.vModel;
      },
      set(val) {
        this.$emit("update:vModel", val);
      },
    },
    listData() {
      return this.lstDataTB || [];
    },
  },
  created() {
    // this.loadFilterData(this.filterData);
  },
  mounted() {
    this.onLoadList();
  },
  methods: {
    onLoadList() {
      if (!this.listData.length) {
        this.loading = true;
        apiFactory
          .callAPI(ConstantAPI["DMTB"].SEARCH_ALL)
          .then((rs) => {
            this.loading = false;
            this.lstDataTB = rs || [];
            if (this.getList !== undefined && this.getList !== null) {
              this.getList(this.lstDataTB);
            }
            // console.log(this.lstDataTB)
          })
          .catch((err) => {
            this.loading = false;
            errAlert(this, err);
            // console.log(err)
          });
      }
    },
    loadFilterData(code) {
      this.loading = true;
      apiFactory
        .callAPI(ConstantAPI["DMTB"].SEARCH_ALL, {}, { id: parseInt(code) })
        .then((rs) => {
          this.loading = false;
          this.lstDataTB = rs || [];
        })
        .catch((err) => {
          this.loading = false;
          errAlert(this, err);
          // console.log(err)
        });
    },
    getListData() {
      return this.lstDataTB;
    },
    reloadData(code) {
      this.loadFilterData(code);
    },
    onChange(value) {
      this.$emit("change", value);
    },
  },
};
</script>

<style scoped></style>
