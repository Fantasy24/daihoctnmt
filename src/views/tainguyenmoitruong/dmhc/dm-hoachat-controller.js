import apiFactory from '../../../api/apiFactory'
import {
  errAlert,
  ERROR,
  showAlert,
  showConfirmDelete,
  SUCCESS,
  WARNING
} from 'ff24-js/src/utils/AlertMessage'

import ConstantAPI from '../../../utils/ConstantAPI'
import TrangThaiRecord from '../../../components/BaseFormCustoms/TrangThaiRecord'
// import SelectTrangThaiPhieuYeuCau from '../../../components/CommonComponent/SelectTrangThaiPhieuYeuCau'
// import SelectLoaiHinhXnk from '../../../components/CommonComponent/SelectLoaiHinhXnk'
// import SelectCanBoHq from '../../../components/CommonComponent/SelectCanBoHq'
// import SelectHinhThucKiemTra from '../../../components/CommonComponent/SelectHinhThucKiemTra'
// import SelectTrangThaiPhieuPtpl from '../../../components/CommonComponent/SelectTrangThaiPhieuPtpl'
import SelectYesNo from '../../../components/CommonComponent/SelectYesNo'
import SelectMasterData from '../../../components/CommonComponent/SelectMasterData'
import SelectTrangThai from "../../../components/CommonComponent/SelectTrangThai";
// import SelectChuyenVienPhanTichPhanLoai from '../../../components/CommonComponent/SelectChuyenVienPhanTichPhanLoai'
// import SelectLoaiPheDuyet from '../../../components/CommonComponent/SelectLoaiPheDuyet'
// import TrangThaiPhieuYeuCauPtpl from '../../../components/CommonComponent/TrangThaiPhieuYeuCauPtpl'
// import DanhSachTemplate from '../../../components/CommonComponent/DanhSachTemplate'
// import SelectListMaHq from 'ff24-customs-lib/src/lib-components/BaseFormCustoms/SelectListMaHq.vue'
import checkPermissionShowButton from 'ff24-js/src/utils/ECustomsUtils'
import DateRangePicker from 'ff24-customs-lib/src/components/DateRangePicker'

import {
  validateFileExtension,
  maxFileSize,
  checkIsValidFileSize,
  getNameByIdOnGrid,
  showConfirmCustom,
  getCurrentDateNoTime,
  LIST_CUSTOMS
} from '../../../utils/ECustomsUtils'
import { formatFullDate_VN } from '../../../filters/index'
import { FORM_MODE } from '../../../utils/Constant'
// import XLSX from 'xlsx'
import _ from 'lodash'

const MENU_CODE_API = 'DMHC'


const LOAI_NGUOI_KHAI_UQ = 'NDUY'
const MASTER_DATA_DVT = 'DVT'
const GUI_PHIEU_YC = 2
const PHIEU_YC_PRINT_FILE_NAME = 'PhieuYeuCauPtpl.pdf'
const ACTION_MODE = { DEFAULT: 0, INSERT: 1, UPDATE: 2, SEND: 3 }
const TAI_LIEU_KHAC = 99
const PHE_DUYET_THU_CONG = 3
const STATUS_BTN_SEND = [1, 3]
const STATUS_ROW_UPDATE = [1, 3]
const STATUS_ROW_DELETE = [1]
const LIMIT_UPLOAD_FILE = 15

