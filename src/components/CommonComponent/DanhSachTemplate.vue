<template>
  <el-dialog
    :close-on-click-modal="false"
    title="Danh sách Phiếu yêu cầu"
    :visible.sync="flagShowDialog"
    width="70%"
    @close="closeTemplate"
  >
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="150px"
        @keyup.enter.native="onSearchTemplate()"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Số tờ khai" prop="soToKhai">
              <el-input-etc
                :v-model.sync="formSearch.soToKhai"
                placeholder="Số tờ khai"
                :maxlength="15"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-button
              ref="btnSearch"
              icon="el-icon-search"
              type="primary"
              @click="onSearchTemplate()"
            >
              {{ $t('baseLabel.btnSearch') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card>
      <div>
        <el-table-etc-custom
          ref="tblTemplate"
          :list-data-table.sync="listDataTable"
          :loading.sync="loadDataTable"
          :total.sync="total"
          :columns="columns"
          :is-export="false"
          :is-show-pdf="false"
          :is-show-print="false"
          :api-fetch="apiFetch"
          :params-fetch="param"
          :highlight-current-row="false"
          :is-pagination="false"
          :page.sync="formSearch.page"
          :size.sync="formSearch.size"
        >
          <div slot="columns">
            <el-table-column
              :label="$t('baseLabel.labelTableAction')"
              align="center"
              width="125"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :open-delay="350"
                  content="Chọn template"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    id="btnEditCo"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-check"
                    size="mini"
                    type="primary"
                    @click="onChoose(scope.row)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </div>
        </el-table-etc-custom>
      </div>
    </el-card>
  </el-dialog>
</template>

<script>
import apiFactory from '../../api/apiFactory'
import ConstantAPI from '../../utils/ConstantAPI'
import { formatFullDate_VN } from '../../filters/index'
import {
  ERROR,
  showAlert,
  errAlert,
  showConfirmDelete,
  SUCCESS
} from 'ff24-js/src/utils/AlertMessage'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showDlgTemplate: {
      type: Boolean,
      default: false
    },
    propForm: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    loaiHs: {
      type: String,
      default: '0'
    },
    apiFetch: {
      type: Object,
      default: null
    },
    closeTemplate: Function,
    fillTemplate: Function
  },
  data() {
    return {
      loading: false,
      iconEditLoading: false,
      buttonUpdateLoading: false,
      iconDelLoading: false,
      iconShowKBBKLoading: false,
      flagShowDialog: this.showDlgTemplate,
      formSearch: {
        maChucNang: 1,
        maHqYeuCau: '',
        maHqTiepNhan: '_'.concat(this.$store.getters.userInfo.org),
        soToKhai: '',
        page: 0,
        size: 5000
      },
      param: {
        loaiHoSo: this.loaiHs,
        maDvxnk: this.$store.getters.userInfo.org,
        page: this.page,
        size: this.size
      },
      page: 0,
      size: 500,
      total: 0,
      listDataTable: [],
      loadDataTable: false,
      columns: [
        {
          prop: 'so_to_khai',
          label: 'Số tờ khai',
          width: '150',
          align: 'center',
          show: true
        },
        {
          prop: 'so_phieu_yeu_cau',
          label: 'Số phiếu yêu cầu',
          width: '150',
          align: 'center',
          show: true
        },
        {
          prop: 'ngay_lap',
          label: 'Ngày lập phiếu',
          width: '100',
          align: 'center',
          formatter: row => {
            return formatFullDate_VN(row.ngay_lap)
          },
          show: true
        },
        {
          prop: 'ma_dvxnk',
          label: 'Đơn vị XNK',
          width: '270',
          align: 'center',
          formatter: row => {
            const tenDvxnk = row.ten_dvxnk !== null ? row.ten_dvxnk : ''
            return row.ma_dvxnk.concat(' - ', tenDvxnk)
          },
          show: true
        }
      ]
    }
  },
  computed: {
    syncTotal: {
      get() {
        return this.total
      },
      set(total) {
        this.$emit('update:total', total)
      }
    }
  },
  watch: {
    showDlgTemplate(newValue) {
      this.flagShowDialog = newValue
    }
  },

  mounted() {
  },
  methods: {
    onLoadList() {
      this.loadDataTable = true
      apiFactory
        .callAPI(ConstantAPI['YCPTPL'].SEARCH_BY_SOTK, {}, this.param)
        .then(rs => {
          // console.log(rs)
          this.loadDataTable = false
          this.listDataTable = rs.result
        })
        .catch(err => {
          this.loadDataTable = false
          errAlert(this, err)
          // console.log(err)
        })
      // }
    },
    onChoose(row) {
      this.fillTemplate(row)
    },
    onSearchTemplate() {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(this.formSearch.soToKhai) > -1) return false
      this.$refs.tblTemplate.resetPage()
      this.loadDataTable = true
      apiFactory
        .callAPI(ConstantAPI['YCPTPL'].SEARCH_BY_SOTK, {}, this.formSearch)
        .then(rs => {
          this.loadDataTable = false
          this.listDataTable = rs.result
          console.log(rs)
          this.total = rs['totalElements']
          // console.log(this.total)
        })
        .catch(err => {
          this.loadDataTable = false
          this.listDataTable = []
          errAlert(this, err)
        })
    },
    onDelete(row) {
      showConfirmDelete(
        this.$confirm,
        () => {
          const param = {
            id: row.id
          }
          this.iconDelLoading = true
          apiFactory
            .callAPI(ConstantAPI['HOSO'].DELETE_TEMPLATE, {}, param)
            .then(() => {
              showAlert(this, SUCCESS, 'Xóa thành công!')
              this.iconDelLoading = false
              this.onLoadList()
            })
            .catch(err => {
              this.iconDelLoading = false
              showAlert(this, ERROR, 'Lỗi! ' + err.message)
            })
        }
      )
    }
  }
}
</script>

<style scoped></style>
