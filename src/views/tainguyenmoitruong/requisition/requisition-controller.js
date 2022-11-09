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
import TrangThaiDeXuatMuaSam from '../../../components/BaseFormCustoms/TrangThaiDeXuatMuaSam'
import SelectYesNo from '../../../components/CommonComponent/SelectYesNo'
import SelectMasterData from '../../../components/CommonComponent/SelectMasterData'
import SelectTrangThai from "../../../components/CommonComponent/SelectTrangThai";
import SelectThietBi from '../../../components/CommonComponent/SelectThietBi'
import SelectDungCu from '../../../components/CommonComponent/SelectDungCu'
import SelectHoaChat from '../../../components/CommonComponent/SelectHoaChat'
import SelectTrangThaiDeXuatMuaSam from "../../../components/CommonComponent/SelectTrangThaiDeXuatMuaSam";
import checkPermissionShowButton from 'ff24-js/src/utils/ECustomsUtils'
import DateRangePicker from 'ff24-customs-lib/src/components/DateRangePicker'

import {
  validateFileExtension,
  isImage,
  getFileExtension,
  allowedImages,
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
import { ref } from 'vue'

const MENU_CODE_API = 'REQUISITION'


const LOAI_NGUOI_KHAI_UQ = 'NDUY'
const MASTER_DATA_DVT = 'DVT'
const MASTER_DATA_ORIGIN = 'ORIGIN'
const GUI_PHIEU_YC = 2
const ACTION_MODE = { DEFAULT: 0, INSERT: 1, UPDATE: 2, SEND: 3 }
const TAI_LIEU_KHAC = 99
const PHE_DUYET_THU_CONG = 3
const STATUS_BTN_APPROVE = ['1', '3']
const STATUS_BTN_REFUSE = ['1']
const STATUS_ROW_UPDATE =['1', '3'] 
const STATUS_ROW_DELETE = ['1']
const LIMIT_UPLOAD_FILE = 15

export default {
  components: {
    TrangThaiRecord,
    DateRangePicker,
    SelectMasterData,
    SelectTrangThai,
    SelectTrangThaiDeXuatMuaSam,
    TrangThaiDeXuatMuaSam,
    SelectThietBi,
    SelectDungCu,
    SelectHoaChat,
    //SelectYesNo,
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
      activeCollapseName: ['1'],
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
      buttonApproveLoading: false,
      buttonSaveLoading: false,
      buttonRefuseLoading: false,
      buttonAction: ACTION_MODE.DEFAULT,
      iconDelLoading: false,
      buttonPrintLoading: false,
      iconShowKBBKLoading: false,
      flagShowDialog: FORM_MODE.DEFAULT,
      showDlgTemplate: false,
      showDlgHistory: false,
      buttonTemplateLoading: false,
      disableAppCodeModeEdit: false,
      disabled: false,
      masterType: MASTER_DATA_DVT,
      masterTypeOrigin: MASTER_DATA_ORIGIN,
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
      lstXuatXu: [],
      excelData: [],
      statusSelect: [
        { key: 1, value: this.$t('baseLabel.labelActive') },
        { key: 0, value: this.$t('baseLabel.labelDeActive') }
      ],
      tabIndex: '',
      // formSearch: new KeySearchListObj(),
      formSearch: {
        fromToDate: [],
        requestor: '',
        subject: '',
        status: '',
        page: 0,
        size: 20
      },
      dialogImageUrl: '',
      dialogImgPreview: false,
      dialogFileExt:'',
      fileListUpload: [],
      fileListDelete: [],
      lstAttachment: [],
      lstAttachmentGroup: [],
      fileListKBBK: [],
      isNguoiKhaiYcLayMau: false,
      isDownload: true,
      lstCauHoi: [],
      lstTB: [],
      lstDC: [],
      lstHC: [],
      formAddEditPTN: {
        id: 0,
        resourceId: 0,
        resourceCode: '',
        resourceName: '',        
        createdAt: null,
        resourceType: '',
        quantity: 0,
        quantityWarning: 0,
        unit: '',
        origin: '',
        storageLocation: '',
        image: '',
        description: '',
        createdBy: '',
        giay_to_khac: '',
        fileDinhKem: '',
        lstFileDelete: '',
        is_change_detail: false,
        status: null,
        version: null,
        is_latest: null
      },
      formAddEdit: {
        requisitionId: 0,
        requestor: '', 
        subject: '',
        status: null,
        requestedDate: null,  
        createdBy: '',
        createdAt: null,
        approvedBy: '',
        approvedAt: null,
        phoneNumber: '',
        createdName: '',
        approvedName: '',
        lstFileDelete: []
      },
      formTB: {
        id: 0,
        deviceId: null,
        device: null,
        deviceCode: '',
        deviceName: '', 
        unit: 'TB',
        quantity: 0,
        labBookingId: 0,
        bookingUser: '',
        bookingDate: null,
        createdAt: null,
        status: null
      },
      formDC: {
        id: 0,
        toolId: null,
        toolCode: '',
        toolName: '', 
        unit: '',
        quantity: 0,
        labBookingId: 0,
        bookingUser: '',
        bookingDate: null,
        createdAt: null,
        status: null
      },
      formHC: {
        id: 0,
        resourceId: null,
        resourceCode: '',
        resourceName: '', 
        unit: '',
        quantity: 0,
        labBookingId: 0,
        bookingUser: '',
        bookingDate: null,
        createdAt: null,
        status: null
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
      ruleOrigin: [this.requiredRule('Xuất xứ')],
      rules: {
        requestor: [
          this.requiredRule('Người đề xuất')
        ],
        createdAt: [this.requiredRule('Ngày tạo')],
        subject: [this.requiredRule('Tên đề xuất')],        
        phoneNumber: [this.requiredRule('Số điện thoại'),this.validateRegex('^[0-9\+]*$',"Số điện thoại")],
        email: [this.requiredRule('Email')]
      },
      rulesTB: {
        deviceId: [this.requiredRule('Thiết bị')],
        toolId: [this.requiredRule('Dụng cụ')],
        resourceId: [this.requiredRule('Hóa chất')],
        unit: [this.requiredRule('Đơn vị tính')],
        quantity: [this.requiredRule('Số lượng'), this.validateRegex('^[0-9\.]*$', "Số lượng")],
      },
      disableWhenEdit: false,
      isHiddenInput: false,
      isHidenGuiHoSo: false,
      total: 0,
      totalTB: 0,
      totalDC: 0,
      totalHC: 0,
      pageFix: 0,
      sizeFix: 5000,
      lstLab:[],
      listDataTable: [],
      listDataTableLab: [],
      listDataTableLabHis: [],
      listDataTableClone: [],
      listDataTableTB: [],
      listDataTableDC: [],
      listDataTableHC: [],
      loadDataTable: false,
      loadDataTableLab: false,
      loadDataTableTB: false,
      loadDataTableDC: false,
      loadDataTableHC: false,
      joinNameByCodeColumnExcel: [],
      columns: [
        {
          prop: 'requestor',
          label: 'Người đề xuất',
          width: '150',
          align: 'center',
          sortable: true,
          show: true
        },
        {
          prop: 'subject',
          label: 'Tên đề xuất',
          width: '170',
          align: 'left',
          sortable: true,
          show: true
        },          
        {
          prop: 'requestedDate',
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
					formatter: TrangThaiDeXuatMuaSam,
					show: true,
					sortable: true,
				}      
      ],
      columnsTB: [
        {
          prop: 'deviceName',
          label: 'Tên thiết bị',
          width: '150',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'unit',
          label: 'Đơn vị tính',
          width: '100',
          align: 'center',
          sortable: true,
          formatter: row => {
            return getNameByIdOnGrid(
              row.unit,
              'propertyValue',
              'propertyName',
              this.lstDVT
            )
          },
          show: true
        },
        {
          prop: 'quantity',
          label: 'Số lượng',
          width: '100',
          align: 'right',
          sortable: true,          
          show: true
        }
      ],
      columnsDC: [
        {
          prop: 'toolName',
          label: 'Tên dụng cụ',
          width: '150',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'unit',
          label: 'Đơn vị tính',
          width: '100',
          align: 'center',
          sortable: true,
          formatter: row => {
            return getNameByIdOnGrid(
              row.unit,
              'propertyValue',
              'propertyName',
              this.lstDVT
            )
          },
          show: true
        },
        {
          prop: 'quantity',
          label: 'Số lượng',
          width: '100',
          align: 'right',
          sortable: true,          
          show: true
        }
      ],
      columnsHC: [
        {
          prop: 'resourceName',
          label: 'Tên hóa chất',
          width: '150',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'unit',
          label: 'Đơn vị tính',
          width: '100',
          align: 'center',
          sortable: true,
          formatter: row => {
            return getNameByIdOnGrid(
              row.unit,
              'propertyValue',
              'propertyName',
              this.lstDVT
            )
          },
          show: true
        },
        {
          prop: 'quantity',
          label: 'Số lượng',
          width: '100',
          align: 'right',
          sortable: true,          
          show: true
        }
      ],
      getFileExtension,
      MENU_CODE_API,
      FORM_MODE,
      STATUS_ROW_UPDATE,
      LIMIT_UPLOAD_FILE
    }
  },
  created() {
    this.loading = true
  },
  computed: {    
  },
  mounted() {
    //this.resetDateSearch()
    this.formSearch.maHqTiepNhan = '_'.concat(this.$store.getters.userInfo.org)
    this.windowHeight = screen.height
    this.loading = false
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
    checkIsImage(file) {
      let fileExt = getFileExtension(file)
      fileExt = '.'.concat(fileExt)
      if (allowedImages.indexOf(fileExt) > -1) {
        return true
      }
      return false

    },        
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      
      const ext = getFileExtension(file)
      this.dialogFileExt = ext
      if (ext === 'pdf') {
        this.dialogImageUrl = file.url
          //require('@/assets/icon/pdf.png')
      }
      else if (ext === 'doc' || ext === 'docx') {
        this.dialogImageUrl = require('@/assets/icon/word.png')
      }
      else if (ext === 'xls' || ext === 'xlsx') {
        this.dialogImageUrl = require('@/assets/icon/excel.png')
      }
      else if (ext === 'ppt' || ext === 'pptx') {
        this.dialogImageUrl = require('@/assets/icon/ppt.png')
      }
      else if (ext === 'zip' || ext === 'rar') {
        this.dialogImageUrl = require('@/assets/icon/zip.png')
      }
      else if(this.checkIsImage(file)){
        this.dialogImageUrl = file.url;
      }
      else {
        this.dialogImageUrl = require('@/assets/icon/zip.png')
      }
      
      this.dialogImgPreview = true;
    },
    handleDownload(file) {
      const fileLink = document.createElement('a')
      fileLink.href = file.url
      const fileName = file.name || file.fileName
        fileLink.setAttribute('download', fileName)
        document.body.appendChild(fileLink)
        fileLink.click()
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
          .callAPI(ConstantAPI[MENU_CODE_API].SEARCH, {},this.formSearch)
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
        const formModel = this.getModelByForm()
        formModel.requisitionDetails = []
        this.listDataTableTB.forEach(obj => {
          formModel.requisitionDetails.push(obj)
        })
        this.listDataTableDC.forEach(obj => {
          formModel.requisitionDetails.push(obj)
        })
        this.listDataTableHC.forEach(obj => {
          formModel.requisitionDetails.push(obj)
        })
        // formModel.requisitionDetails.concat(this.listDataTableTB,this.listDataTableDC,this.listDataTableHC)
        apiFactory
          .callAPIFormFile(
            ConstantAPI[MENU_CODE_API].INSERT,
            formModel,
            this.fileListUpload
          )
          .then(rs => {
            showAlert(this, SUCCESS, 'Thêm mới thành công!')
            this.buttonSaveLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
            this.$emit("refreshCount");
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
        const formModel = this.getModelByForm()
        formModel.requisitionDetails = []
        this.listDataTableTB.forEach(obj => {
          formModel.requisitionDetails.push(obj)
        })
        this.listDataTableDC.forEach(obj => {
          formModel.requisitionDetails.push(obj)
        })
        this.listDataTableHC.forEach(obj => {
          formModel.requisitionDetails.push(obj)
        })
        apiFactory
          .callAPIFormFile(
            ConstantAPI[MENU_CODE_API].UPDATE,
            formModel,
            this.fileListUpload
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Cập nhật thành công!')
            this.buttonUpdateLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
            this.$emit("refreshCount");
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.message)
            this.buttonUpdateLoading = false
            this.isShowDlgAddEdit = true
          })
      })
    },

    onApprove(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        showConfirmCustom(
          this.$confirm,
          'Bạn có chắc chắn xác nhận Phê duyệt đề xuất này?',
          () => {
          
        this.buttonApproveLoading = true
        const formModel = this.getModelByForm()
        apiFactory
          .callAPIFormFile(
            ConstantAPI[MENU_CODE_API].APPROVE,
            formModel,
            this.fileListUpload
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Phê duyệt thành công!')
            this.buttonApproveLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
            this.$emit("refreshCount");
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.message)
            this.buttonApproveLoading = false
            this.isShowDlgAddEdit = true
          })
        },
        'Xác nhận'
      )
      })
    },
    onRefuse(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }

        showConfirmCustom(
          this.$confirm,
          'Bạn có chắc chắn xác nhận Từ chối phê duyệt đề xuất này?',
          () => {
        this.buttonRefuseLoading = true
        const formModel = this.getModelByForm()        
        apiFactory
          .callAPIFormFile(
            ConstantAPI[MENU_CODE_API].REFUSE,
            formModel,
            this.fileListUpload
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Từ chối phê duyệt thành công!')
            this.buttonRefuseLoading = false
            this.onSearch('')
            this.isShowDlgAddEdit = false
            this.$emit("refreshCount");
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.message)
            this.buttonRefuseLoading = false
            this.isShowDlgAddEdit = true
          })
        },
        'Xác nhận'
      )
      })
    },

    onDelete(row) {      
      showConfirmDelete(this.$confirm, () => {
        const param = {
          requisitionId: row.requisitionId
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
    getListTB(lstValue) {
      this.lstTB = lstValue;
    },
    getListDC(lstValue) {
      this.lstDC = lstValue;
    },
    getListHC(lstValue) {
      this.lstHC = lstValue;
    },
    onInsertTB() {
      this.$refs["formTB"].validate(valid => {
        if (!valid) {
          return false
        }
        const arrDK = [undefined, null, ''];
        const lstTmp = this.listDataTableTB.filter(obj => obj.deviceId === this.formTB.deviceId);
        if (arrDK.indexOf(lstTmp) === -1 && lstTmp.length >0) {
          showAlert(
            this,
            WARNING,
            'Thiết bị đã được thêm vào danh sách'
          )
          return false
        }
        
        const lstFilter = this.lstTB.filter(obj => obj.deviceId === this.formTB.deviceId);
        if (arrDK.indexOf(lstFilter) === -1 && lstFilter.length >0) {
          const objRow = lstFilter[0];
          objRow["unit"] = 'TB';
          objRow.quantity = this.formTB.quantity;
          objRow.requisitionId = this.formAddEdit.requisitionId
          objRow.requestedQuantity = this.formTB.quantity;
          objRow.code = this.formTB.deviceId
          objRow.name = objRow.deviceName
          objRow.type ="DMTB"
          this.listDataTableTB.push(objRow);
        } 
      })      
    },
    onDeleteTB(row) {
      this.listDataTableTB = this.listDataTableTB.filter(obj => obj !== row);
    },
    onInsertDC() {
      this.$refs["formDC"].validate(valid => {
        if (!valid) {
          return false
        }
        const arrDK = [undefined, null, ''];
        const lstTmp = this.listDataTableDC.filter(obj => obj.toolId === this.formDC.toolId);
        if (arrDK.indexOf(lstTmp) === -1 && lstTmp.length >0) {
          showAlert(
            this,
            WARNING,
            'Dụng cụ đã được thêm vào danh sách'
          )
          return false
        }
        const lstFilter = this.lstDC.filter(obj => obj.toolId === this.formDC.toolId);
        if (arrDK.indexOf(lstFilter) === -1 && lstFilter.length >0) {
          const objRow = lstFilter[0];
          objRow["unit"] = this.formDC.unit;
          objRow.quantity = this.formDC.quantity;
          objRow.requisitionId = this.formAddEdit.requisitionId
          objRow.requestedQuantity = this.formDC.quantity;
          objRow.code = this.formDC.toolId
          objRow.name = objRow.toolName
          objRow.type ="DMDC"
          this.listDataTableDC.push(objRow);
        } 
      })      
    },
    onDeleteDC(row) {
      this.listDataTableDC = this.listDataTableDC.filter(obj => obj !== row);
    },
    onInsertHC() {
      this.$refs["formHC"].validate(valid => {
        if (!valid) {
          return false
        }
        const arrDK = [undefined, null, ''];
        const lstTmp = this.listDataTableHC.filter(obj => obj.resourceId === this.formHC.resourceId);
        if (arrDK.indexOf(lstTmp) === -1 && lstTmp.length >0) {
          showAlert(
            this,
            WARNING,
            'Hóa chất đã được thêm vào danh sách'
          )
          return false
        }
        const lstFilter = this.lstHC.filter(obj => obj.resourceId === this.formHC.resourceId);
        if (arrDK.indexOf(lstFilter) === -1 && lstFilter.length >0) {
          const objRow = lstFilter[0];
          objRow["unit"] = this.formHC.unit;
          objRow.quantity = this.formHC.quantity;
          objRow.requisitionId = this.formAddEdit.requisitionId
          objRow.requestedQuantity = this.formHC.quantity;
          objRow.code = this.formHC.resourceId
          objRow.name = objRow.resourceName
          objRow.type ="DMHC"
          this.listDataTableHC.push(objRow);
        } 
      })      
    },
    onDeleteHC(row) {
      this.listDataTableHC = this.listDataTableHC.filter(obj => obj !== row);
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
      //this.resetDateSearch()

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
      this.titleDialog = 'Thêm mới Đề xuất mua sắm'
      this.flagShowDialog = FORM_MODE.CREATE
      this.isShowDlgAddEdit = true
      this.disableWhenEdit = false
      this.disableAppCodeModeEdit = false;
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }

      const arrDK = [undefined, null, '']
      let len = 0
      
      if (this.$refs.uploadGTK) {
        this.$refs.uploadGTK.clearFiles()
      }

      this.listDataTableTB = []
      this.listDataTableDC = []
      this.listDataTableHC = []
      this.fileListUpload = []
      this.fileListDelete = []

      this.formAddEdit.id = 0
      this.formAddEdit.requisitionId = 0
      this.formAddEdit.requestor = this.$store.getters.userInfo.ufn
      this.formAddEdit.createdAt = getCurrentDateNoTime()
      this.formAddEdit.email = this.$store.getters.userInfo.ema
      this.formAddEdit.subject = ''
      this.formAddEdit.phoneNumber = ''
      this.formAddEdit.createdBy = this.$store.getters.userInfo.uid
      this.formAddEdit.approvedBy = ''      
      this.formAddEdit.approvedAt = null
      this.formAddEdit.createdName = this.$store.getters.userInfo.ufn
      this.formAddEdit.approvedName = ''
      this.formAddEdit.requisitionDetails = []      
      this.formAddEdit.status = '1'
    },
    onPrepareEdit(row) {
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
      this.listDataTableTB = []
      this.listDataTableDC = []
      this.listDataTableHC = []
      this.fileListUpload = []
      this.fileListDelete = []
      this.isHiddenInput = false
      this.isHidenGuiHoSo = false
      this.disableWhenEdit = true
      this.titleDialog = 'Cập nhật Đề xuất mua sắm'
      this.flagShowDialog = FORM_MODE.EDIT
      this.iconEditLoading = true
      // this.hideColumnTinhTrang(false)
      const param = {
        id: row.requisitionId
      }
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, param)
        .then(rs => {
          this.preEditDetails(rs)
          // this.showHideBtnSend()
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
      if (this.$refs.formTB) {
        this.$refs.formTB.resetFields()
      }
      if (this.$refs.formDC) {
        this.$refs.formDC.resetFields()
      }
      if (this.$refs.formHC) {
        this.$refs.formHC.resetFields()
      }
      if (arrDK.indexOf(rs) === -1) {
        this.formAddEdit = rs
        if (arrDK.indexOf(rs.files) === -1) {
          for (const file of rs.files) {
            file.url = ''.concat('data:',file.contentType,';base64,',file.fileData)
          }          
        }
        this.listDataTableTB = rs.requisitionDetails.filter(obj => obj.type === 'DMTB')
        this.listDataTableTB.forEach(obj => {
          obj.deviceId = obj.code
          obj.deviceName = obj.name
          obj.quantity = obj.requestedQuantity
        })

        this.listDataTableDC = rs.requisitionDetails.filter(obj => obj.type === 'DMDC')
        this.listDataTableDC.forEach(obj => {
          obj.toolId = obj.code
          obj.toolName = obj.name
          obj.quantity = obj.requestedQuantity
        })

        this.listDataTableHC = rs.requisitionDetails.filter(obj => obj.type === 'DMHC')
        this.listDataTableHC.forEach(obj => {
          obj.resourceId = obj.code
          obj.resourceName = obj.name
          obj.quantity = obj.requestedQuantity
        })
        this.fileListUpload = rs.files

        this.formAddEdit.quantity = '' + this.formAddEdit.quantity;
        this.formAddEdit.quantityWarning = '' + this.formAddEdit.quantityWarning;
        
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
    checkPreApprove() {
      if (STATUS_BTN_APPROVE.indexOf(this.formAddEdit.status) > -1) {
        return true
      }
      return false
    },
    checkPreRefuse() {
      if (STATUS_BTN_REFUSE.indexOf(this.formAddEdit.status) > -1) {
        return true
      }
      return false
    },
    onView(row) {
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }

      this.tabIndex = '0'
      this.listDataTableTB = []
      this.listDataTableDC = []
      this.listDataTableHC = []
      this.fileListUpload = []
      this.fileListDelete = []
      this.isHiddenInput = true
      this.flagShowDialog = FORM_MODE.VIEW
      this.isPrint = true
      this.titleDialog = 'Chi tiết Đề xuất mua sắm'
      if (this.$refs.uploadTLKTHS !== undefined && this.$refs.uploadTLKTHS !== null) {
        for (const objUpload of this.$refs.uploadTLKTHS) {
          objUpload.clearFiles()
        }
        this.$refs.uploadGTK.clearFiles()
      }

      const param = {
        id: row.requisitionId
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
      if (this.$refs.formTB) {
        this.$refs.formTB.resetFields()
      }
      if (this.$refs.formDC) {
        this.$refs.formDC.resetFields()
      }
      if (this.$refs.formHC) {
        this.$refs.formHC.resetFields()
      }
      
      if (arrDK.indexOf(rs) === -1) {
        // console.log(rs)
        this.formAddEdit = rs
        if (arrDK.indexOf(rs.files) === -1) {
          for (const file of rs.files) {
            file.url = ''.concat('data:',file.contentType,';base64,',file.fileData)
          }          
        }
        
        this.listDataTableTB = rs.requisitionDetails.filter(obj => obj.type === 'DMTB')
        this.listDataTableTB.forEach(obj => {
          obj.deviceId = obj.code
          obj.deviceName = obj.name
          obj.quantity = obj.requestedQuantity
        })

        this.listDataTableDC = rs.requisitionDetails.filter(obj => obj.type === 'DMDC')
        this.listDataTableDC.forEach(obj => {
          obj.toolId = obj.code
          obj.toolName = obj.name
          obj.quantity = obj.requestedQuantity
        })

        this.listDataTableHC = rs.requisitionDetails.filter(obj => obj.type === 'DMHC')
        this.listDataTableHC.forEach(obj => {
          obj.resourceId = obj.code
          obj.resourceName = obj.name
          obj.quantity = obj.requestedQuantity
        })
        this.fileListUpload = rs.files
        
        this.formAddEdit.quantity = '' + this.formAddEdit.quantity
        this.formAddEdit.quantityWarning = '' + this.formAddEdit.quantityWarning
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
    
    // Processing method when exceeding the maximum number of uploaded files
    handleExceedFile(files, fileList) {
      const idx = this.currentIndex
      let bol = false
      if (files.length > LIMIT_UPLOAD_FILE) {
        bol = true
      } else {    
        if ((files.length + fileList.length) > LIMIT_UPLOAD_FILE) {
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
    handleChangeFile(file, fileList) {
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
          // file.idxTlkths = this.currentIndex
          // file size, uidFile
          this.fileListUpload.push(file)
          // console.log(this.fileListUpload)
        }
      } else {
        showAlert(this, WARNING, 'Bạn hãy chọn file cần upload')
      }
    },
    // How to remove files
    handleRemoveFile(file, fileList) {
      this.fileListDelete.push(file.id)
      let lstFile = this.fileListUpload
      lstFile = lstFile.filter(obj => obj !== file)
      this.fileListUpload = lstFile
      // console.log(this.fileListUpload)
      this.fileTemp = null
    },  
    initFileBase() {
      const objTL = {}
      objTL.id = ''
      objTL.idReference = 0
      objTL.fileName = ''
      objTL.contentType = ''
      objTL.fileSize = 0
      objTL.fileData = null
      objTL.functionCode = MENU_CODE_API      
      objTL.uid = 0
      return objTL
    },
    getModelByForm() {
      let objModel = {}
      const arrDK =[undefined, null, '']
      this.formAddEdit.lstFileDelete = this.fileListDelete.join(',')

      const master = this.formAddEdit

      let files = []
      let i = 0
      let len = 0

      const filesTmp = this.fileListUpload.filter(obj => arrDK.indexOf(obj.idReference) > -1 || obj.idReference === 0)
      for (const fileUp of filesTmp) {
        const objFile = this.initFileBase()
        objFile.fileName = fileUp.raw.name
        objFile.contentType = fileUp.raw.type
        objFile.file_size = fileUp.raw.size
        objFile.uid = fileUp.raw.uid
  
        files.push(objFile)
      }
      
      objModel = master
      objModel.files = files

      return objModel
    },
    // initFileBase() {
    //   const objTL = {}
    //   objTL.id = ''
    //   objTL.reference = 0
    //   objTL.fileName = ''
    //   objTL.fileType = ''
    //   objTL.fileSize = 0
    //   objTL.content = null
    //   objTL.functionCode = MENU_CODE_API      
    //   objTL.uid = 0
    //   return objTL
    // },
    // getModelByForm() {
    //   let objModel = {}
    //   const arrDK =[undefined, null, '']
    //   this.formAddEdit.lstFileDelete = this.fileListDelete.join(',')
    //   // console.log(this.formAddEdit.ngay_den_cuakhau_dukien)

    //   const master = this.formAddEdit

    //   let files = []
    //   let i = 0
    //   let len = 0

    //   const filesTmp = this.fileListUpload.filter(obj => arrDK.indexOf(obj.reference) > -1 || obj.reference === 0)
    //   for (const fileUp of filesTmp) {
    //     const objFile = this.initFileBase()
    //     objFile.fileName = fileUp.raw.name
    //     objFile.contentType = fileUp.raw.type
    //     objFile.fileSize = fileUp.raw.size
    //     objFile.uid = fileUp.raw.uid
  
    //     files.push(objFile)
    //   }
      
    //   objModel = master
    //   objModel.files = files

    //   return objModel
    // },
    
    getListDataDVT(lstValue) {
      this.lstDVT = lstValue.filter(obj => obj.type === MASTER_DATA_DVT);
      this.lstXuatXu = lstValue.filter(obj => obj.type === MASTER_DATA_ORIGIN);
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
    
    showHideBtnUpdateInGrid(rowData) {
      if (STATUS_ROW_UPDATE.indexOf(rowData.status) > -1) return true
      return false
    },
    showHideBtnDeleteInGrid(rowData) {
      if (STATUS_ROW_DELETE.indexOf(rowData.status) > -1) return true
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
  }
}