export default {
  components: {
    //TrangThaiRecord,
    DateRangePicker,
    SelectMasterData,
    SelectTrangThai
    // SelectTrangThaiPhieuYeuCau,
    // SelectLoaiHinhXnk,
    // SelectHinhThucKiemTra,
    // SelectTrangThaiPhieuPtpl,
    //SelectYesNo,
    // SelectChuyenVienPhanTichPhanLoai,
    // SelectLoaiPheDuyet,
    // TrangThaiPhieuYeuCauPtpl,
    //DanhSachTemplate,
    // SelectCanBoHq
  },
  props: {
    isGetAllHq: {
      type: Boolean,
      default: true
    },
    isShowOptionAllHqSearch: {
      type: Boolean,
      default: true
    },
    isShowOptionAllHqEdit: {
      type: Boolean,
      default: false
    },
    labelHqPt: {
      type: String,
      default: 'Đơn vị tiếp nhận phân tích'
    },
    labelHqYcPt: {
      type: String,
      default: 'Đơn vị yêu cầu phân tích'
    },
    labelOptionAllHq: {
      type: String,
      default: 'Tất cả'
    },
    radioYes: {
      type: String,
      default: '1'
    },
    radioNo: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      ConstantAPI,
      quocTichLblWidth: '150px',
      dvtLblWidth: '150px',
      titleDialog: '',
      titleDialogPrint: '',
      loading: false,
      isPrint: false,
      showPrint: false,
      buttonPrintPdfLoading: false,
      pdfSource: '',
      isShowDlgAddEdit: false,
      isShowBtnSend: false,
      isTemplate: false,
      iconEditLoading: false,
      iconViewLoading: false,
      buttonUpdateLoading: false,
      buttonSendLoading: false,
      buttonSaveLoading: false,
      buttonAction: ACTION_MODE.DEFAULT,
      iconDelLoading: false,
      buttonPrintLoading: false,
      iconShowKBBKLoading: false,
      flagShowDialog: FORM_MODE.DEFAULT,
      showDlgTemplate: false,
      showDlgHistory: false,
      buttonTemplateLoading: false,
      disableAppCodeModeEdit: false,
      masterType: MASTER_DATA_DVT,
      windowHeight: screen.height,
      paramHis: {},
      // Trang thai tiep nhan YCPTPL
      statusReceiveSelect: [
        { key: 1, value: 'Mới' },
        { key: 2, value: 'Chờ tiếp nhận' },
        { key: 3, value: 'Yêu cầu bổ sung hồ sơ' },
        { key: 4, value: 'Từ chối tiếp nhận yêu cầu' },
        { key: 5, value: 'Tiếp nhận yêu cầu PTPL' },
        { key: 8, value: 'Từ chối phê duyệt hồ sơ' },
        { key: 9, value: 'Đã phê duyệt hồ sơ' }
      ],
      statusExport: [
        { key: 1, value: 'Mới' },
        { key: 2, value: 'Chờ tiếp nhận' },
        { key: 3, value: 'Yêu cầu bổ sung hồ sơ' },
        { key: 4, value: 'Từ chối tiếp nhận HS' },
        { key: 5, value: 'Chờ phê duyệt' },
        { key: 8, value: 'Từ chối phê duyệt HS' },
        { key: 9, value: 'Đã phê duyệt HS' }
      ],
      taiLieuKhac: {
        id: 0,
        ma: 'TL04',
        ten: 'Giấy tờ khác có liên quan',
        status: 1
      },
      lstTaiLieuKemTheo: [],
      radioValue: null,
      lenTLKTHS: 0,
      currentTLKTHS: {},
      currentIndex: -1,
      lstDVT: [],
      lstNguoiKhaiLayLaiMau: [],
      lstLoaiPheDuyet: [],
      excelData: [],
      statusSelect: [
        { key: 1, value: this.$t('baseLabel.labelActive') },
        { key: 0, value: this.$t('baseLabel.labelDeActive') }
      ],
      tabIndex: '',
      // formSearch: new KeySearchListObj(),
      formSearch: {
        fromToDate: [],
        soPhieuYeuCau: '',
        code: '',
        name: '',
        resourceType: '',
        unit: '',
        quantity: '',
        origin: '',
        storageLocation: '',
        status: null,
        maTrangThai: null,
        page: null,
        size: null
      },
      ngay_thong_bao_ket_qua_pt: null,
      ngay_dk_to_khai: null,
      ngay_tiep_nhan_ptpl: null,
      fileListUpload: [],
      fileListDelete: [],
      lstAttachment: [],
      lstAttachmentGroup: [],
      fileListKBBK: [],
      isNguoiKhaiYcLayMau: false,
      isDownload: true,
      lstCauHoi: [],
      lstLyDoKhongDinhKem: [],
      formAddEdit: {
        id: 0,
        resourceId: 0,
        resourceCode: '',
        resourceName: '',        
        createdAt: null,
        resourceType: '',
        so_to_kunithai: '',
        quantity: 0,
        unit: '',
        origin: '',
        storageLocation: '',
        image: '',
        description: '',
        createdBy: '',
        ngay_chung_nhan_xuat_xu: null,
        dia_diem_lay_mau: '',
        ngay_lay_mau: null,
        cong_chuc_hq_lay_mau1: '',
        cong_chuc_hq_lay_mau2: '',
        dai_dien_nguoi_khai_hq: '',
        so_luong_mau: '',
        dac_diem_quy_cach_dong_goi: '',
        hinh_thuc_kiem_tra: '',
        mau_duoc_niem_phong_hq_so: '',
        nguoi_khai_yeu_cau_lay_lai_mau: null,
        nguoi_uy_quyen_nhan_lai_mau: '',
        ngay_gui_yeu_cau: '',
        ngay_thuc_hien_ptpl: '',
        so_phieu_tiep_nhan_ptpl: '',
        so_luong_mau_tiep_nhan_ptpl: '',
        luu_y_ptpl: '',
        ly_do_ptpl: '',
        nguoi_giao_ptpl: '',
        nguoi_tiep_nhan_ptpl: '',
        giay_to_khac: '',
        fileDinhKem: '',
        lstFileDelete: '',
        is_change_detail: false,
        status: null,
        ma_trang_thai: null,
        // thông tin tiếp nhận
        status_pyc: null,
        luu_yptpl: '',
        // thông tin phê duyệt
        loai_phe_duyet: null,
        so_phan_cong: '',
        ngay_phan_cong: null,
        noi_dung: '',
        user_phan_cong: '',
        user_phan_tich: '',
        user_phan_loai: '',
        ten_user_phan_cong: '',
        ten_user_phan_tich: '',
        ten_user_phan_loai: '',
        loai_dieu_chinh: null,
        so_dieu_chinh: '',
        version: null,
        is_latest: null
      },
      pickerOptions: {
        onPick: obj => {
          this.pickerMinDate = new Date(obj.minDate).getTime()
        },
        disabledDate: time => {
          if (this.pickerMinDate) {
            const day1 = 30 * 24 * 3600 * 1000
            const maxTime = this.pickerMinDate + day1
            const minTime = this.pickerMinDate - day1
            return time.getTime() > maxTime || time.getTime() < minTime
          }
        }
      },      
      ruleDVT: [this.requiredRule('Đơn vị tính')],
      rules: {
        resourceCode: [
          this.requiredRule('Mã hóa chất'),
          this.specialCharRule('Mã hóa chất')
        ],
        createdAt: [this.requiredRule('Ngày tạo')],
        resourceName: [this.requiredRule('Tên hóa chất')],        
        resourceType: [this.requiredRule('Loại hóa chất')],
        origin: [this.requiredRule('Xuất xứ')],
        storageLocation: [this.requiredRule('Khu lưu trữ')],
        quantity: [this.requiredRule('Số lượng'),this.validateRegex('^[0-9\.]*$',"Số lượng")],
      },
      disableWhenEdit: false,
      isHiddenInput: false,
      isHidenGuiHoSo: false,
      total: 0,
      totalKBBK: 0,
      totalHis: 0,
      objHis: {},
      listDataTable: [],
      loadDataTable: false,
      joinNameByCodeColumnExcel: [],
      columns: [
        {
          prop: 'resourceCode',
          label: 'Mã hóa chất',
          width: '150',
          align: 'center',
          sortable: true,
          show: true
        },
        {
          prop: 'resourceName',
          label: 'Tên hóa chất',
          width: '170',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'quantity',
          label: 'Số lượng',
          width: '120',
          align: 'center',
          sortable: true,
          show: true
        },
        {
          prop: 'unit',
          label: 'Đơn vị tính',
          width: '150',
          align: 'center',
          formatter: row => {
            return getNameByIdOnGrid(
              row.unit,
              'propertyValue',
              'propertyName',
              this.lstDVT
            )
          },
          sortable: true,
          show: true
        },
        {
          prop: 'origin',
          label: 'Xuất xứ',
          width: '150',
          sortable: true,
          show: true
        },
        {
          prop: 'storageLocation',
          label: 'Khu lưu trữ',
          width: '150',
          align: 'center',
          sortable: true,
          show: true
        },
        {
          prop: 'createdAt',
          label: 'Ngày tạo',
          width: '150',
          align: 'center',
          formatter: row => {
            return formatFullDate_VN(new Date(row.createdAt))
          },
          sortable: true,
          show: true
        },
        {
					prop: "status",
					label: "Trạng thái",
					width: "100",
					align: "center",
					formatter: TrangThaiRecord,
					show: true,
					sortable: true,
				}      
      ],
      MENU_CODE_API,
      FORM_MODE,
      STATUS_ROW_UPDATE,
      TAI_LIEU_KHAC
    }
  },
  created() {
    this.loading = true
  },
  computed: {    
  },
  mounted() {
    this.resetDateSearch()
    this.formSearch.maHqTiepNhan = '_'.concat(this.$store.getters.userInfo.org)
    this.windowHeight = screen.height
    this.loading = false
    this.onLoadListTaiLieuKemTheo()
    this.joinNameByCodeColumnExcel = this.getListJoinNameByCodeColumnExcel()
    // this.formSearch.maHq = this.$refs.selectHQ.listMaHq[0].code

    console.log(this.$store)
    console.log(this.$store.getters.token)
  },
  methods: {
    checkPermissionShowButton(idButton) {
      return checkPermissionShowButton(MENU_CODE_API, idButton)
    },
    resetDateSearch() {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = dt.getMonth()
      const d = dt.getDate()
      this.formSearch.fromToDate = [new Date(y, m, d), new Date(y, m, d)]
    },
    onLoadListTaiLieuKemTheo() {
      if (!this.lstTaiLieuKemTheo.length) {
        this.loading = true
        apiFactory
          .callAPI(ConstantAPI['DMNV'].TAILIEU_HS)
          .then(rs => {
            this.loading = false
            this.$store.dispatch(
              'common/listCommonData/setDanhSachTaiLieuKemTheo',
              rs || []
            )

            this.lstTaiLieuKemTheo = this.$store.state['common'].listCommonData.danhSachTaiLieuKemTheo || []
            this.lenTLKTHS = this.lstTaiLieuKemTheo.length
          })
          .catch(err => {
            this.loading = false
            errAlert(this, err)
            // console.log(err)
          })
      }
    },
    initQuestion(len) {
      while (len--) {
        this.lstCauHoi[len] = this.radioYes
        this.lstLyDoKhongDinhKem[len] = ''
      }
      // setTimeout(function() {
      //   while (len--) {
      //     this.lstCauHoi = {}
      //     this.lstLyDoKhongDinhKem = {}
      //   }
      // }, 500)
    },
    selectQuestion(idx) {
      // this.lstCauHoi[idx] = this.radioValue
      let len = this.lenTLKTHS
      let fileTlkt = []
      while (len--) {
        if (this.lstCauHoi[len] === this.radioYes) {
          this.lstLyDoKhongDinhKem[len] = ''
          fileTlkt = this.lstAttachment.filter(obj => obj.id_loai_tai_lieu === this.lstTaiLieuKemTheo[idx].id)
          for (const objFile of fileTlkt) {
            this.fileListDelete.push(objFile.id_tai_lieu)
          }
        } else {
          if (
            this.lstAttachment !== undefined &&
            this.lstAttachment !== null &&
            this.lstAttachment.length > 0
          ) {
            // Remove Attachment
            // fileTlkt = this.lstAttachment.filter(obj => obj.id_loai_tai_lieu === this.lstTaiLieuKemTheo[idx].id)
            this.selectQuestionRemoveAttachment(idx)
          }
          if (this.$refs.uploadTLKTHS !== undefined && this.$refs.uploadTLKTHS !== null) {
            this.$refs.uploadTLKTHS[len].clearFiles()
          }
        }
      }
      // console.log(this.lstCauHoi)console.log(this.lstLyDoKhongDinhKem)
    },
    selectQuestionRemoveAttachment(idx) {
      const fileTlkt = this.lstAttachment.filter(obj => obj.id_loai_tai_lieu === this.lstTaiLieuKemTheo[idx].id)
      for (const objFile of fileTlkt) {
        this.fileListDelete.push(objFile.id_tai_lieu)
      }
      this.lstAttachmentGroup[idx] = []
      this.lstAttachment = this.lstAttachment.filter(obj => obj.id_loai_tai_lieu !== this.lstTaiLieuKemTheo[idx].id)
      if (fileTlkt.length > 0) {
        fileTlkt[0].id_tai_lieu = 0
        fileTlkt[0].dinh_kem_file = 0
        fileTlkt[0].ma_file = ''
        fileTlkt[0].ten_file = ''
        fileTlkt[0].loai_file = ''
        fileTlkt[0].file_size = 0
        this.lstAttachment.push(fileTlkt[0])
      }
    },
    radioChecked(value) {
      this.radioValue = value
    },
    getListJoinNameByCodeColumnExcel() {
      // console.log(this.$store.state['common'].listCommonData.danhSachTrangThaiPTPL)
      return [
        {
          col: 'hq_tiep_nhan_yeu_cau_phan_tich',
          code: 'code',
          name: 'name',
          lstData: JSON.parse(localStorage.getItem(LIST_CUSTOMS))
        },
        {
          col: 'hq_yeu_cau_phan_tich',
          code: 'code',
          name: 'name',
          lstData: JSON.parse(localStorage.getItem(LIST_CUSTOMS))
        },
        {
          col: 'ma_trang_thai',
          code: 'key',
          name: 'value',
          lstData: this.statusExport
        }
      ]
    },
    onSearchHandling(idButton) {
      if (checkPermissionShowButton(MENU_CODE_API, idButton)) {
        this.onSearch('')
      }
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
        // Custom properties KeySearchObj API        
        this.formSearch.fromDate = fromToDate[0]
        this.formSearch.toDate = fromToDate[1]
        apiFactory
          .callAPI(ConstantAPI[MENU_CODE_API].SEARCH, {}, this.formSearch)
          .then(rs => {
            this.loadDataTable = false
            this.listDataTable = rs.result
            // console.log(rs)
            this.total = rs['totalElements']
            // console.log(this.total)
          })
          .catch(err => {
            this.loadDataTable = false
            this.listDataTable = []
            errAlert(this, err)
          })
      })

      this.formSearch.maHqTiepNhan = this.formSearch.maHqTiepNhanTmp
    },
    validateFileSize(files) {
      let totalSize = 0
      for (const obj of files) {
        totalSize += obj.file_size
      }
      return checkIsValidFileSize(totalSize, maxFileSize)
    },
    validateFileUpload(lstFile) {
      let lstTL = []
      let idLoaiTaiLieu = 0
      let bol = false
      for (const objTL of this.lstTaiLieuKemTheo) {
        idLoaiTaiLieu = objTL.id
        lstTL = lstFile.filter(obj => obj.id_loai_tai_lieu === idLoaiTaiLieu && obj.file_size > 0 && obj.ten_file !== null)
        if (lstTL.length > LIMIT_UPLOAD_FILE) {
          bol = true
          break
        }
      }
      // Tai lieu khac
      idLoaiTaiLieu = 0
      lstTL = lstFile.filter(obj => obj.id_loai_tai_lieu === idLoaiTaiLieu && obj.file_size > 0 && obj.ten_file !== null)
      if (lstTL.length > LIMIT_UPLOAD_FILE) {
        bol = true
      }

      if (bol) {
        showAlert(
          this,
          WARNING,
          'Bạn chỉ được đính kèm '.concat(
            LIMIT_UPLOAD_FILE,
            ' file mỗi mục. Hãy xóa file hiện tại trước khi đính kèm file mới'
          )
        )
        return false
      }

      if (!this.validateFileSize(lstFile)) {
        showAlert(
          this,
          WARNING,
          'Tổng dung lượng file đính kèm không được lớn hơn '.concat(maxFileSize, 'MB')
        )
        return false
      }
      return true
    },
    onInsert(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }

        this.buttonSaveLoading = true
        apiFactory
          .callAPIFormFile(
            ConstantAPI[MENU_CODE_API].INSERT,
            this.formAddEdit,
            this.fileListUpload
          )
          .then(rs => {
            showAlert(this, SUCCESS, 'Thêm mới thành công!')
            this.buttonSaveLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
            // console.log(rs)
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
          .callAPIFormFile(
            ConstantAPI[MENU_CODE_API].UPDATE,
            this.formAddEdit,
            this.fileListUpload
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Cập nhật thành công!')
            this.buttonUpdateLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.message)
            this.buttonUpdateLoading = false
            this.isShowDlgAddEdit = true
          })
      })
    },

    onDelete(code) {      
      showConfirmDelete(this.$confirm, () => {
        const param = {
          resourceId: code.resourceId
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
      })
    },
    onSendHoSo(code) {
      showConfirmCustom(
        this.$confirm,
        'Bạn có chắc chắn muốn gửi phiếu yêu cầu?',
        () => {
          const status_old = this.formAddEdit.ma_trang_thai
          this.formAddEdit.ma_trang_thai = GUI_PHIEU_YC
          this.buttonAction = ACTION_MODE.SEND
          if (this.formAddEdit.id_phieu_yeu_cau > 0) {
            this.onUpdate('formAddEdit')
          } else {
            this.onInsert('formAddEdit')
          }
          setTimeout(() => {
            this.buttonAction = ACTION_MODE.DEFAULT
            this.formAddEdit.ma_trang_thai = status_old
          }, 200)
        },
        'Xác nhận'
      )
    },
    resetForm(formName) {
      this.resetFrm(formName)
      this.listDataTable = []
      this.lstAttachment = []
      this.lstAttachmentGroup = []
      this.fileListUpload = []
      this.total = 0
      this.formSearch.orgCode = this.$store.getters.org
      this.formSearch.maHqTiepNhan = '_' + this.$store.getters.userInfo.org
      this.resetDateSearch()

      // Reset Component
      this.formSearch.maLoaiNguoiKhai = ''
      this.formSearch.maPtvt = ''
      this.formSearch.maDiaDiemDoHang = ''
      this.formSearch.maCuaKhauNhap = ''
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
      this.tabIndex = '0'
      this.isPrint = false
      this.isHiddenInput = false
      this.isHidenGuiHoSo = false
      this.titleDialog = 'Thêm mới Hóa chất'
      this.flagShowDialog = FORM_MODE.CREATE
      this.isShowDlgAddEdit = true
      this.disableWhenEdit = false
      this.disableAppCodeModeEdit = false;
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }

      const arrDK = [undefined, null, '']
      let len = 0
      if (arrDK.indexOf(this.$refs.uploadTLKTHS) === -1) {
        len = this.$refs.uploadTLKTHS.length
        while (len--) {
          this.$refs.uploadTLKTHS[len].clearFiles()
        }
      }

      if (this.$refs.uploadGTK) {
        this.$refs.uploadGTK.clearFiles()
      }
      this.isNguoiUyQuyen = false
      this.lstAttachment = []
      this.lstAttachmentGroup = []
      this.fileListUpload = []
      this.fileListDelete = []
      this.fileListKBBK = []
      this.formAddEdit.hq_yeu_cau_phan_tich =
        this.$store.getters.userInfo.org +
        ' - ' +
        this.$store.getters.userInfo.orgName
      this.formAddEdit.id = 0
      this.formAddEdit.resourceId = 0
      this.formAddEdit.resourceCode = ''
      this.formAddEdit.createdAt = getCurrentDateNoTime()
      this.formAddEdit.resourceName = ''
      this.formAddEdit.resourceType = ''
      this.formAddEdit.quantity = 0
      this.formAddEdit.unit = ''
      this.formAddEdit.origin = ''
      this.formAddEdit.storageLocation = ''
      this.formAddEdit.ten_hang_khai_bao = ''
      this.formAddEdit.description = ''
      this.formAddEdit.giay_to_khac = ''
      this.formAddEdit.fileDinhKem = ''
      this.formAddEdit.lstFileDelete = ''
      this.formAddEdit.is_change_detail = false
      this.formAddEdit.status = '1'
      this.formAddEdit.ma_trang_thai = 1
    },
    onPrepareEdit(code) {
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }
      const arrDK = [undefined, null, '']
      let len = 0
      if (arrDK.indexOf(this.$refs.uploadTLKTHS) === -1) {
        len = this.$refs.uploadTLKTHS.length
        while (len--) {
          this.$refs.uploadTLKTHS[len].clearFiles()
        }
      }

      if (this.$refs.uploadGTK) {
        this.$refs.uploadGTK.clearFiles()
      }

      this.isNguoiUyQuyen = false
      this.tabIndex = '0'
      this.isPrint = false
      this.lstAttachment = []
      this.lstAttachmentGroup = []
      this.fileListUpload = []
      this.fileListDelete = []
      this.fileListKBBK = []
      this.isHiddenInput = false
      this.isHidenGuiHoSo = false
      this.disableWhenEdit = true
      this.titleDialog = 'Cập nhật Hóa chất'
      this.flagShowDialog = FORM_MODE.EDIT
      this.iconEditLoading = true
      // this.hideColumnTinhTrang(false)
      const param = {
        code: code
      }
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, param)
        .then(rs => {
          this.preEditDetails(rs)
          this.showHideBtnSend()
          this.disableAppCodeModeEdit = true;
          this.iconEditLoading = false
          this.isShowDlgAddEdit = true
        })
        .catch(() => {
          this.iconEditLoading = false
          showAlert(this, WARNING, 'Bản ghi không tồn tại trên hệ thống')
        })
    },
    preEditDetails(rs) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(rs) === -1) {
        this.formAddEdit = rs
        this.formAddEdit.quantity = '' + this.formAddEdit.quantity;
        
        // File
        // this.getLstAttachment(rs)
        // this.checkGuiHoSoPreEdit()
      }
    },
    getLstAttachment(rs) {
      const arrDK = [undefined, null, '']
      const files = []
      let len = 0
      let i = 0
      // Them list File
      const filesTmp = rs.files
      if (arrDK.indexOf(filesTmp) === -1) {
        len = filesTmp.length
        while (i < len) {
          files.push(filesTmp[i]) // this.snakeCaseToCamelCaseDeep()
          i++
        }
      }

      files.sort((a, b) => a.id_loai_tai_lieu - b.id_loai_tai_lieu)
      // console.log(files)
      const lstTailieu = files.filter(obj => obj.id_loai_tai_lieu > 0)
      i = 0
      // len = lstTailieu.length

      // Xu ly upload multil
      const lstTaiLieuKemTheo = this.lstTaiLieuKemTheo
      for (const doc of lstTaiLieuKemTheo) {
        const fileTlkt = lstTailieu.filter(obj => obj.id_loai_tai_lieu === doc.id)
        this.lstAttachmentGroup.push(fileTlkt)
        if (fileTlkt.length > 1) {
          this.lstCauHoi[i] = this.radioYes
          this.lstLyDoKhongDinhKem[i] = ''

          // Xoa phan tu khoi tao mac dinh theo loai tai lieu trong files
          // files = files.filter(obj => obj.id_loai_tai_lieu !== doc.id)
          // for (const fileUp of fileTlkt) {
          //   const objTL = this.initFileBase()
          //   objTL.id_loai_tai_lieu = doc.id
          //   objTL.ten_file = fileUp.raw.name
          //   objTL.loai_file = fileUp.raw.type
          //   objTL.file_size = fileUp.raw.size
          //   objTL.uid = fileUp.raw.uid
          //   files.push(objTL)
          // }
        } else {
          // It nhat co 1 row
          this.initOneObjectAttachment(fileTlkt, i)
        }

        i++
      }

      // Danh sach tai lieu
      this.lstAttachment = lstTailieu
      // Tai lieu khac
      const lstTLKhac = files.filter(obj => obj.id_loai_tai_lieu === 0)
      this.lstAttachmentGroup.push(lstTLKhac)
      if (arrDK.indexOf(lstTLKhac) === -1 && lstTLKhac.length > 0) {
        for (const objKhac of lstTLKhac) {
          this.lstAttachment.push(objKhac)
        }

        // Tat ca file khac deu luu column giay to khac giong nhau
        this.formAddEdit.giay_to_khac = lstTLKhac[0].giay_to_khac
      }
      // console.log(this.lstAttachment)
    },
    initOneObjectAttachment(fileTlkt, i) {
      this.lstCauHoi[i] = fileTlkt.length > 0 &&
        fileTlkt[0].dinh_kem_file === 1 ? this.radioYes : this.radioNo
      if (fileTlkt.length > 0 && fileTlkt[0].dinh_kem_file === 0) {
        this.lstLyDoKhongDinhKem[i] = fileTlkt[0].ly_do_khong_dinh_kem
      } else {
        this.lstLyDoKhongDinhKem[i] = ''
      }
    },
    checkGuiHoSoPreEdit() {
      if (this.formAddEdit.ma_trang_thai === GUI_PHIEU_YC) {
        this.flagShowDialog = FORM_MODE.APPROVE
        // Disabled all khi Edit gui ho so
        // this.isHidenGuiHoSo = true
        // this.hideColumnTinhTrang(true)
        this.setTimeoutDownload()
      }
    },
    onView(row) {
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }

      this.tabIndex = '0'
      this.lstAttachment = []
      this.lstAttachmentGroup = []
      this.fileListUpload = []
      this.fileListDelete = []
      this.fileListKBBK = []
      this.isHiddenInput = true
      this.flagShowDialog = FORM_MODE.VIEW
      this.isPrint = true
      this.titleDialog = 'Chi tiết Hóa chất'
      if (this.$refs.uploadTLKTHS !== undefined && this.$refs.uploadTLKTHS !== null) {
        for (const objUpload of this.$refs.uploadTLKTHS) {
          objUpload.clearFiles()
        }
        this.$refs.uploadGTK.clearFiles()
      }

      const param = {
        code: row.resourceCode
      }
      this.iconViewLoading = true
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, param)
        .then(rs => {
          this.viewDetails(rs)
          this.disableAppCodeModeEdit = true;
        })
    },
    viewDetails(rs) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(rs) === -1) {
        // console.log(rs)
        this.formAddEdit = rs
        this.formAddEdit.quantity = ''+ this.formAddEdit.quantity
        // File
        //this.getLstAttachment(rs)
      }
      this.totalKBBK = 0
      this.iconViewLoading = false
      this.isShowDlgAddEdit = true
      //this.checkGuiHoSoView()
    },
    checkGuiHoSoView() {
      if (this.formAddEdit.ma_trang_thai === GUI_PHIEU_YC) {
        this.flagShowDialog = FORM_MODE.APPROVE
        this.isHidenGuiHoSo = true
        this.setTimeoutDownload()
      }
    },
    setTimeoutDownload() {
      setTimeout(() => {
        if (
          this.$refs.download !== undefined &&
          this.$refs.download !== null &&
          this.$refs.download.length > 0
        ) {
          this.$refs.download[0].$el.disabled = false
        }
      }, 500)
    },
    change(val) {
      this.$emit('change', val)
    },
    hideColumnTinhTrang(value) {
      let idx = 0
      idx = this.columns_KBBK.length
      idx--
      this.columns_KBBK[idx].show = !value
    },
    getStatusSelected(choose) {
      this.statusSelect.forEach(status => {
        if (Number(choose) === status.key) {
          choose = status.value
        }
      })
      return choose
    },
    // Read file with tag input html
    onChangeFile(event) {
      this.file = event.target.files ? event.target.files[0] : null
      if (this.file) {
        const reader = new FileReader()

        reader.onload = e => {
          /* Parse data */
          const bstr = e.target.result
          const wb = XLSX.read(bstr, { type: 'binary' })
          /* Get first worksheet */
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
          this.dataKBBK = data
        }

        reader.readAsBinaryString(this.file)
      }
    },
    // Click Button Upload
    onSelectUpload(loaiTL, idx) {
      this.currentTLKTHS = loaiTL
      this.currentIndex = idx
      // console.log(loaiTL)
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < maxFileSize

      if (!isIMAGE) {
        showAlert(this, WARNING, 'File upload không đúng định dạng')
      }
      if (!isLt1M) {
        showAlert(
          this,
          WARNING,
          'File upload dung lượng lớn nhất không được vượt quá '.concat(maxFileSize, 'MB')
        )
      }
      return isIMAGE && isLt1M
    },
    // Processing Method for Uploading Files - Element UI
    handleChangeFile(file, fileList) {
      this.fileListKBBK = fileList
      this.fileTemp = file.raw
      if (this.fileTemp) {
        if (
          this.fileTemp.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          this.fileTemp.type === 'application/vnd.ms-excel'
        ) {
          this.readFileExcel(this.fileTemp)
        } else {
          showAlert(this, WARNING, 'File upload không đúng định dạng')
        }
      } else {
        showAlert(this, WARNING, 'Bạn hãy chọn file cần upload')
      }
    },
    // Processing method when exceeding the maximum number of uploaded files
    handleExceedFile(files, fileList) {
      const idx = this.currentIndex
      let bol = false
      if (files.length > LIMIT_UPLOAD_FILE) {
        bol = true
      } else {
        let lstFileTL = []
        let idLoaiTaiLieu = 0
        if (idx !== TAI_LIEU_KHAC) {
          idLoaiTaiLieu = this.lstTaiLieuKemTheo[idx].id
        }
        lstFileTL = this.lstAttachment.filter(obj => obj.id_loai_tai_lieu === idLoaiTaiLieu && obj.file_size > 0 && obj.ten_file !== null)
        if ((files.length + fileList.length + lstFileTL.length) > LIMIT_UPLOAD_FILE) {
          bol = true
        }
      }
      if (bol) {
        showAlert(
          this,
          WARNING,
          'Bạn chỉ được đính kèm '.concat(
            LIMIT_UPLOAD_FILE,
            ' file mỗi mục. Hãy xóa file hiện tại trước khi đính kèm file mới'
          )
        )
        return false
      }
    },
    // How to remove files
    handleRemoveFile(file, fileList) {
      this.fileListKBBK = fileList
      this.fileTemp = null
    },
    readFileExcel(objFile) {
      const _this = this
      // Retrieving file data through DOM

      // this.file = event.currentTarget.files[0]
      this.file = objFile
      var rABS = false // Read the file as a binary string
      var f = this.file
      var reader = new FileReader()
      FileReader.prototype.readAsBinaryString = function(f1) {
        var binary = ''
        rABS = false // Read the file as a binary string
        var wb // Read completed data
        var lstOutData = []
        var outdata
        reader = new FileReader()
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          var lenSheet = 0
          var i
          for (i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // If not introduced in main.js, you need to introduce it here to parse excel
          // var XLSX = require("xlsx");
          if (rABS) {
            // wb = XLSX.read(btoa(fixdata(binary)), {
            wb = XLSX.read(btoa(binary), {
              // Manual conversion
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          lenSheet = wb.SheetNames.length
          for (i = 0; i < lenSheet; i++) {
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[i]])
            lstOutData.push(outdata)
          }

          // outdata is read data (without header rows or headers, the header will be the subscript of the object)
          // Data can be processed here.
          _this.excelData = lstOutData
          // console.log(this.dataKBBK)
          return lstOutData
        }
        reader.readAsArrayBuffer(f1)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    },
    handleChangeFileTLKTHS(file, fileList) {
      this.fileTemp = file.raw
      if (this.fileTemp) {
        // this.fileListUpload = fileList
        if (!validateFileExtension(this.fileTemp)) {
          showAlert(
            this,
            WARNING,
            'File không đúng định dạng hoặc tên file không được có ký tự đặc biệt và không được viết tiếng việt có dấu'
          )
          const i = this.currentIndex
          if (i === TAI_LIEU_KHAC) {
            if (this.$refs.uploadGTK) {
              this.$refs.uploadGTK.clearFiles()
            }
          } else if (this.$refs.uploadTLKTHS) {
            this.$refs.uploadTLKTHS[i].clearFiles()
          }
        } else {
          file.idTlkths = this.currentTLKTHS.id
          file.maTlkths = this.currentTLKTHS.ma
          file.idxTlkths = this.currentIndex
          // file size, uidFile
          this.fileListUpload.push(file)
          // console.log(this.fileListUpload)
        }
      } else {
        showAlert(this, WARNING, 'Bạn hãy chọn file cần upload')
      }
    },
    // How to remove files
    handleRemoveFileTLKTHS(file, fileList) {
      let lstFile = this.fileListUpload
      lstFile = lstFile.filter(obj => obj !== file)
      this.fileListUpload = lstFile
      // console.log(this.fileListUpload)
      this.fileTemp = null
    },
    onDeleteFile(objFile, idxTl, idxTlGroup) {
      showConfirmDelete(this.$confirm, () => {
        let len = this.lstAttachment.length
        // Xu ly upload multil
        // const fileTlkt = filesTmp.filter(obj => obj.idTlkths === doc.id)
        this.fileListDelete.push(objFile.id_tai_lieu)
        if (this.lstAttachmentGroup[idxTl].length === 1) {
          while (len--) {
            if (this.lstAttachment[len].id_tai_lieu === objFile.id_tai_lieu) {
              this.lstAttachment[len].id_tai_lieu = 0
              this.lstAttachment[len].ma_file = ''
              this.lstAttachment[len].ten_file = ''
              this.lstAttachment[len].loai_file = ''
              this.lstAttachment[len].file_size = 0
            }
          }
        } else {
          this.lstAttachment = this.lstAttachment.filter(item => item !== objFile)
        }

        this.lstAttachmentGroup[idxTl].splice(idxTlGroup, 1)
        // this.lstAttachment = this.lstAttachment.filter(item => item !== objFile)
      })
    },
    getHaiQuanByMa(choose) {
      const lstHQ = JSON.parse(localStorage.getItem(LIST_CUSTOMS))
      lstHQ.forEach(hq => {
        if (choose === hq.code) {
          choose = hq.name
        }
      })
      return choose
    },
    getDvxnkByMa(maDvxnk) {
      const lstMaDvxnk = maDvxnk.toString().split(' -')

      const param = {
        code: lstMaDvxnk[0]
      }
      apiFactory
        .callAPI(ConstantAPI['DMDC'].SCOMPANY_EXIM, {}, param)
        .then(rs => {
          if (rs !== undefined && rs !== null) {
            this.formAddEdit.ma_dvxnk = ''.concat(
              rs.result[0].code,
              ' - ',
              rs.result[0].name
            )
            this.formAddEdit.ten_dvxnk = rs.result[0].name
          } else {
            this.formAddEdit.ma_dvxnk = ''
            this.formAddEdit.ten_dvxnk = ''
          }
        })
        .catch(() => {
          this.iconEditLoading = false
          showAlert(this, WARNING, 'Mã đơn vị XNK không tồn tại trên hệ thống')
          this.formAddEdit.ma_dvxnk = ''
          this.formAddEdit.ten_dvxnk = ''
        })
    },
    getListDataDVT(lstValue) {
      this.lstDVT = lstValue
    },
    getListDataHinhThucKiemTra(lstValue) {
      this.lstHinhThucKiemTra = lstValue
    },
    getMaHinhThucKiemTraSelected(choose) {
      this.lstHinhThucKiemTra.forEach(hinhThuc => {
        if (Number(choose) === hinhThuc.key) {
          choose = hinhThuc.label
        }
      })
      return choose
    },
    getListNguoiKhaiLayLaiMau(lstValue) {
      this.lstNguoiKhaiLayLaiMau = lstValue
    },
    getListNguoiKhaiLayLaiMauSelected(choose) {
      this.lstNguoiKhaiLayLaiMau.forEach(obj => {
        if (Number(choose) === obj.key) {
          choose = obj.label
        }
      })
      return choose
    },
    getLoaiHinhXnkSelected(choose) {
      this.$store.state['common'].listCommonData.danhSachLoaiHinhXNK.forEach(
        loaiHinh => {
          if (Number(choose) === loaiHinh.code) {
            choose = loaiHinh.name
          }
        }
      )
      return choose
    },
    showHideBtnSend() {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(this.formAddEdit.status_pyc) === -1) {
        this.formAddEdit.ma_trang_thai = this.formAddEdit.status_pyc
      }

      if (
        arrDK.indexOf(this.formAddEdit.ma_trang_thai) === -1 &&
        STATUS_BTN_SEND.indexOf(this.formAddEdit.ma_trang_thai) > -1
      ) {
        this.isShowBtnSend = true
      } else {
        this.isShowBtnSend = false
      }
    },
    hideshowUpload() {
      if (this.formAddEdit.ma_loai_nguoi_khai === LOAI_NGUOI_KHAI_UQ) {
        this.isNguoiUyQuyen = true
      } else {
        this.isNguoiUyQuyen = false
      }
    },
    tableRowClassName({ row, rowIndex }) {
      return this.validateDataGrid(row, rowIndex)
    },
    validateDataGrid(row, rowIndex) {
      const arrDK = [undefined, null, '']
      if (
        arrDK.indexOf(row.ma_trang_thai) === -1 &&
        row.ma_trang_thai === 3
      ) {
        const now = getCurrentDateNoTime()
        if (arrDK.indexOf(row.ngay_bo_sung_ho_so) === -1 && (new Date(row.ngay_bo_sung_ho_so)) < now) {
          return 'warning-row'
        }
      }
    },
    // deepClone
    camelCaseToSnakeCaseDeep(anything) {
      const thing = _.cloneDeep(anything)

      if (_.isEmpty(thing) || (!_.isObject(thing) && !_.isArray(thing))) {
        return thing
      }

      if (_.isArray(thing)) {
        const arr = thing
        return arr.map(el => this.camelCaseToSnakeCaseDeep(el))
      }

      // thing can be only not empty object here
      const objWithMappedKeys = _.mapKeys(thing, (value, key) =>
        _.snakeCase(key)
      )
      const objWithMappedValues = _.mapValues(objWithMappedKeys, value =>
        this.camelCaseToSnakeCaseDeep(value)
      )

      return objWithMappedValues
    },
    snakeCaseToCamelCaseDeep(anything) {
      const thing = _.cloneDeep(anything)

      if (_.isEmpty(thing) || (!_.isObject(thing) && !_.isArray(thing))) {
        return thing
      }

      if (_.isArray(thing)) {
        const arr = thing
        return arr.map(el => this.snakeCaseToCamelCaseDeep(el))
      }

      // thing can be only not empty object here
      const objWithMappedKeys = _.mapKeys(thing, (value, key) =>
        _.camelCase(key)
      )
      const objWithMappedValues = _.mapValues(objWithMappedKeys, value =>
        this.snakeCaseToCamelCaseDeep(value)
      )

      return objWithMappedValues
    },
    initFileBase() {
      const objTL = {}
      objTL.id_tai_lieu = 0
      objTL.id_phieu_yeu_cau = 0
      objTL.id_chung_tu_goc = 0
      objTL.id_loai_tai_lieu = 0
      objTL.dinh_kem_file = 1
      objTL.ma_file = ''
      objTL.ten_file = ''
      objTL.loai_file = ''
      objTL.ly_do_khong_dinh_kem = ''
      objTL.giay_to_khac = ''
      objTL.file_size = 0
      objTL.uid = 0
      return objTL
    },
    getPhieuYeuCauByForm() {
      let objPhieuYeuCau = {}
      this.formAddEdit.lstFileDelete = this.fileListDelete.join(',')
      // console.log(this.formAddEdit.ngay_den_cuakhau_dukien)

      const master = this.camelCaseToSnakeCaseDeep(this.formAddEdit)
      master.hq_yeu_cau_phan_tich = this.$store.getters.userInfo.org
      // Don vi XNK
      const lstMaDvxnk = master.ma_dvxnk.toString().split(' -')
      master.ma_dvxnk = lstMaDvxnk[0]

      let files = []
      let i = 0
      let len = 0

      len = this.lstTaiLieuKemTheo.length
      while (i < len) {
        const objTL = this.initFileBase()
        objTL.id_loai_tai_lieu = this.lstTaiLieuKemTheo[i].id
        objTL.dinh_kem_file = parseInt(this.lstCauHoi[i])
        objTL.ly_do_khong_dinh_kem = this.lstLyDoKhongDinhKem[i]

        files.push(objTL)
        i++
      }

      const filesTmp = this.fileListUpload
      // File khac
      files = this.getLstImportFileKhac(files, filesTmp)

      // Xu ly upload multil
      const lstTaiLieuKemTheo = this.lstTaiLieuKemTheo
      for (const doc of lstTaiLieuKemTheo) {
        const fileTlkt = filesTmp.filter(obj => obj.idTlkths === doc.id)
        if (fileTlkt.length > 0) {
          // Xoa phan tu khoi tao mac dinh theo loai tai lieu trong files
          files = files.filter(obj => obj.id_loai_tai_lieu !== doc.id)
          for (const fileUp of fileTlkt) {
            const objTL = this.initFileBase()
            objTL.id_loai_tai_lieu = doc.id
            objTL.ten_file = fileUp.raw.name
            objTL.loai_file = fileUp.raw.type
            objTL.file_size = fileUp.raw.size
            objTL.uid = fileUp.raw.uid

            files.push(objTL)
          }
        }
      }

      // Truong hop su dung Template
      if (this.isTemplate) {
        if (this.formAddEdit.lstFileDelete != null && this.formAddEdit.lstFileDelete.length > 0) {
          this.lstAttachment = this.lstAttachment.filter(item => this.fileListDelete.indexOf(item.id_tai_lieu) === -1)
          this.formAddEdit.lstFileDelete = ''
        }
        // Lam moi file
        for (const objFile of this.lstAttachment) {
          objFile.id_tai_lieu = 0
          files.push(objFile)
        }
      }

      objPhieuYeuCau = master
      objPhieuYeuCau.cong_chuc_hq_lay_mau1 =
        objPhieuYeuCau.cong_chuc_hq_lay_mau_1
      objPhieuYeuCau.cong_chuc_hq_lay_mau2 =
        objPhieuYeuCau.cong_chuc_hq_lay_mau_2
      objPhieuYeuCau.files = files

      return objPhieuYeuCau
    },
    getLstImportFileKhac(files, filesTmp) {
      const arrDK = [undefined, null, '']

      let fileTlKhac = filesTmp.filter(obj => obj.idxTlkths === TAI_LIEU_KHAC)
      if (
        (arrDK.indexOf(fileTlKhac) === -1 && fileTlKhac.length > 0) ||
        (this.formAddEdit.giay_to_khac !== null && this.formAddEdit.giay_to_khac.length > 0)
      ) {
        if (fileTlKhac.length > 0) {
          for (const objKhac of fileTlKhac) {
            const objTLKhac = this.initFileBase()
            objTLKhac.ten_file = objKhac.raw.name
            objTLKhac.loai_file = objKhac.raw.type
            objTLKhac.ly_do_khong_dinh_kem = ''
            objTLKhac.giay_to_khac = this.formAddEdit.giay_to_khac
            objTLKhac.file_size = objKhac.raw.size
            objTLKhac.uid = objKhac.raw.uid

            files.push(objTLKhac)
          }
        }
        if (this.formAddEdit.giay_to_khac !== null && this.formAddEdit.giay_to_khac.length > 0 && fileTlKhac.length === 0) {
          fileTlKhac = this.lstAttachment.filter(obj => obj.id_loai_tai_lieu === 0)
          if (fileTlKhac.length === 0) {
            const objTLKhac = this.initFileBase()
            objTLKhac.giay_to_khac = this.formAddEdit.giay_to_khac

            files.push(objTLKhac)
          }
        }
      }
      return files
    },
    getPhieuYeuCauByFormUpdate() {
      let objPhieuYeuCau = {}

      this.formAddEdit.lstFileDelete = this.fileListDelete.join(',')
      this.formAddEdit.loaiHoSo = MA_CHUC_NANG
      // console.log(this.formAddEdit.ngay_den_cuakhau_dukien)
      this.formAddEdit.hq_yeu_cau_phan_tich = this.$store.getters.userInfo.org
      this.formAddEdit.status = 1

      const master = this.camelCaseToSnakeCaseDeep(this.formAddEdit)
      // Don vi XNK
      const lstMaDvxnk = master.ma_dvxnk.toString().split(' -')
      master.ma_dvxnk = lstMaDvxnk[0]

      // snakeCaseToCamelCaseDeep(obj)
      objPhieuYeuCau = master
      objPhieuYeuCau.cong_chuc_hq_lay_mau1 =
        objPhieuYeuCau.cong_chuc_hq_lay_mau_1
      objPhieuYeuCau.cong_chuc_hq_lay_mau2 =
        objPhieuYeuCau.cong_chuc_hq_lay_mau_2

      // Them list File
      let files = []
      let filesTmp = this.lstAttachment
      let len = 0
      let i = 0
      if (filesTmp !== undefined && filesTmp !== null) {
        len = filesTmp.length
        while (i < len) {
          files.push(this.camelCaseToSnakeCaseDeep(filesTmp[i]))
          i++
        }
      }

      i = 0
      len = this.lstTaiLieuKemTheo.length
      while (i < len) {
        // Xu ly upload multil
        for (let j = 0; j < files.length; j++) {
          if (files[j].id_loai_tai_lieu === this.lstTaiLieuKemTheo[i].id) {
            files[j].dinh_kem_file = parseInt(this.lstCauHoi[i])
            files[j].ly_do_khong_dinh_kem = this.lstLyDoKhongDinhKem[i]
          }
        }
        // file.idTlkths
        i++
      }

      filesTmp = this.fileListUpload

      // File khac
      // files = this.getLstFileKhacUpdate(files, filesTmp)
      files = this.getLstImportFileKhac(files, filesTmp)
      // Set lai mo ta giay to khac
      for (const fKhac of files) {
        if (fKhac.id_loai_tai_lieu === 0) {
          fKhac.giay_to_khac = this.formAddEdit.giay_to_khac
        }
      }

      // Xu ly upload multil
      files = this.getFileMultilUpload(files, filesTmp)
      objPhieuYeuCau.files = files
      return objPhieuYeuCau
    },
    getFileMultilUpload(files, filesTmp) {
      const lstTaiLieuKemTheo = this.lstTaiLieuKemTheo
      for (const doc of lstTaiLieuKemTheo) {
        const fileTlkt = filesTmp.filter(obj => obj.idTlkths === doc.id)
        if (fileTlkt.length > 0) {
          // Xoa phan tu co ten file null theo loai tai lieu trong files
          files = this.removeObjectFileNameNull(files, doc.id)
          for (const fileUp of fileTlkt) {
            const objTL = this.initFileBase()
            objTL.id_loai_tai_lieu = doc.id
            objTL.ten_file = fileUp.raw.name
            objTL.loai_file = fileUp.raw.type
            objTL.file_size = fileUp.raw.size
            objTL.uid = fileUp.raw.uid

            files.push(objTL)
          }
        }
      }
      return files
    },
    removeObjectFileNameNull(files, idTl) {
      // files = files.filter(obj => ((obj.id_loai_tai_lieu !== idTl) || (obj.id_loai_tai_lieu === idTl && obj.ten_file !== null)))
      const lstFile = JSON.parse(JSON.stringify(files))
      const arrDK = [null, '']
      for (let i = 0; i < lstFile.length; i++) {
        if (lstFile[i].id_loai_tai_lieu === idTl && arrDK.indexOf(lstFile[i].ten_file) > -1) {
          files.splice(i, 1)
          // break
        }
      }
      return files
    },
    setValueFile(files, idx, objValue) {
      files[idx].dinh_kem_file = 1
      // files[this.lenTLKTHS].ma_file = ''
      files[idx].ten_file = objValue.raw.name
      files[idx].loai_file = objValue.raw.type
      files[idx].ly_do_khong_dinh_kem = ''
      files[idx].giay_to_khac = this.formAddEdit.giay_to_khac
      files[idx].file_size = objValue.raw.size
      files[idx].uid = objValue.raw.uid
    },
    async downloadFile(attachment) {
      const param = { maFile: attachment.ma_file }
      await apiFactory
        .download(
          ConstantAPI['DOWNLOAD'].ATTACHMENT,
          attachment.ten_file,
          param,
          this
        )
        .catch(err => {
          errAlert(this, err)
        })
    },
    async onShowReport() {
      const param = { id: this.formAddEdit.id_phieu_yeu_cau }
      this.buttonPrintPdfLoading = true
      this.pdfSource = ''
      this.titleDialogPrint = 'In phiếu yêu cầu phân tích phân loại'
      await apiFactory
        .showReport(
          ConstantAPI['DOWNLOAD'].PRINT_PHIEU_YC,
          param,
          this
        )
        .then(rs => {
          this.pdfSource = rs
          this.showPrint = true
          this.buttonPrintPdfLoading = false
        })
        .catch(err => {
          this.showPrint = true
          this.buttonPrintPdfLoading = false
          errAlert(this, err)
        })
    },
    async onPrintPhieuYeuCau() {
      this.buttonPrintLoading = true
      const param = { id: this.formAddEdit.id_phieu_yeu_cau }
      await apiFactory
        .download(
          ConstantAPI['DOWNLOAD'].PRINT_PHIEU_YC,
          PHIEU_YC_PRINT_FILE_NAME,
          param,
          this
        )
        .then(() => {
          this.buttonPrintLoading = false
        })
        .catch(err => {
          this.buttonPrintLoading = false
          errAlert(this, err)
        })
    },
    async getHoSoDAndFilesByIdHS(idHS) {
      this.loadDataTable = true
      const param = { id: idHS }
      await apiFactory
      apiFactory
        .callAPI(ConstantAPI['HOSO'].SEARCH_HOSOD_FILES, {}, param)
        .then(rs => {
          this.loadDataTable = false
          this.lstDataKBBK = rs.details

          const files = []

          let len = 0
          // Them list File
          const filesTmp = rs.files
          if (filesTmp !== undefined && filesTmp !== null) {
            let i = 0
            len = filesTmp.length
            while (i < len) {
              files.push(this.snakeCaseToCamelCaseDeep(filesTmp[i]))
              i++
            }
          }
          this.lstAttachment = files
        })
        .catch(err => {
          this.loadDataTable = false
          errAlert(this, err)
        })
    },
    changeSelectHQEdit(code) {
      this.formAddEdit.ma_cuakhau_nhap = ''
      this.formAddEdit.ma_diadiem_dohang = ''
    },
    changeSelectNguoiKhaiYCLayLaiMau(code) {
      if (code === 1) this.isNguoiKhaiYcLayMau = true
      else this.isNguoiKhaiYcLayMau = false
      setTimeout(() => {
        this.$refs['formAddEdit'].validate(valid => {
          return
        })
      }, 100)
    },
    showHideBtnUpdateInGrid(rowData) {
      if (STATUS_ROW_UPDATE.indexOf(rowData.ma_trang_thai) > -1) return true
      return false
    },
    showHideBtnDeleteInGrid(rowData) {
      if (STATUS_ROW_DELETE.indexOf(rowData.ma_trang_thai) > -1) return true
      return false
    },
    showBtnLoading(bol) {
      switch (this.buttonAction) {
        case ACTION_MODE.INSERT:
          this.buttonSaveLoading = bol
          break
        case ACTION_MODE.UPDATE:
          this.buttonUpdateLoading = bol
          break
        case ACTION_MODE.SEND: {
          this.buttonSendLoading = bol
          if (!bol) {
            this.buttonAction = ACTION_MODE.DEFAULT
          }
        }
      }
      if (!bol) {
        this.buttonSaveLoading = bol
        this.buttonUpdateLoading = bol
        this.buttonSendLoading = bol
      }
    },
    hideShowUserPTPL() {
      if (this.formAddEdit.loai_phe_duyet === PHE_DUYET_THU_CONG) {
        this.isPheDuyetThuCong = true
      } else {
        this.formSearch.user_phan_loai = ''
        this.formSearch.user_phan_tich = ''
        this.isPheDuyetThuCong = false
        this.$refs.chuyenVienPhanLoaiRef.onClear()
        this.$refs.chuyenVienPhanTichRef.onClear()
        setTimeout(() => {
          this.$refs['formAddEdit'].validate(valid => {
            return
          })
        }, 100)
      }
    },
    getMaChuyenVienPhanTichPhanLoai(choose) {
      this.$store.state[
        'common'
      ].listCommonData.danhSachChuyenVienPhanTichPhanLoai.forEach(
        chuyenVien => {
          if (choose === chuyenVien.user_name) {
            choose = chuyenVien.ho_ten
          }
        }
      )
      return choose
    },
    getMaTrangThaiPhieuYeuCauSelected(choose) {
      if (choose > 5) {
        choose = 5
      }
      this.statusReceiveSelect.forEach(item => {
        if (Number(choose) === item.key) {
          choose = item.value
        }
      })
      return choose
    },
    getListDataLoaiPheDuyet(lstValue) {
      this.lstLoaiPheDuyet = lstValue
    },
    getMaLoaiPheDuyetSelected(choose) {
      this.lstLoaiPheDuyet.forEach(loai => {
        if (Number(choose) === loai.key) {
          choose = loai.label
        }
      })
      return choose
    },
    getMaLoaiHinhXnkSelected(choose) {
      this.$store.state['common'].listCommonData.danhSachLoaiHinhXNK.forEach(
        loaiHinh => {
          if (choose === loaiHinh.code) {
            choose = loaiHinh.name
          }
        }
      )
      return choose
    },
    showHideTemplate() {
      this.showDlgTemplate = !this.showDlgTemplate
    },
    fillTemplate(rowData) {
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }
      const arrDK = [undefined, null, '']
      let len = 0
      if (arrDK.indexOf(this.$refs.uploadTLKTHS) === -1) {
        len = this.$refs.uploadTLKTHS.length
        while (len--) {
          this.$refs.uploadTLKTHS[len].clearFiles()
        }
      }

      if (this.$refs.uploadGTK) {
        this.$refs.uploadGTK.clearFiles()
      }

      this.isNguoiUyQuyen = false
      this.tabIndex = '0'
      this.isPrint = false
      this.lstAttachment = []
      this.lstAttachmentGroup = []
      this.fileListUpload = []
      this.fileListDelete = []
      this.fileListKBBK = []
      this.isHiddenInput = false
      this.isHidenGuiHoSo = false
      this.disableWhenEdit = true
      // this.hideColumnTinhTrang(false)
      const param = {
        id: rowData.id_phieu_yeu_cau
      }
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM_BY_ID, {}, param)
        .then(rs => {
          console.log(4234)
          console.log(this.flagShowDialog)
          console.log(this.isHidenGuiHoSo)
          this.preEditDetails(rs)
          this.formAddEdit.ma_trang_thai = 1
          this.formAddEdit.id = 0
          this.formAddEdit.id_phieu_yeu_cau = 0
          this.formAddEdit.so_phieu_yeu_cau = ''
          // this.formAddEdit.ngay_lap = getCurrentDateNoTime()
          this.formAddEdit.ngay_gui_yeu_cau = ''
          this.formAddEdit.ngay_thuc_hien_ptpl = ''
          this.formAddEdit.so_phieu_tiep_nhan_ptpl = ''
          this.formAddEdit.so_luong_mau_tiep_nhan_ptpl = ''
          this.formAddEdit.luu_y_ptpl = ''
          this.formAddEdit.ly_do_ptpl = ''
          this.formAddEdit.nguoi_giao_ptpl = ''
          this.formAddEdit.nguoi_tiep_nhan_ptpl = ''
          // thông tin tiếp nhận
          this.formAddEdit.status_pyc = null
          this.formAddEdit.luu_yptpl = ''
          this.formAddEdit.ngay_tiep_nhan = ''
          this.formAddEdit.giam_dinh_ben_ngoai = null
          this.formAddEdit.ngay_bo_sung_ho_so = ''
          this.formAddEdit.updated_date = ''
          this.formAddEdit.updated_user = ''
          this.formAddEdit.id_quyet_dinh_huy_mau = null
          this.formAddEdit.phuong_phap_huy = null
          // thông tin phê duyệt
          this.formAddEdit.loai_phe_duyet = null
          this.formAddEdit.so_phan_cong = ''
          this.formAddEdit.ngay_phan_cong = null
          this.formAddEdit.noi_dung = ''
          this.formAddEdit.user_phan_cong = ''
          this.formAddEdit.user_phan_tich = ''
          this.formAddEdit.user_phan_loai = ''
          this.formAddEdit.ten_user_phan_cong = ''
          this.formAddEdit.ten_user_phan_tich = ''
          this.formAddEdit.ten_user_phan_loai = ''
          this.formAddEdit.loai_dieu_chinh = null
          this.formAddEdit.so_dieu_chinh = ''
          this.flagShowDialog = FORM_MODE.CREATE
          this.isHidenGuiHoSo = false
          this.showHideBtnSend()
          this.iconEditLoading = false
          this.isShowDlgAddEdit = true
          this.isTemplate = true
          this.showHideTemplate()
        })
        .catch(() => {
          this.iconEditLoading = false
          showAlert(this, WARNING, 'Bản ghi không tồn tại trên hệ thống')
        })
    }
  }
}
