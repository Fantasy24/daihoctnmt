import apiFactory from '@/api/apiFactory'
import {
  errAlert,
  ERROR,
  showAlert,
  showConfirmDelete,
  SUCCESS,
  WARNING
} from 'ff24-js/src/utils/AlertMessage'

import ConstantAPI from '@/utils/ConstantAPI'
import KeySearchListObj from 'ff24-js/src/utils/KeySearchListObj'
import TrangThaiRecord from '@/components/BaseFormCustoms/TrangThaiRecord'
import { deepClone } from 'ff24-js/src/utils'
import checkPermissionShowButton from 'ff24-js/src/utils/ECustomsUtils'
import { FORM_MODE } from '@/utils/Constant'
// import SelectHinhThucKiemTra from '../../../../components/CommonComponent/SelectHinhThucKiemTra'

const MENU_CODE_API = 'QLND'

export default {
  components: {
    TrangThaiRecord
    // SelectHinhThucKiemTra
  },
  data() {
    return {
      ConstantAPI,
      titleDialog: '',
      isShowDlgAddEdit: false,
      iconEditLoading: false,
      iconViewLoading: false,
      buttonUpdateLoading: false,
      buttonSaveLoading: false,
      iconDelLoading: false,
      flagShowDialog: FORM_MODE.DEFAULT,
      paramHis: {},
      multiHeaderExcel: [
        ['CƠ QUAN CHỦ QUẢN', '', '', ''],
        ['CƠ QUAN CHẤP HÀNH', '', '', ''],
        ['HỒ SƠ PHÂN TÍCH PHÂN LOẠI', '', '', ''],
        ['NGÀY TRA CỨU: 17/11/2021', '', '', '']
      ],
      mergeCellExcel: [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 }},
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 }},
        { s: { r: 2, c: 0 }, e: { r: 2, c: 0 }, t: 1 },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 }}
      ],
      // mergeCellExcel: [
      //   [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 }}],
      //   [{ s: { r: 1, c: 0 }, e: { r: 1, c: 5 }}],
      //   [{ s: { r: 2, c: 0 }, e: { r: 2, c: 10 }}],
      //   [{ s: { r: 3, c: 0 }, e: { r: 3, c: 3 }}]
      // ],
      statusSelect: [
        { key: 1, value: this.$t('baseLabel.labelActive') },
        { key: 0, value: this.$t('baseLabel.labelDeActive') }
      ],
      formSearch: new KeySearchListObj(),
      formAddEdit: {
        ma: '',
        ten: '',
        mo_ta: '',
        truong_hop_ap_dung: '',
        status: null,
        hinh_thuc_kiem_tra: 0
      },

      rules: {
        ma: [
          { required: true, message: 'Mã kiểm định bắt buộc nhập' },
          {
            pattern: '^[a-zA-Z0-9]+$',
            message: 'Không được viết dấu hoặc chứa ký tự đặc biệt'
          }
        ],
        ten: [{ required: true, message: 'Tên kiểm định bắt buộc nhập' }],
        status: [
          {
            required: true,
            message: 'Trạng thái bắt buộc chọn',
            trigger: 'change'
          }
        ]
        // fromToDate: SEARCH_RULES.fromToDate
      },
      disableWhenEdit: false,
      isHiddenInput: false,
      total: 0,
      totalHis: 0,
      objHis: {},
      listDataTable: [],
      listDataTable2: [],
      loadDataTable: false,
      lstStatus: [
        { key: 1, label: 'Miễn kiểm tra' },
        { key: 2, label: 'Kiểm tra tỷ lệ' },
        { key: 3, label: 'Kiểm tra toàn bộ' }
      ],
      columns: [
        {
          prop: 'stt',
          label: 'STT',
          width: '70',
          align: 'left',
          showOverflowTooltip: true,
          showTooltipWhenOverflow: true,
          show: true
        },
        {
          prop: 'ma',
          label: 'Mã kiểm định',
          width: '130',
          show: true
        },
        {
          prop: 'ten',
          label: 'Tên kiểm định',
          width: '150',
          show: true
        },
        {
          prop: 'mo_ta',
          label: 'Mô tả',
          width: '150',
          show: true
        },
        {
          prop: 'truong_hop_ap_dung',
          label: 'Trường hợp áp dụng',
          width: '100',
          show: true
        },
        {
          prop: 'status',
          label: 'Trạng thái',
          width: '100',
          formatter: TrangThaiRecord,
          show: true
        },
        {
          prop: 'created_user',
          label: 'create user',
          width: '100',
          show: true
        },
        {
          prop: 'created_date',
          label: 'create date',
          width: '100',
          show: true
        }
      ],
      columns2: [
        {
          prop: 'chk',
          label: 'STT',
          width: '50',
          align: 'left',
          showOverflowTooltip: true,
          showTooltipWhenOverflow: true,
          type: 'selection',
          show: true
        },
        {
          prop: 'stt',
          label: 'STT',
          width: '170',
          align: 'left',
          showOverflowTooltip: true,
          showTooltipWhenOverflow: true,
          show: true
        },
        {
          prop: 'ma',
          label: 'Mã kiểm định',
          width: '130',
          show: true
        },
        {
          prop: 'ten',
          label: 'Tên kiểm định',
          width: '150',
          show: true
        }
      ],
      MENU_CODE_API,
      FORM_MODE
    }
  },
  computed: {},
  mounted() {
    this.formSearch.fromToDate = [new Date(), new Date()]
  },

  methods: {
    checkPermissionShowButton(idButton) {
      return checkPermissionShowButton(MENU_CODE_API, idButton)
    },
    clickSelectInGrid(row) {
      // console.log(row)
    },
    selectDropdownInGrid(value) {
      // console.log(value)
    },
    selectRow(listRowChecked) {
      // console.log(listRowChecked)
    },
    onSearch(mode) {
      this.$refs.formSearch.validate(valid => {
        if (!valid) return false
        this.$refs.tblMain.resetPage()
        // this.formSearch.page = 0
        this.formSearch.page = mode === '' ? 0 : this.formSearch.page
        this.formSearch.size = this.$refs.tblMain.size
        this.loadDataTable = true
        const fromToDate = this.formSearch.fromToDate
        this.formSearch.dateFrom = fromToDate[0]
        this.formSearch.dateTo = fromToDate[1]

        // Custom properties KeySearchObj API
        this.formSearch.ma = this.formSearch.code
        this.formSearch.ten = this.formSearch.name
        apiFactory
          .callAPI(ConstantAPI[MENU_CODE_API].SEARCH, {}, this.formSearch)
          .then(rs => {
            this.loadDataTable = false
            // this.listDataTable = rs.result
            this.listDataTable2 = rs.result
            this.listDataTable = this.getParentRowAndGroup(rs.result)
            // this.listDataTable[0].children = this.getChildren(1)
            console.log(JSON.stringify(rs.result))
            this.total = rs['totalElements']
          })
          .catch(err => {
            this.loadDataTable = false
            this.listDataTable = []
            errAlert(this, err)
          })
      })
    },
    getChildren(id) {
      return [
        {
          stt: '1',
          status: 1,
          created_date: '2021-08-04T09:29:51.000+00:00',
          created_user: 'test_kiemdinh',
          updated_date: null,
          updated_user: null,
          id: 9,
          ma: 'KD05',
          ten: 'Kiểm định 05',
          mo_ta: 'Loại kiểm định 05',
          truong_hop_ap_dung: 'Áp dụng khi kiểm định theo thông tư 05'
        },
        {
          stt: '2',
          status: 1,
          created_date: '2021-08-05T03:27:39.000+00:00',
          created_user: 'test_kiemdinh',
          updated_date: null,
          updated_user: null,
          id: 21,
          ma: 'KD06',
          ten: 'Kiểm định 06',
          mo_ta: 'Loại kiểm định 05',
          truong_hop_ap_dung: 'Áp dụng khi kiểm định theo thông tư 05'
        }
      ]
    },
    getParentRowAndGroup(data) {
      // CHU Y: DIEU KIEN BAT BUOC LA HAM NAY PHAI TRA RA LIST DATA DA DUOC GROUP ROW CHILDREN THEO PARENT
      // Co the call API de lay thong tin
      const arrDK = [undefined, null, '']
      const lstParentRow = [
        {
          stt: 'Phần 1: Động vật sống và các sản phầm từ động vật'
        },
        {
          stt: 'Phần 2: Thực phẩm đông lạnh'
        },
        {
          stt: 'Phần 3: Hàng tiêu dùng, đồ gia dụng'
        }
      ]

      if (arrDK.indexOf(data) > -1) {
        return null
      } else {
        let i = 0
        let j = 0
        let len = 0
        let lenChild = 0
        // Co the lay parent row phan loai tu list data hoac call api xuong db lay thong tin phan loai
        lenChild = data.length
        // lay thong phan loai parent row
        len = lstParentRow.length
        while (i < len) {
          lstParentRow[i].children = []
          i++
        }
        // Lay thong tin row children
        while (j < lenChild) {
          if (j < 6) {
            data[j].stt = lstParentRow[0].children.length + 1
            lstParentRow[0].children.push(data[j])
          } else if (j < 11) {
            data[j].stt = lstParentRow[1].children.length + 1
            lstParentRow[1].children.push(data[j])
          } else {
            data[j].stt = lstParentRow[2].children.length + 1
            lstParentRow[2].children.push(data[j])
          }
          j++
        }

        return lstParentRow
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.children !== undefined && row.children !== null) {
        return [1, 50]
      }
    },
    arraySpanMethod_BACKUP({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 6]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    cellClick() {
      alert(1)
    },
    rowClicked(row) {
      // console.log('Row' + JSON.stringify(row))
      this.$refs.tblMain.toggleRowExpansion(row)
    },
    onInsert(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.buttonSaveLoading = true
        apiFactory
          .callAPI(ConstantAPI[MENU_CODE_API].INSERT, this.formAddEdit)
          .then(() => {
            showAlert(this, SUCCESS, 'Thêm thành công!')
            this.buttonSaveLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
          })
          .catch(err => {
            errAlert(this, err)
            this.buttonSaveLoading = false
            this.isShowDlgAddEdit = false
          })
      })
    },

    onUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        this.buttonUpdateLoading = true

        apiFactory
          .callAPI(ConstantAPI[MENU_CODE_API].UPDATE, this.formAddEdit)
          .then(() => {
            showAlert(this, SUCCESS, 'Cập nhật thành công!')
            this.buttonUpdateLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.message)
            this.buttonUpdateLoading = false
            this.isShowDlgAddEdit = false
          })
      })
    },

    onDelete(code) {
      showConfirmDelete(
        this.$confirm,
        () => {
          const param = {
            id: code
          }
          this.iconDelLoading = true
          apiFactory
            .callAPI(ConstantAPI[MENU_CODE_API].DELETE, {}, param)
            .then(() => {
              showAlert(this, SUCCESS, 'Xóa thành công!')
              this.iconDelLoading = false
              this.onSearch('')
            })
            .catch(err => {
              this.iconDelLoading = false
              showAlert(this, ERROR, 'Lỗi! ' + err.message)
            })
        },
        this.TITLE_MESSAGE_BOX,
        this.CANCEL_BUTTON_BOX,
        this.CONFIRM_BUTTON_BOX
      )
    },
    resetForm(formName) {
      this.resetFrm(formName)
      this.listDataTable = []
      this.total = 0
      this.formSearch.orgCode = this.$store.getters.org
      this.formSearch.fromToDate = [new Date(), new Date()]
    },

    resetFrm(formName) {
      this.$refs[formName].resetFields()
    },

    changeValue() {
      this.$nextTick(() => {
        this.$refs.btnSearch.$el.focus()
      })
    },
    onPreInsert() {
      this.isHiddenInput = false
      this.titleDialog = 'Thêm mới Loại kiểm định'
      this.flagShowDialog = FORM_MODE.CREATE
      this.isShowDlgAddEdit = true
      this.disableWhenEdit = false
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }
      this.formAddEdit.ma = ''
      this.formAddEdit.ten = ''
      this.formAddEdit.mo_ta = ''
      this.formAddEdit.truong_hop_ap_dung = ''
    },

    onPrepareEdit(rowData) {
      this.isHiddenInput = false
      this.disableWhenEdit = true
      this.titleDlg = 'Cập nhật Loại kiểm định'
      this.flagShowDialog = FORM_MODE.EDIT
      this.iconEditLoading = true
      const param = {
        ma: rowData.ma
      }
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, param)
        .then(rs => {
          if (rs.result !== undefined && rs.result != null) {
            this.formAddEdit = rs.result[0]
          }

          this.iconEditLoading = false
          this.isShowDlgAddEdit = true
        })
        .catch(() => {
          this.iconEditLoading = false
          showAlert(this, WARNING, 'Bản ghi không tồn tại trên hệ thống')
        })
    },

    onView(rowData) {
      this.isHiddenInput = true
      this.flagShowDialog = FORM_MODE.VIEW
      this.titleDlg = 'Chi tiết Loại kiểm định'
      const param = {
        ma: rowData.ma
      }
      this.iconViewLoading = true
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, param)
        .then(rs => {
          if (rs.result !== undefined && rs.result != null) {
            this.formAddEdit = rs.result[0]
          }
          this.iconViewLoading = false
          this.isShowDlgAddEdit = true
        })
    },
    change(val) {
      this.$emit('change', val)
    },
    getStatusSelected(choose) {
      this.statusSelect.forEach(status => {
        if (Number(choose) === status.key) {
          choose = status.value
        }
      })
      return choose
    },

    onViewHistory(row) {
      this.isShowHisDlg = true
      this.objHis = deepClone(row)
      this.titleDialog = 'Thông tin lịch sử lấy thông tin'
      this.getListHistory()
    },

    getListHistory() {
      this.$refs.tblHis.resetPage()
      this.paramHis = {
        containerNo: this.objHis.soContainer,
        dateShipArrivalAndDeparture: new Date(this.objHis.ngayTauDenKhoiHanh),
        imoNo: this.objHis.soImo,
        orgCode: this.formSearch.orgCode,
        portCode: this.objHis.maKbc,
        shipCallNo: this.objHis.soHoHieu,
        shipNo: this.objHis.soHieuPtvt,
        tripNo: this.objHis.soChuyen,
        page: this.pageHis,
        size: this.sizeHis
      }
      this.loadDataHis = true
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SEARCH_HISTORY, {}, this.paramHis)
        .then(rs => {
          this.loadDataHis = false
          this.listDataHistory = rs.result
          this.totalHis = rs['totalElements']
        })
        .catch(err => {
          this.loadDataHis = false
          errAlert(this, err)
        })
    }
  }
}
