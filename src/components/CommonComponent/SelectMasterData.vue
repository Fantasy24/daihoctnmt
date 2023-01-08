<template>
  <div :id="idContainer">
    <el-form-item
      :prop="propForm"
      :rules="required ? ruleValidate : null"
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
          :key="item.propertyValue"
          :title="item.propertyName"
          :label="`${(item.propertyName || '').substring(0, 60)}`"
          :value="item.propertyValue"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { errAlert } from "ff24-js/src/utils/AlertMessage";
import apiFactory from "../../api/apiFactory";
import ConstantAPI from "../../utils/ConstantAPI";
import { LIST_MASTER_DATA } from "../../utils/ECustomsUtils";

export default {
  props: {
    vModel: {
      type: String,
      default: "",
    },
    idContainer: {
      type: String,
      default: "idSelectTrangThaiPtpl",
    },
    popperClass: {
      type: String,
      default: "idSelectTrangThaiPtpl",
    },
    label: {
      type: String,
      default: "Trạng thái",
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
      default: "Trạng thái",
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
        return [{ required: true, message: "Thông tin này bắt buộc nhập" }];
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
      type: String,
      default: "",
    },
    listValue: {
      type: String,
      default: "",
    },
    listDataCustom: {
      type: Array,
      default: [],
    },
    getList: Function,
  },
  data() {
    return {
      loading: false,
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
    ruleValidate() {
      return [{ required: true, message: this.label + " bắt buộc nhập" }];
    },
    listData() {
      return this.loadFilterData(this.filterData);
    },
  },
  mounted() {
    if (this.getList !== undefined && this.getList !== null) {
      this.getList(this.listData);
    }
    // this.onLoadList()
  },
  methods: {
    onLoadList() {
      if (!this.listData.length) {
        this.loading = true;
        apiFactory
          .callAPI(ConstantAPI["DMNV"].STATUS_PTPL)
          .then((rs) => {
            this.loading = false;
            this.$store.dispatch(
              "common/listCommonData/setDanhSachTrangThaiPTPL",
              rs || []
            );
          })
          .catch((err) => {
            this.loading = false;
            errAlert(this, err);
            // console.log(err)
          });
      }
    },
    loadFilterData(code) {
      const arrDK = [undefined, null, ""];
      if (
        arrDK.indexOf(this.listDataCustom) === -1 &&
        this.listDataCustom.length > 0
      ) {
        return this.listDataCustom;
      }
      const lstMasterDataAll = JSON.parse(
        localStorage.getItem(LIST_MASTER_DATA)
      );
      const lstMasterDataFilter = lstMasterDataAll;

      if (this.isFilter && arrDK.indexOf(code) === -1) {
        const lstMasterData =
          lstMasterDataFilter !== null
            ? lstMasterDataFilter.filter((obj) => obj.type === code)
            : [];
        return this.getMasterDataByListValue(lstMasterData);
      } else {
        return this.getMasterDataByListValue(lstMasterDataFilter);
      }
    },
    getMasterDataByListValue(arrFilter) {
      const arrDK = [undefined, null, ""];
      if (arrDK.indexOf(this.listValue) === -1) {
        const lstSts = this.listValue;
        return arrFilter.filter(
          (obj) => lstSts.indexOf(obj.propertyValue) > -1
        );
      }
      return arrFilter;
    },
    onChange(value) {
      this.$emit("change", value);
    },
    onClear() {
      this.$emit("update:vModel", null);
    },
  },
};
</script>

<style scoped></style>
