<template>
  <div>
    <el-table
      v-loading="syncLoadData"
      :data="syncData"
      :border="border"
      :fit="fit"
      :size="tableSize"
      style="width : 100%"
      :empty-text="emptyText"
      :width="width"
      :height="height"
      :max-height="maxHeight"
      :load="load"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :current-row-key="currentRowKey"
      :default-expand-all="defaultExpandAll"
      :default-sort="defaultSort"
      :expand-row-keys="expandRowKeys"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :highlight-current-row="highlightCurrentRow"
      :indent="indent"
      :lazy="lazy"
      :row-class-name="rowClassName"
      :row-key="rowKey"
      :row-style="rowStyle"
      :select-on-indeterminate="selectOnIndeterminate"
      :show-header="showHeader"
      :show-summary="showSummary"
      :span-method="spanMethod"
      :stripe="stripe"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :paging-parent="pagingParent"
      :tooltip-effect="tooltipEffect"
      :tree-props="treeProps"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @row-click="rowClick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDbclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-dragend="headerDragend"
      @expand-change="expandChange"
    >
      <el-table-column
        v-if="isSelectable"
        fixed
        type="selection"
        width="45"
        align="center"
      />

      <el-table-column
        v-if="showStt"
        label="STT"
        :index="
          i => {
            return (page >= 1 ? page - 1 : 0) * size + i + 1
          }
        "
        type="index"
        align="center"
        show-overflow-tooltip
        show-tooltip-when-overflow
        width="45"
      />

      <slot name="columnsTop" />

      <el-table-column
        v-for="col in renderTableColumns"
        :key="col.prop"
        :fixed="col.fixed"
        :label="col.label"
        :prop="col.prop"
        :align="col.align"
        :min-width="col.minWidth || col.width"
        :sortable="col.sortable"
        :sort-by="col.sortBy"
        :sort-method="col.sortMethod"
        :sort-orders="col.sortOrder"
        :show-overflow-tooltip="(col.showOverflowTooltip = true)"
        :show-tooltip-when-overflow="(col.showTooltipWhenOverflow = true)"
        :resizable="col.resizable"
        :formatter="typeof col.formatter === 'function' ? col.formatter : null"
        :type="col.type"
        :class-name="col.className"
        :label-class-name="col.labelClassName"
        :property="col.property"
        :render-header="col.renderHeader"
        :reserve-selection="col.reserveSelection"
        :filter-method="col.filterMethod"
        :filtered-value="col.filteredValue"
        :filters="col.filters"
        :filter-placement="col.filterPlacement"
        :filter-multiple="col.filterMultiple"
        :index="col.index"
        :column-key="col.columnKey"
        :header-align="col.headerAlign"
        :selectable="col.selectable"
      >
        <template
          v-if="col.formatter && typeof col.formatter !== 'function'"
          #default="{row}"
        >
          <div
            :is="col.formatter"
            v-if="col.formatter"
            :row="row"
            :column="col"
          />
          <template v-else>
            <span>{{ row[col.prop] }}</span>
          </template>
        </template>
      </el-table-column>

      <slot name="columns" />
    </el-table>

    <el-card
      v-if="
        isShowUtil && (isExport || isShowPdf || isShowPrint || isShowHideColumn)
      "
      id="formUtil"
      class="utilStyle"
      shadow="never"
    >
      <div>
        <el-button
          v-if="isExport && syncTotal > 0"
          :loading="loadExcel"
          circle
          size="mini"
          title="Xuất Excel"
          type="text"
          @click="exportExcel"
        >
          <svg-icon icon-class="excel" />
        </el-button>

        <el-button
          v-if="isShowPdf && syncTotal > 0"
          :loading="loadPdf"
          circle
          size="mini"
          title="Xuất PDF"
          type="text"
          @click="onExportPDF"
        >
          <svg-icon icon-class="pdf" />
        </el-button>

        <print
          v-if="isShowPrint && syncTotal > 0"
          :columns="renderTableColumns"
          :date-from="dateFrom"
          :date-to="dateTo"
          :export-title="reportTitle"
          :remote-method="remoteMethod || onGetDataPrint"
        />

        <el-popover
          v-if="isShowHideColumn"
          placement="bottom"
          width="auto"
          trigger="click"
        >
          <div class="checkedColumns">
            <div style="text-align: center !important;margin-bottom: 5px">
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckedAll"
              >
                Tất cả
              </el-checkbox>
            </div>
            <el-checkbox-group
              v-model="checkedTableColumns"
              :min="minChecked"
              @change="handleCheckedColumnsChange"
            >
              <el-row
                v-for="col in columns"
                :key="col.prop"
                :gutter="10"
                style="margin-bottom: 4px"
              >
                <el-checkbox :label="col.prop" :disabled="col.disabled">{{
                  col.label
                }}</el-checkbox>
              </el-row>
            </el-checkbox-group>
          </div>
          <el-button slot="reference" icon="el-icon-setting" size="mini" plain>
            Chọn chỉ tiêu
          </el-button>
        </el-popover>
      </div>
    </el-card>

    <pagination
      v-if="isPagination"
      v-show="syncTotal > 0"
      :page.sync="page"
      :limit.sync="size"
      :total="syncTotal"
      @pagination="pagination"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import { PAGINATION_PARAM } from 'ff24-js/src/utils/Constant'
import pdfMaker from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import {
  checkDate,
  formatDate,
  formatFullDateTime_VN,
  replaceEscapeChar
} from 'ff24-js/src/filters'
import moment from 'moment'
import apiFactory from 'ff24-js/src/api/apiFactory'
import { errAlert } from 'ff24-js/src/utils/AlertMessage'
import { deepClone } from 'ff24-js/src/utils'
import Print from 'ff24-customs-lib/src/components/Print/Print.vue'
import Pagination from 'ff24-customs-lib/src/components/Pagination/index.vue'
import { export_json_to_excel } from '../../utils/Export2ExcelCustomize'
import { formatFullDate_VN } from '../../filters/index'

import {
  multiHeaderExcelTraCuu,
  mergeCellExcelTraCuu,
  formatCellStyleExcelTraCuu,
  getNameByIdOnGrid
} from '../../utils/ECustomsUtils'

export default {
  name: 'ElTableEtcCustom',
  components: { Print, Pagination },
  props: {
    tableSize: {
      type: String,
      default: 'mini'
    },
    emptyText: {
      type: String,
      default: 'Không có dữ liệu'
    },
    listDataTable: {
      type: Array,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    isPagination: {
      type: Boolean,
      default: true
    },
    isSelectable: {
      type: Boolean,
      default: false
    },
    showStt: {
      type: Boolean,
      default: true
    },
    isDmHh: {
      type: Boolean,
      default: false
    },
    /* Table*/
    width: [String, Number],
    height: [String, Number],
    maxHeight: [String, Number],
    fit: {
      type: Boolean,
      default: true
    },
    stripe: Boolean,
    border: {
      type: Boolean,
      default: true
    },
    rowKey: [String, Function],
    showHeader: {
      type: Boolean,
      default: true
    },
    showSummary: Boolean,
    sumText: String,
    summaryMethod: Function,
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: [String, Function],
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    highlightCurrentRow: {
      type: Boolean,
      default: false
    },
    currentRowKey: [String, Number],
    expandRowKeys: Array,
    defaultExpandAll: Boolean,
    defaultSort: Object,
    tooltipEffect: String,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    },
    treeProps: {
      type: Object,
      default() {
        return {
          hasChildren: 'hasChildren',
          children: 'children'
        }
      }
    },
    lazy: Boolean,
    load: Function,
    isSttColumn: {
      type: Boolean,
      default: true
    },
    /* Table*/

    /* Export*/
    isShowHideColumn: {
      type: Boolean,
      default: true
    },
    isShowUtil: {
      type: Boolean,
      default: true
    },
    isExport: {
      type: Boolean,
      default: false
    },
    isExportTemplate: {
      type: Boolean,
      default: false
    },
    isShowPdf: {
      type: Boolean,
      default: false
    },
    isShowPrint: {
      type: Boolean,
      default: false
    },
    constantApiPdf: {
      type: Object,
      default() {
        return {
          url: '',
          method: 'GET',
          params: {}
        }
      }
    },
    constantApiExcel: {
      type: Object,
      default() {
        return {
          url: '',
          method: 'POST',
          params: {}
        }
      }
    },
    apiFetch: Object,
    paramsFetch: Object,
    fileName: {
      type: String,
      default: ''
    },
    reportTitle: {
      type: String,
      default: ''
    },
    multiHeaderExcel: {
      type: Array,
      default: () => []
    },
    mergeCellExcel: {
      type: Array,
      default: () => []
    },
    cellStyleExcel: {
      type: Array,
      default: () => []
    },
    columnStyleExcel: {
      type: Array,
      default: () => []
    },
    rowStyleExcel: {
      type: Array,
      default: () => []
    },
    headerExcelTc: {
      type: Boolean,
      default: false
    },
    headerExcelBc: {
      type: Boolean,
      default: false
    },
    joinNameExcel: {
      type: Array,
      default: () => []
    },
    remoteMethod: Function,
    dateFrom: {
      type: Date,
      default() {
        return new Date()
      }
    },
    dateTo: {
      type: Date,
      default() {
        return new Date()
      }
    },
    pagingParent: Function,
    pageSizePdf: {
      type: String,
      default: 'A4'
    } /* Size khổ giấy pdf*/,
    arrsColIgnoreExport: Array /* list tên cột không export*/
    /* Export*/
  },
  data() {
    return {
      loadExcel: false,
      loadPdf: false,
      loadPrint: false,
      checkAll: false,
      isIndeterminate: true,
      minChecked: 1,
      defaultCols: [],
      listDataExport: [],
      lstMultiHeaderExcel: [],
      lstMergeCellExcel: [],
      lstCellStyleExcel: [],
      page: PAGINATION_PARAM.page,
      size: PAGINATION_PARAM.size
    }
  },

  computed: {
    /* Column select to Show/Hide*/
    renderTableColumns() {
      return this.columns.filter(column => column.show)
    },

    checkedTableColumns: {
      get() {
        return this.renderTableColumns.map(column => column.prop)
      },
      set(checked) {
        this.columns.forEach(column => {
          column.show = checked.includes(column.prop)
        })
      }
    },
    /* Column select to Show/Hide*/

    listLabel() {
      const listLabel = []
      this.renderTableColumns.forEach(column => {
        listLabel.push(column.label)
      })
      return listLabel
    },

    listProp() {
      const listProp = []
      this.renderTableColumns.forEach(column => {
        listProp.push(column.prop)
      })
      return listProp
    },
    syncData: {
      get() {
        return this.listDataTable
      },
      set(newData) {
        this.$emit('update:listDataTable', newData)
      }
    },

    syncLoadData: {
      get() {
        return this.loading
      },
      set(val) {
        this.$emit('update:loading', val)
      }
    },

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
    total() {
      if (this.syncTotal === 0) {
        this.size = PAGINATION_PARAM.size
      }
    }
  },

  mounted() {
    this.defaultCols = this.renderTableColumns.map(e => ({
      ...e,
      isDefault: true
    }))
  },
  methods: {
    /* Reset page to 0 when trigger onSearch()*/
    resetPage() {
      this.page = PAGINATION_PARAM.page
    },

    pagination() {
      this.syncLoadData = true
      const paramPaging = {
        ...this.paramsFetch,
        page: this.page,
        size: this.size
      }
      console.log(paramPaging)
      apiFactory
        .callAPI(this.apiFetch, {}, paramPaging)
        .then(({ result, totalElements }) => {
          this.syncLoadData = false
          // Check is parent
          if (this.pagingParent !== undefined && this.pagingParent !== null) {
            // this.syncData = this.$parent.$parent.getParentRowAndGroup(result)
            this.syncData = this.pagingParent(result)
          } else {
            this.syncData = result
          }

          this.syncTotal = totalElements
        })
        .catch(err => {
          this.syncLoadData = false
          errAlert(this, err)
        })
    },
    async exportExcel() {
      if (this.isExportTemplate === true) {
        this.checkIsValidApi(
          this.constantApiExcel,
          'EXCEL [constant-api-excel]'
        )
        this.loadExcel = true
        await apiFactory
          .download(
            this.constantApiExcel,
            this.fileName,
            this.constantApiExcel.params,
            this
          )
          .then(() => {
            this.loadExcel = false
          })
          .catch(err => {
            this.loadExcel = false
            errAlert(this, err)
          })
      } else {
        this.loadExcel = true
        this.formatJson(this.listProp)
      }
    },

    formatJson(filterVal) {
      // console.log(245)
      const param = deepClone(this.paramsFetch)
      let params = {
        ...param,
        page: 0,
        size: 5000
      }
      params = this.formatMaHQ(params)
      apiFactory
        .callAPI(this.apiFetch, {}, params)
        .then(rs => {
          this.listDataExport = rs.result || rs || []

          // Export Column STT
          let len
          let i = 0
          let valSTT = ''
          if (this.showStt || this.isDmHh) {
            len = this.listDataExport.length
            if (filterVal[0] !== 'stt') {
              filterVal.splice(0, 0, 'stt')

              // this.listLabel.splice(0, 0, 'STT')
            }
            if (this.isDmHh) {
              this.renderTableColumns.shift()
            }
            this.renderTableColumns.splice(0, 0, {
              prop: 'stt',
              label: 'STT',
              width: '70',
              align: 'center',
              showOverflowTooltip: true,
              showTooltipWhenOverflow: true,
              show: true
            })
            console.log(this.renderTableColumns)
            while (i < len) {
              valSTT = ''.concat((i + 1))
              this.listDataExport[i]['stt'] = valSTT
              i++
            }
          }

          // Don Vi XNK
          this.listDataExport = this.formatDVXNK(this.listDataExport)

          // Join name by code column excel
          if (this.joinNameExcel.length > 0) {
            len = this.listDataExport.length
            const lstJoinName = this.joinNameExcel
            const lenJn = lstJoinName.length
            const listDataExport = this.listDataExport

            let value = ''
            while (len--) {
              i = 0
              while (i < lenJn) {
                value = listDataExport[len][lstJoinName[i].col]
                if (value) {
                  listDataExport[len][lstJoinName[i].col] = ''.concat(value, ' - ', getNameByIdOnGrid(value, lstJoinName[i].code, lstJoinName[i].name, lstJoinName[i].lstData))
                }
                i++
              }
            }
          }

          this.executeDataInList(this.listDataExport, this.renderTableColumns)
          const execute = this.getExecute(filterVal)

          this.lstMultiHeaderExcel = this.multiHeaderExcel
          this.lstMergeCellExcel = this.mergeCellExcel
          this.lstCellStyleExcel = this.cellStyleExcel
          if (this.headerExcelTc) {
            const objThis = {}
            objThis.title = this.reportTitle
            objThis.$store = this.$store
            this.lstMultiHeaderExcel = multiHeaderExcelTraCuu(objThis)
            this.lstMergeCellExcel = mergeCellExcelTraCuu()
            this.lstCellStyleExcel = formatCellStyleExcelTraCuu(execute[0].length)
          }
          // headerExcelBc

          export_json_to_excel({
            multiHeader: this.lstMultiHeaderExcel,
            merges: this.lstMergeCellExcel,
            header: this.listLabel,
            formatcell: this.lstCellStyleExcel,
            formatcolumn: this.columnStyleExcel,
            formatrow: this.rowStyleExcel,
            data: execute,
            // Lấy tên file là tên chức năng hiện tại
            filename: this.$route.meta.title,
            autoWidth: true,
            bookType: 'xlsx'
          })
          // Delete Column STT
          if (this.showStt && this.renderTableColumns[0].prop === 'stt') {
            this.renderTableColumns.shift()
          }
          this.loadExcel = false
        })
        .catch(err => {
          this.loadExcel = false
          errAlert(this, err)
        })
    },

    formatDVXNK(lstData) {
      const objData = lstData.length > 0 ? lstData[0] : {}
      let isDvxnk = false
      let len = lstData.length
      for (const key in objData) {
        if (key === 'ma_dvxnk') {
          isDvxnk = true
          break
        }
      }
      if (isDvxnk) {
        while (len--) {
          lstData[len]['ma_dvxnk'] = ''.concat(lstData[len]['ma_dvxnk'], ' - ', lstData[len]['ten_dvxnk'])
        }
      }
      return lstData
    },

    formatMaHQ(params) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(params['maHqTiepNhan']) === -1 && params['maHqTiepNhan'].indexOf('_') > -1) {
        params['maHqTiepNhan'] = ''
      }
      if (arrDK.indexOf(params['maHqYeuCau']) === -1 && params['maHqYeuCau'].indexOf('_') > -1) {
        params['maHqYeuCau'] = ''
      }
      return params
    },
    getExecute(filterVal) {
      this.listDataExport = this.listDataExport.map(v =>
        filterVal.map((j, k) => {
          if (
            typeof new Date(v[j]).getMonth === 'function' &&
                (j.includes('ngay') || j.includes('date'))
          ) {
            if (
              this.renderTableColumns[k].formatter(
                v,
                '_',
                new Date(v[j])
              ) === 'Invalid date'
            ) {
              return v[j].toString()
            }
            return this.renderTableColumns[k].formatter(
              v,
              '_',
              new Date(v[j])
            )
          } else {
            return v[j].toString()
          }
        })
      )

      return this.listDataExport
    },

    async onGetDataPrint() {
      this.loadPrint = true
      this.checkIsValidApi(this.constantApiPdf, 'PDF [constant-api-pdf]')
      const { result } = await apiFactory.callAPI(
        this.constantApiPdf,
        {},
        this.constantApiPdf.params
      )
      this.executeDataInList(result, this.renderTableColumns)
      this.loadPrint = false
      return result
    },

    executeDataInList(listData, listColumns) {
      listData.forEach((item, i) => {
        item.index = i + 1
        listColumns.forEach(col => {
          item[col['prop']] = checkDate(item[col['prop']])
            ? formatFullDate_VN(item[col['prop']])
            : replaceEscapeChar(item[col['prop']])
        })
      })
    },

    onExportPDF() {
      this.checkIsValidApi(this.constantApiPdf, 'PDF [constant-api-pdf]')
      this.loadPdf = true
      pdfMaker.vfs = pdfFonts.pdfMake.vfs
      if (this.arrsColIgnoreExport && this.arrsColIgnoreExport.length > 0) {
        this.listLabel = this.listLabel.filter(item => {
          return !this.arrsColIgnoreExport.includes(item)
        })
      }
      this.listProp = this.listProp.filter(item => {
        return item !== undefined
      })
      apiFactory
        .callAPI(this.constantApiPdf, {}, this.constantApiPdf.params)
        .then(rs => {
          const lstDataFull = rs['result']
          lstDataFull.forEach((item, i) => {
            item.index = i + 1
          })
          const docDefinition = {
            footer(currentPage, pageCount) {
              return 'Trang ' + currentPage.toString() + '/' + pageCount
            },
            pageSize: this.pageSizePdf,
            pageOrientation: 'landscape',
            pageMargins: [40, 60, 40, 60],
            content: [
              {
                text: this.reportTitle,
                fontSize: 15,
                alignment: 'center',
                bold: true
              },
              {
                text: 'Từ ngày: ' + formatDate(this.dateFrom),
                alignment: 'center'
              },
              {
                text: 'Đến ngày: ' + formatDate(this.dateTo),
                alignment: 'center'
              },
              {
                width: 'auto',
                table: {
                  headerRows: 1,
                  widths: 'auto',
                  body: []
                }
              }
            ]
          }
          const label = []
          this.listLabel.forEach(item => {
            label.push({
              text: item,
              alignment: 'center',
              bold: true,
              fillColor: '#dedede'
            })
          })
          docDefinition.content[3].table.body.push(label)

          let contentArrays
          for (let i = 0; i < lstDataFull.length; i++) {
            contentArrays = []
            this.listProp.forEach(item => {
              if (item.toLowerCase().includes('text')) {
                contentArrays.push({ text: lstDataFull[i][item] })
              } else {
                contentArrays.push({
                  text: checkDate(lstDataFull[i][item])
                    ? formatFullDateTime_VN(lstDataFull[i][item])
                    : lstDataFull[i][item]
                })
              }
            })
            docDefinition.content[3].table.body.push(contentArrays)
          }
          const fileName = this.fileName.substring(
            0,
            this.fileName.lastIndexOf('.')
          )
          pdfMaker
            .createPdf(docDefinition)
            .download(
              `${fileName}_${moment(new Date()).format('dd_MM_yyyy')}.pdf`
            )
          this.loadPdf = false
        })
        .catch(err => {
          this.loadPdf = false
          errAlert(this, err)
        })
    },

    checkIsValidApi(constantApi, type) {
      if (!constantApi.url) {
        this.throwMsg('url ' + type)
      }
      if (!constantApi.method) {
        this.throwMsg('method ' + type)
      }
      if (!constantApi.params) {
        this.throwMsg('params ' + type)
      }
    },

    throwMsg(type) {
      // eslint-disable-next-line no-throw-literal
      throw new Error(`Chưa truyền ConstantAPI.${type}`)
    },

    handleCheckedAll(isAll) {
      if (isAll) {
        this.columns.map(column => {
          column.show = true
        })
      } else {
        this.columns.forEach(column => {
          column.show =
            this.defaultCols.filter(e => e.prop === column.prop).length > 0
        })
      }
      this.isIndeterminate = false
    },

    handleCheckedColumnsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.columns.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.columns.length
    },

    select(selection, row) {
      this.$emit('select', selection, row)
    },
    selectAll(val) {
      this.$emit('select-all', val)
    },
    selectionChange(val) {
      this.$emit('selection-change', val)
    },
    cellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    cellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    rowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    rowContextmenu(row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    rowDbclick(row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    headerClick(column, event) {
      this.$emit('header-click', column, event)
    },
    headerContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    sortChange({ column, prop, order }) {
      this.$emit('sort-change', { column, prop, order })
    },
    filterChange(filters) {
      this.$emit('filter-change', filters)
    },
    currentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    headerDragend(newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event)
    },
    expandChange(row, isExpanded) {
      this.$emit('expand-change', row, isExpanded)
    }
  }
}
moment.suppressDeprecationWarnings = true
</script>

<style scoped>
#formUtil >>> .el-card__body {
  padding: 2px !important;
}

.utilStyle {
  margin-top: 5px;
}

.checkedColumns {
  min-height: 250px;
  max-height: 300px;
  max-width: 500px;
  overflow: auto;
  margin: -8px;
  padding: 8px;
}
</style>
