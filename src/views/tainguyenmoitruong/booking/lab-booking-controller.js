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
import TrangThaiBooking from '../../../components/BaseFormCustoms/TrangThaiBooking'
import SelectYesNo from '../../../components/CommonComponent/SelectYesNo'
import SelectMasterData from '../../../components/CommonComponent/SelectMasterData'
import SelectTrangThai from "../../../components/CommonComponent/SelectTrangThai";
import SelectThietBi from '../../../components/CommonComponent/SelectThietBi'
import SelectDungCu from '../../../components/CommonComponent/SelectDungCu'
import SelectHoaChat from '../../../components/CommonComponent/SelectHoaChat'
import checkPermissionShowButton from 'ff24-js/src/utils/ECustomsUtils'
import DateRangePicker from 'ff24-customs-lib/src/components/DateRangePicker'
import EditableCell from '../../../components/CommonComponent/EditableCell'
import { getToken } from "ff24-js/src/utils/authCookie";

import {
  validateFileExtension,
  maxFileSize,
  checkIsValidFileSize,
  getNameByIdOnGrid,
  showConfirmCustom,
  getCurrentDateNoTime,
  getDateStringHoursMinutes,
  LIST_CUSTOMS
} from '../../../utils/ECustomsUtils'
import { formatFullDate_VN,formatFullDateHour_VN,formatFullDateTime_VN } from '../../../filters/index'
import { FORM_MODE } from '../../../utils/Constant'
// import XLSX from 'xlsx'
import _ from 'lodash'
import { ref } from 'vue'
import { faL } from '@fortawesome/free-solid-svg-icons'

const MENU_CODE_API = 'BOOKING'


const LOAI_NGUOI_KHAI_UQ = 'NDUY'
const MASTER_DATA_DVT = 'DVT'
const MASTER_DATA_LAB_DEPARTMENT = 'LAB_DEPARTMENT'
const GUI_PHIEU_YC = 2
const PHIEU_YC_PRINT_FILE_NAME = 'PhieuYeuCauPtpl.pdf'
const ACTION_MODE = { DEFAULT: 0, INSERT: 1, UPDATE: 2, SEND: 3 }
const STATUS_MODE = { DEFAULT: '1', NEW: '1', APPROVE: '2', CONFIRM: '3', UNAPPROVE: '4' }
const TAI_LIEU_KHAC = 99
const PHE_DUYET_THU_CONG = 3
const STATUS_BTN_SEND = [1, 3]
const STATUS_ROW_APPROVE = ['1']
const STATUS_ROW_CONFIRM = ['2']
const STATUS_ROW_REFUSE = ['1']
const STATUS_ROW_UPDATE = ['1']
const STATUS_ROW_DELETE = [1]
const LIMIT_UPLOAD_FILE = 15

const CACULATE_INTERVAL = 30 * 10000;

let caculateInterval;

export default {
  components: {
    TrangThaiRecord,
    TrangThaiBooking,
    DateRangePicker,
    SelectMasterData,
    SelectTrangThai,
    SelectThietBi,
    SelectDungCu,
    SelectHoaChat,
    EditableCell
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
      findName: '',
      findDepartment: '',
      quocTichLblWidth: '150px',
      dvtLblWidth: '150px',
      titleDialog: '',
      titleDialogLab: '',
      titleDialogLabList: '',
      titleDialogConfirmQuantity: '',
      titleDialogPrint: '',
      loading: false,
      isPrint: false,
      showPrint: false,
      buttonPrintPdfLoading: false,
      pdfSource: '',
      isShowDlgAddEdit: false,
      isShowDlgPTN: false,
      isShowDlgListLab: false,
      isShowDlgLabHistory: false,
      isShowDlgConfirmQuantity: false,
      isTemplate: false,
      iconApproveLabLoading: false,
      iconEditLabLoading: false,
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
      masterTypeLabDepartment: MASTER_DATA_LAB_DEPARTMENT,
      windowHeight: screen.height,
      paramHis: {},
      // Trang thai tiep nhan YCPTPL
      lstPurpose: [
        { key: 'GIANG_DAY', value: 'Giảng dạy' },
        { key: 'NGHIEN_CUU_KH', value: 'Nghiên cứu khoa học' },
        { key: 'KHOA_LUAN_TN', value: 'Khóa luận tốt nghiệp' },
        { key: 'THUC_TAP', value: 'Thực tập' },
        { key: 'THUC_HANH', value: 'Thực hành' }
      ],
      lstTaiLieuKemTheo: [],
      radioValue: null,
      lenTLKTHS: 0,
      currentTLKTHS: {},
      currentIndex: -1,
      lstDVT: [],
      lstKhoaThiNghiem: [],
      excelData: [],
      statusSelect: [
        { key: 1, value: this.$t('baseLabel.labelActive') },
        { key: 0, value: this.$t('baseLabel.labelDeActive') }
      ],
      tabIndex: '',
      // formSearch: new KeySearchListObj(),
      formSearch: {
        fromToDate: [],
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
      formSearchLab: {
        fromToDate: [],
        code: '',
        name: '',
        status: null,
        page: null,
        size: null
      },
      formSearchLabList: {
        fromToDate: [],
        id: 0,
        code: '',
        name: '',
        status: null,
        page: null,
        size: null
      },
      formSearchLabHistory: {
        fromToDate: [],
        id: 0,
        code: '',
        name: '',
        status: null,
        page: null,
        size: null
      },
      caculateBookingLab: {
        busy: 0,
        empty: 0,
        registration: 0,
        lstBusyId: []
      },
      fileListUpload: [],
      fileListDelete: [],
      lstAttachment: [],
      lstAttachmentGroup: [],
      fileListKBBK: [],
      isDownload: true,
      lstCauHoi: [],
      lstTB: [],
      lstDC: [],
      lstHC: [],
      currentLab: null,
      currentLabBooking: null,
      formAddEdit: {
        id: 0,
        labName: '', 
        department: '',
        description: '',
        status: null
      },
      formAddEditPTN: {
        labId: 0,
        bookingId: 0,
        labName: '', 
        department: '',
        status: null,
        purpose: '',
        targets: '',
        className: '',
        groupStudents: '',
        lessonName: '',
        pic: '',
        session: '',
        bookingDate: null,        
        bookingDateTo: '',
        startTime: '',
        endTime: '',
        bookingUser: '',
        createdAt: null,
        approvedBy: '',
        approvedAt: null,
        phoneNumber: ''
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
      minDateBooking: {
        disabledDate(date) {
          const dt = new Date()
          const y = dt.getFullYear()
          const m = dt.getMonth()
          const d = dt.getDate()
          
					return date < new Date(y, m, d);
				},
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
      ruleLabDepartment: [this.requiredRule('Khoa')],
      rules: {
        labName: [this.requiredRule('Tên phòng')],        
        resourceType: [this.requiredRule('Loại hóa chất')],
        origin: [this.requiredRule('Xuất xứ')],
        storageLocation: [this.requiredRule('Khu lưu trữ')],
        quantity: [this.requiredRule('Số lượng'), this.validateRegex('^[0-9\.]*$', "Số lượng")],
        quantityWarning: [this.requiredRule('Số lượng cảnh báo'),this.validateRegex('^[0-9\.]*$',"Số lượng cảnh báo")]
      },
      isLessonNameRequired: false,
      rulesFormPTN: {
        bookingUser: [this.requiredRule('Mã cán bộ')],        
        phoneNumber: [this.requiredRule('Số điện thoại'),this.validateRegex('^[0-9\+]*$',"Số điện thoại")],
        department: [this.requiredRule('Khoa')],
        email: [this.requiredRule('email'),{
          type: "email",
          message: "Email không đúng định dạng",
          trigger: "blur",
        }],
        bookingDate: [this.requiredRule('Ngày bắt đầu')],
        bookingDateTo: [this.requiredRule('Ngày kết thúc')],
        startTime: [this.requiredRule('Giờ')],
        pic: [this.requiredRule('Giảng viên')],
        lessonName: [this.requiredRule('Đề tài')],
        purpose: [this.requiredRule('Mục đích')],
        
        quantity: [this.requiredRule('Số lượng'), this.validateRegex('^[0-9\.]*$', "Số lượng")],
        quantityWarning: [this.requiredRule('Số lượng cảnh báo'),this.validateRegex('^[0-9\.]*$',"Số lượng cảnh báo")]
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
      totalKBBK: 0,
      totalTB: 0,
      totalDC: 0,
      totalHC: 0,
      pageFix: 0,
      sizeFix: 5000,
      objHis: {},
      formLoading: false,
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
          prop: 'labName',
          label: 'Tên phòng',
          width: '150',
          align: 'center',
          sortable: true,
          //filters: [{ text: "test", value: "246" }],
          // columnKey: "labName",
          // renderHeader: this.renderHeader,
          show: true
        },
        {
          prop: 'description',
          label: 'Mô tả',
          width: '150',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'department',
          label: 'Khoa',
          width: '170',
          align: 'left',
          sortable: true,
          formatter: row => {
            return getNameByIdOnGrid(
              row.department,
              'propertyValue',
              'propertyName',
              this.lstKhoaThiNghiem
            )
          },
          // columnKey: "department",
          // renderHeader: this.renderHeader,
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
      columnsLab: [
        {
          prop: 'bookingUser',
          label: 'Người đăng ký',
          width: '120',
          align: 'left',
          sortable: true,
          //filters: [{ text: "test", value: "246" }],
          // columnKey: "labName",
          // renderHeader: this.renderHeader,
          show: true
        },
        {
          prop: 'email',
          label: 'Email',
          width: '150',
          align: 'center',
          sortable: true,
          //filters: [{ text: "test", value: "246" }],
          // columnKey: "labName",
          // renderHeader: this.renderHeader,
          show: true
        },
        {
          prop: 'pic',
          label: 'Giảng viên',
          width: '150',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'bookingDate',
          label: 'Thời gian bắt đầu',
          width: '150',
          align: 'center',
          sortable: true,
          formatter: row => {
            return formatFullDateHour_VN(new Date(row.bookingDate))
          },
          show: true
        },
        {
          prop: 'bookingDateTo',
          label: 'Thời gian kết thúc',
          width: '150',
          align: 'center',
          sortable: true,
          formatter: row => {
            return formatFullDateHour_VN(new Date(row.bookingDateTo))
          },
          show: true
        },
        
        {
          prop: 'purpose',
          label: 'Mục đích',
          width: '150',
          align: 'left',
          sortable: true, 
          formatter: row => {
            return getNameByIdOnGrid(
              row.purpose,
              'key',
              'value',
              this.lstPurpose
            )
          },
          show: true
        },
        {
					prop: "status",
					label: "Trạng thái",
					width: "120",
					align: "center",
					formatter: TrangThaiBooking,
					show: true,
					sortable: true,
				}      
      ],
      columnsLabHis: [
        {
          prop: 'labName',
          label: 'Tên phòng',
          width: '120',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'bookingUser',
          label: 'Người đăng ký',
          width: '120',
          align: 'left',
          sortable: true,
          //filters: [{ text: "test", value: "246" }],
          // columnKey: "labName",
          // renderHeader: this.renderHeader,
          show: true
        },
        {
          prop: 'email',
          label: 'Email',
          width: '150',
          align: 'center',
          sortable: true,
          //filters: [{ text: "test", value: "246" }],
          // columnKey: "labName",
          // renderHeader: this.renderHeader,
          show: true
        },
        {
          prop: 'pic',
          label: 'Giảng viên',
          width: '150',
          align: 'left',
          sortable: true,
          show: true
        },
        {
          prop: 'bookingDate',
          label: 'Thời gian bắt đầu',
          width: '150',
          align: 'center',
          sortable: true,
          formatter: row => {
            return formatFullDateHour_VN(new Date(row.bookingDate))
          },
          show: true
        },
        {
          prop: 'bookingDateTo',
          label: 'Thời gian kết thúc',
          width: '150',
          align: 'center',
          sortable: true,
          formatter: row => {
            return formatFullDateHour_VN(new Date(row.bookingDateTo))
          },
          show: true
        },
        
        {
          prop: 'purpose',
          label: 'Mục đích',
          width: '150',
          align: 'left',
          sortable: true, 
          formatter: row => {
            return getNameByIdOnGrid(
              row.purpose,
              'key',
              'value',
              this.lstPurpose
            )
          },
          show: true
        },
        {
					prop: "status",
					label: "Trạng thái",
					width: "120",
					align: "center",
					formatter: TrangThaiBooking,
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
          align: 'left',
          sortable: true,          
          show: true
        },
        {
          prop: 'actualQuantityUsed',
          label: 'Số lượng thực tế sử dụng',
          width: '150',
          align: 'left',
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
          align: 'left',
          sortable: true,          
          show: true
        },
        {
          prop: 'actualQuantityUsed',
          label: 'Số lượng thực tế sử dụng',
          width: '150',
          align: 'left',
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
          align: 'left',
          sortable: true,          
          show: true
        },
        {
          prop: 'actualQuantityUsed',
          label: 'Số lượng thực tế sử dụng',
          width: '150',
          align: 'left',
          sortable: true,          
          show: true
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
    dataFilter() {     
        return this.listDataTable
    },
    rulesPTN() {
      return {
        lessonName: [
          {
            required: this.isLessonNameRequired,
            message: 'Đề tài bắt buộc nhập',
            trigger: 'change'
          }
        ],
        bookingUser: this.rulesFormPTN.bookingUser,
        phoneNumber: this.rulesFormPTN.phoneNumber,
        department: this.rulesFormPTN.department,
        email: this.rulesFormPTN.email,
        bookingDate: this.rulesFormPTN.bookingDate,
        bookingDateTo: this.rulesFormPTN.bookingDateTo,
        startTime: this.rulesFormPTN.startTime,
        pic: this.rulesFormPTN.pic,
        purpose: this.rulesFormPTN.purpose,
        quantity: this.rulesFormPTN.quantity
      }
    }
  },
  mounted() {
    this.onLoadLab()
    this.onCaculateBookingLab();
      caculateInterval = setInterval(() => {
        if (!getToken()) {
          clearInterval(caculateInterval);
          return;
        }
        this.onCaculateBookingLab();
      }, CACULATE_INTERVAL);
    
    this.formSearch.maHqTiepNhan = '_'.concat(this.$store.getters.userInfo.org)
    this.windowHeight = screen.height
    this.loading = false
    this.joinNameByCodeColumnExcel = this.getListJoinNameByCodeColumnExcel()
    // this.formSearch.maHq = this.$refs.selectHQ.listMaHq[0].code
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
    getfilterNameItem() {
      let apiArr = [
        
        { text: " ", value: " " },
        { text: " ", value: " " },
        { text: " ", value: " " },
        { text: " ", value: " " },
      ];
      return apiArr;
    },
    //Filter header
    setFindName(evt) {
      this.findName = evt.target.value;
      this.filterHeaderDataTable();
    },
    setFindNameVModel(evt) {
      console.log("evt vModel")
      console.log(evt)
      //this.findName = evt.target.value;
      this.filterHeaderDataTable();
    },
    setFindDepartment(evt) {
      this.findDepartment = evt.target.value
      this.filterHeaderDataTable();
    },
    filterHeaderDataTable() {
      const name = this.findName;
      const department = this.findDepartment;
      const arrDK = [undefined, null, ''];
      //this.$refs.tblMain.listDataTable 
      this.listDataTable = this.listDataTableClone.filter(row => 
        (arrDK.indexOf(name) > -1 || row.labName.toLowerCase().indexOf(name.toLowerCase()) > -1)
          &&
          (arrDK.indexOf(department) > -1 || row.department.toLowerCase().indexOf(department.toLowerCase()) > -1)
      );
    },
    renderHeader(h, { column, $index }) {
      //console.log("column render")
      //console.log(column)
      //console.log($index)
      if (column.columnKey === 'labName') {
        // return (
        //   <input type="text" placeholder="Tên phòng" value={this.findName} on-input={this.setFindName} />
        // );
        return (
          <el-input placeholder="Please input" v-model={this.findName} onInput={this.setFindNameVModel}></el-input>
        );
      }
      else if (column.columnKey === 'department') {
        return (
          <input type="text" placeholder="Khoa"  value={this.findDepartment} on-input={this.setFindDepartment} />
        );
      }
      
    },    
    getClassBooking(lab) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(this.caculateBookingLab.lstBusyId)  === -1 && this.caculateBookingLab.lstBusyId.indexOf(lab.id) > -1){
        return 'bg-busy'
      }
      else if (arrDK.indexOf(lab.bookingQuantity) === -1 && lab.bookingQuantity > 0) {
        return 'bg-registration'
      }
      else {
        return 'bg-normal'
      }      
    },


    showBookingList(lab) {
      const name = this.findName;
      const arrDK = [undefined, null, ''];
      this.currentLab = lab
      this.titleDialogLabList = 'Danh sách đặt phòng'.concat(' - ', lab.labName);
      this.isShowDlgListLab = true;
      this.formSearchLabList.id = lab.id;
      this.formSearchLabList.page = 0
      this.formSearchLabList.size = 5000  //this.$refs.tblMainLab.size 
      // showAlert(
      //   this,
      //   WARNING,
      //   'Chức năng đặt phòng đang được phát triển!'
      // );
      // return false
      
      /*
<div>
          <el-input onBlur={this.showBookingList} />
        </div>
      */
      // if (!this.lstTaiLieuKemTheo.length) {
      // //   this.loading = true <input type="text" on-blur={this.showBookingList} />
      this.loadDataTableLab = true
      apiFactory
        .callAPI(
          ConstantAPI[MENU_CODE_API].SELECT_ITEM_LAB,
          {},
          this.formSearchLabList
        )
        .then(rs => {
          // const content = this.createContentNotifyBookings();
          // showAlert(this, SUCCESS, content, 6000, true);
          this.loadDataTableLab = false
          this.listDataTableLab = rs.result          
          // console.log(rs)
        })
        .catch(err => {
          errAlert(this, err)
          this.loadDataTableLab = false
        })
      // }
    },
    showBookingHistory() {
      const arrDK = [undefined, null, ''];
      this.titleDialogLabHistory = 'Lịch sử đặt phòng';
      this.isShowDlgLabHistory = true;
      this.formSearchLabHistory.page = 0
      this.formSearchLabHistory.size = 5000  //this.$refs.tblMainLab.size 
      // showAlert(
      //   this,
      //   WARNING,
      //   'Chức năng đặt phòng đang được phát triển!'
      // );
      // return false
      
      this.loadDataTableLab = true
      apiFactory
        .callAPI(
          ConstantAPI[MENU_CODE_API].SEARCH_HISTORY,
          {},
          this.formSearchLabHistory
        )
        .then(rs => {
          // const content = this.createContentNotifyBookings();
          // showAlert(this, SUCCESS, content, 6000, true);
          this.loadDataTableLab = false
          this.listDataTableLabHis = rs.result   
          let arrLab = []
          for (const lab of this.listDataTableLabHis) {
            arrLab = this.lstLab.filter(obj => obj.id === lab.labId)
            if (arrLab.length > 0) {
              lab.labName = arrLab[0].labName
            }
            
          }
          
          arrLab[0]
          // console.log(rs)
        })
        .catch(err => {
          errAlert(this, err)
          this.loadDataTableLab = false
        })
      // }
    },
    closeHistory() {
      this.isShowDlgLabHistory = false;
      this.listDataTableLabHis = []
    },
    labRegistration(item) {
      this.isShowDlgPTN = true;
      this.flagShowDialog = FORM_MODE.CREATE
      this.titleDialogLab = 'Đăng ký phòng thí nghiệm'.concat(' - ', item.labName);
      this.isHiddenInput =false
      this.formAddEditPTN.labId = item.id;
      this.formAddEditPTN.labName = item.labName
      this.formAddEditPTN.bookingUser = this.$store.getters.userInfo.uid;
      this.formAddEditPTN.email = this.$store.getters.userInfo.ema;
      this.formAddEditPTN.department = 'KHOA_MOI_TRUONG';
      
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
          objRow.labBookingId = this.formAddEditPTN.labId
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
          objRow.labBookingId = this.formAddEditPTN.labId
          console.log(objRow);
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
          objRow.labBookingId = this.formAddEditPTN.labId
          console.log(objRow);
          this.listDataTableHC.push(objRow);
        } 
      })      
    },
    onDeleteHC(row) {
      this.listDataTableHC = this.listDataTableHC.filter(obj => obj !== row);
    },
    changeRadioPurpose(code) {
      console.log(code +'--'+this.isLessonNameRequired)
      if (code === 'NGHIEN_CUU_KH' || code === 'KHOA_LUAN_TN' ) this.isLessonNameRequired = true
      else this.isLessonNameRequired = false
      
      setTimeout(() => {
        this.$refs['formAddEditPTN'].validate(valid => {
          return
        })
      }, 200)
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
    onLoadLab() {
      this.formLoading = true
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].LOAD_LAB, {}, {})
        .then(rs => {
          this.formLoading = false
          this.lstLab = rs
          this.lstLab.sort((a, b) => (a.labName > b.labName) ? 1 : -1)
          // console.log(rs)
          this.total = rs['totalElements']
          // console.log(this.total)
        })
        .catch(err => {
          this.formLoading = false
          this.listDataTable = []
          errAlert(this, err)
        })
    },
    onCaculateBookingLab() {
      //this.formLoading = true
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].CACULATE_BOOKING_LAB, {}, {})
        .then(rs => {
          // this.formLoading = false
          this.caculateBookingLab = rs
          // console.log(rs)
          // console.log(this.total)
        })
        .catch(err => {
          // this.formLoading = false
          errAlert(this, err)
        })
    },
    onSearch(mode) {
      
      //this.$refs.tblMain.resetPage()
      // this.formSearch.page = 0
      this.formSearchLab.page = mode === '' ? 0 : this.formSearchLab.page
      this.formSearchLab.size = this.$refs.tblMain.size
      this.loadDataTable = true
      const fromToDate = this.formSearch.fromToDate
      // Custom properties KeySearchObj API        
      this.formSearch.fromDate = fromToDate[0]
      this.formSearch.toDate = fromToDate[1]
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SEARCH, {}, this.formSearchLab)
        .then(rs => {
          this.loadDataTable = false
          this.listDataTable = rs.result
          this.listDataTableClone = rs.result
          // console.log(rs)
          this.total = rs['totalElements']
          // console.log(this.total)
        })
        .catch(err => {
          this.loadDataTable = false
          this.listDataTable = []
          errAlert(this, err)
        })
      

    },
    onSearchListLab() {
      const s =""
    },
    onSearchTB() {
      const s =""
    },
    onSearchDC() {
      const s =""
    },
    onSearchHC() {
      const s =""
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
          .callAPI(
            ConstantAPI[MENU_CODE_API].INSERT,
            this.formAddEdit
          )
          .then(rs => {
            showAlert(this, SUCCESS, 'Thêm mới thành công!')
            this.buttonSaveLoading = false
            this.onSearch('')
            // this.isShowDlgAddEdit = false
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
          .callAPI(
            ConstantAPI[MENU_CODE_API].UPDATE,
            this.formAddEdit
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Cập nhật thành công!')
            this.buttonUpdateLoading = false
            this.onSearch('')
            // this.isShowDlgAddEdit = false
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.response.data.message)
            this.buttonUpdateLoading = false
            this.isShowDlgAddEdit = true
          })
      })
    },

    onDelete(row) {      
      showConfirmDelete(this.$confirm, () => {
        const param = {
          id: row.id
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
            showAlert(this, ERROR, 'Lỗi! ' + err.response.data.message)
          })
      })
    },
    onInsertPTN(formName) {
      
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }

        this.formAddEditPTN.status = STATUS_MODE.NEW
        const formPTNModel = this.formAddEditPTN
        formPTNModel.deviceBookings = this.listDataTableTB
        formPTNModel.toolBookings = this.listDataTableDC
        formPTNModel.resourceBookings = this.listDataTableHC

        this.buttonSaveLoading = true
        apiFactory
          .callAPI(
            ConstantAPI[MENU_CODE_API].INSERT_PTN,
            formPTNModel
          )
          .then(rs => {
            const content = this.createContentNotifyBookings();
            showAlert(this, SUCCESS, content, 6000, true);
            this.buttonSaveLoading = false
            this.onLoadLab()
            this.onCaculateBookingLab()
            this.$emit("refreshCount");
            this.isShowDlgPTN = false
            // console.log(rs)
          })
          .catch(err => {
            errAlert(this, err)
            this.buttonSaveLoading = false
            this.isShowDlgAddEdit = false
          })
      })
    },
    createContentNotifyBookings() {
      const strContent = `Đặt phòng thành công! <p>Thông tin phòng: <b>`+this.formAddEditPTN.labName+`</b></p><p>Thời gian: <b>`+getDateStringHoursMinutes(this.formAddEditPTN.bookingDate)+ ' - ' +getDateStringHoursMinutes(this.formAddEditPTN.bookingDateTo) + `</b></p>`
      return strContent;
    },
    createContentNotifyBookingsApprove(row, status) {
      let strContent = 'Phê duyệt đặt phòng thành công!'
      if (status === STATUS_MODE.UNAPPROVE) {
        strContent = 'Từ chối đặt phòng thành công!'
      }
      strContent += ` <p>Thông tin phòng: <b>`+this.currentLab.labName+`</b></p><p>Thời gian: <b>`+getDateStringHoursMinutes(new Date(row.bookingDate))+ ' - ' +getDateStringHoursMinutes(new Date(row.bookingDateTo)) + `</b></p>`
      return strContent;
    },
    onPreEditLab(row) {
      if (this.$refs.formAddEditPTN) {
        this.$refs.formAddEditPTN.resetFields()
      }
      const arrDK = [undefined, null, '']
     
      this.listDataTableTB = []
      this.listDataTableDC = []
      this.listDataTableHC =[]
      this.tabIndex = '0'
      this.isHiddenInput = false
      this.flagShowDialog = FORM_MODE.EDIT
      this.isShowDlgPTN = true;
      this.titleDialogLab = 'Đăng ký phòng thí nghiệm'.concat(' - ', this.currentLab.labName);
      this.formAddEditPTN = row
      this.formAddEditPTN.department = this.currentLab.department
      row.deviceBookings.forEach(obj => obj['unit'] = 'TB')
      this.listDataTableTB = row.deviceBookings
      this.listDataTableDC = row.toolBookings
      this.listDataTableHC =row.resourceBookings
    },
    onApproveLabBooking(row) {
      showConfirmCustom(
        this.$confirm,
        'Bạn có chắc chắn muốn Phê duyệt phiếu đặt phòng này?',
        () => {
          this.iconApproveLabLoading = true
          row.labName = this.currentLab.labName
        apiFactory
          .callAPI(
            ConstantAPI[MENU_CODE_API].APPROVE_PTN,
            row
          )
          .then(rs => {
            const content = this.createContentNotifyBookingsApprove(rs, STATUS_MODE.APPROVE);
            showAlert(this, SUCCESS, content, 6000, true);
            this.iconApproveLabLoading = false
            row.status = STATUS_MODE.APPROVE
            // this.onLoadLab()
            this.$emit("refreshCount");
            this.onCaculateBookingLab()
            //this.isShowDlgPTN = false
            // console.log(rs)
          })
          .catch(err => {
            errAlert(this, err)
            this.iconApproveLabLoading = false
            //this.isShowDlgAddEdit = false
          })
        },
        'Xác nhận'
      )
    },
    onShowConfirmQuantity(row) {
      this.currentLabBooking =row
      row.deviceBookings.forEach(obj => obj['unit'] = 'TB')
      this.listDataTableTB = row.deviceBookings
      this.listDataTableDC = row.toolBookings
      this.listDataTableHC = row.resourceBookings
      this.listDataTableTB = this.listDataTableTB.map(row => {
        row.actualQuantityUsed = row.quantity
        return {
          ...row,
          editMode: true
        };
      });
      this.listDataTableDC = this.listDataTableDC.map(row => {
        row.actualQuantityUsed = row.quantity
        return {
          ...row,
          editMode: true
        };
      });
      this.listDataTableHC = this.listDataTableHC.map(row => {
        row.actualQuantityUsed = row.quantity
        return {
          ...row,
          editMode: true
        };
      });
      this.titleDialogConfirmQuantity = 'Xác nhận số lượng sử dụng trong phòng thí nghiệm'.concat(' - ', this.currentLab.labName);
      this.isShowDlgConfirmQuantity = true;            
    },
    setEditMode(row, index) {
      row.editMode = true;
    },
    saveRow(row, index) {
      row.editMode = false;
    },
    onConfirmQuantityBooking(form) {      
      const regex = new RegExp('(([0-9.])|([0-9].[0-9]))$')
     
      for (const obj of this.listDataTableTB) {
        if (!regex.test(obj.actualQuantityUsed.toString())) {
          showAlert(this, WARNING, 'Số lượng thiết bị thực tế sử dụng không hợp lệ')
          return false
        }
      }
      for (const obj of this.listDataTableDC) {
        if (!regex.test(obj.actualQuantityUsed.toString())) {
          showAlert(this, WARNING, 'Số lượng dụng cụ thực tế sử dụng không hợp lệ')
          return false
        }
      }
      for (const obj of this.listDataTableHC) {
        if (!regex.test(obj.actualQuantityUsed.toString())) {
          showAlert(this, WARNING, 'Số lượng hóa chất thực tế sử dụng không hợp lệ')
          return false
        }
      }

      const formConfirmModel = this.currentLabBooking
      formConfirmModel.labName = this.currentLab.labName
      formConfirmModel.deviceBookings = this.listDataTableTB
      formConfirmModel.toolBookings = this.listDataTableDC
      formConfirmModel.resourceBookings = this.listDataTableHC
      
      showConfirmCustom(
        this.$confirm,
        'Bạn có chắc chắn xác nhận thông tin các số lượng thực tế sử dụng này?',
        () => {
          this.buttonSaveLoading = true
        apiFactory
          .callAPI(
            ConstantAPI[MENU_CODE_API].CONFIRM_QUANTITY_PTN,
            formConfirmModel
          )
          .then(rs => {
            const content = "Xác nhận thông tin thành công";
            showAlert(this, SUCCESS, content, 4000, true);
            this.buttonSaveLoading = false
            this.currentLabBooking.status = STATUS_MODE.CONFIRM
            this.isShowDlgConfirmQuantity = false;
            this.$emit("refreshCount");
            this.onCaculateBookingLab()
            //this.isShowDlgPTN = false
          })
          .catch(err => {
            errAlert(this, err)
            this.buttonSaveLoading = false
            this.isShowDlgConfirmQuantity = false;
            //this.isShowDlgAddEdit = false
          })
        },
        'Xác nhận'
      )
    },
    onRefuseLabBooking(row) {
      showConfirmCustom(
        this.$confirm,
        'Bạn có chắc chắn muốn Từ chối phê duyệt phiếu đặt phòng này?',
        () => {
          this.iconDelLoading = true
          row.labName = this.currentLab.labName
        apiFactory
          .callAPI(
            ConstantAPI[MENU_CODE_API].UNAPPROVE_PTN,
            row
          )
          .then(rs => {
            const content = this.createContentNotifyBookingsApprove(rs,STATUS_MODE.UNAPPROVE);
            showAlert(this, SUCCESS, content, 6000, true);
            this.iconDelLoading = false
            row.status = STATUS_MODE.UNAPPROVE
            //this.onLoadLab()
            this.$emit("refreshCount");
            this.onCaculateBookingLab()
            //this.isShowDlgPTN = false
            // console.log(rs)
          })
          .catch(err => {
            errAlert(this, err)
            this.iconDelLoading = false
            //this.isShowDlgAddEdit = false
          })
        },
        'Xác nhận'
      )
    },
    showHideBtnApproveInGrid(rowData) {
      if (STATUS_ROW_APPROVE.indexOf(rowData.status) > -1) return true
      return false
    },
    showHideBtnConfirmInGrid(rowData) {
      if (STATUS_ROW_CONFIRM.indexOf(rowData.status) > -1) return true
      return false
    },
    showHideBtnRefuseInGrid(rowData) {
      if (STATUS_ROW_REFUSE.indexOf(rowData.status) > -1) return true
      return false
    },
    resetForm(formName) {
      this.resetFrm(formName)
      this.listDataTable = []
      this.lstAttachment = []
      this.lstAttachmentGroup = []
      this.fileListUpload = []
      this.total = 0
      //this.resetDateSearch()
      
      this.onLoadLab()
      // Reset Component
      this.formSearch.maLoaiNguoiKhai = ''
      this.formSearch.maPtvt = ''
      this.formSearch.maDiaDiemDoHang = ''
      this.formSearch.maCuaKhauNhap = ''
    },
    resetFormPTN(formName) {
      this.resetFrm(formName)
      this.isShowDlgPTN = false;
      // this.listDataTable = []
      // this.lstAttachment = []
      // this.lstAttachmentGroup = []
      // this.fileListUpload = []
      // this.total = 0
      // //this.resetDateSearch()
      
      // //this.onLoadLab()
      // // Reset Component
      // this.formSearch.maLoaiNguoiKhai = ''
      // this.formSearch.maPtvt = ''
      // this.formSearch.maDiaDiemDoHang = ''
      // this.formSearch.maCuaKhauNhap = ''
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
      //showAlert(this, WARNING, 'Test')
      this.tabIndex = '0'
      this.isPrint = false
      this.isHiddenInput = false
      this.isHidenGuiHoSo = false
      this.titleDialog = 'Cập nhật Phòng thí nghiệm'
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
      
      this.formAddEdit.id = 0
      this.formAddEdit.labName = ''
      this.formAddEdit.department = ''
      this.formAddEdit.status = '1'
      setTimeout(() => {
        this.onSearch('')
      }, 1000);
      
    },
    onPrepareEdit(row) {
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }
      const arrDK = [undefined, null, '']
     
      this.tabIndex = '0'
      this.isPrint = false
      this.isHiddenInput = false
      this.disableWhenEdit = true
      this.flagShowDialog = FORM_MODE.EDIT
      this.iconEditLoading = false

      this.formAddEdit.id = row.id;
      this.formAddEdit.labName = row.labName;
      this.formAddEdit.department = row.department;
      this.formAddEdit.description = row.description;
      this.formAddEdit.status = row.status;

    },
    preEditDetails(rs) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(rs) === -1) {
        this.formAddEdit = rs
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
      if (this.$refs.formAddEditPTN) {
        this.$refs.formAddEditPTN.resetFields()
      }
      this.listDataTableTB = []
      this.listDataTableDC = []
      this.listDataTableHC =[]
      this.tabIndex = '0'
      this.isHiddenInput = true
      this.flagShowDialog = FORM_MODE.VIEW
      this.isShowDlgPTN = true;
      this.titleDialogLab = 'Đăng ký phòng thí nghiệm'.concat(' - ', this.currentLab.labName);
      this.formAddEditPTN = row
      this.formAddEditPTN.department = this.currentLab.department
      row.deviceBookings.forEach(obj => obj['unit'] = 'TB')
      this.listDataTableTB = row.deviceBookings
      this.listDataTableDC = row.toolBookings
      this.listDataTableHC =row.resourceBookings
      // this.formAddEditPTN.status = STATUS_MODE.NEW
      //   const formPTNModel = this.formAddEditPTN
      //   formPTNModel.deviceBookings = this.listDataTableTB
      //   formPTNModel.toolBookings = this.listDataTableDC
      // formPTNModel.resourceBookings = this.listDataTableHC

     
      // const param = {
      //   code: row.resourceCode
      // }
      // this.iconViewLoading = true
      // apiFactory
      //   .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, param)
      //   .then(rs => {
      //     this.viewDetails(rs)
      //     this.disableAppCodeModeEdit = true;
      //   })
    },
    onViewHistory(row) {
      
      // this.formAddEditPTN.status = STATUS_MODE.NEW
      //   const formPTNModel = this.formAddEditPTN
      //   formPTNModel.deviceBookings = this.listDataTableTB
      //   formPTNModel.toolBookings = this.listDataTableDC
      // formPTNModel.resourceBookings = this.listDataTableHC

     
      const param = {
        id: row.bookingId
      }
      this.iconViewLoading = true
      apiFactory
        .callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM_BOOKING, {}, param)
        .then(rs => {
          this.iconViewLoading = false
          if (this.$refs.formAddEditPTN) {
            this.$refs.formAddEditPTN.resetFields()
          }
          this.listDataTableTB = []
          this.listDataTableDC = []
          this.listDataTableHC =[]
          this.tabIndex = '0'
          this.isHiddenInput = true
          this.flagShowDialog = FORM_MODE.VIEW
          this.isShowDlgPTN = true;
          const arrLab = this.lstLab.filter(obj => obj.id ===rs.labId)
          this.titleDialogLab = 'Đăng ký phòng thí nghiệm'.concat(' - ', arrLab[0].labName);
          this.formAddEditPTN = rs
          this.formAddEditPTN.department = arrLab[0].department
          rs.deviceBookings.forEach(obj => obj['unit'] = 'TB')
          this.listDataTableTB = rs.deviceBookings
          this.listDataTableDC = rs.toolBookings
          this.listDataTableHC =rs.resourceBookings
        })
        .catch(err => {
          errAlert(this, err)
          this.iconViewLoading = false
          //this.isShowDlgAddEdit = false
        })
    },
    viewDetails(rs) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(rs) === -1) {
        // console.log(rs)
        this.formAddEdit = rs
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
    getListMasterData(lstValue) {
      this.lstDVT = lstValue.filter(obj => obj.type === MASTER_DATA_DVT);
      this.lstKhoaThiNghiem = lstValue.filter(obj => obj.type === MASTER_DATA_LAB_DEPARTMENT);
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
      // if (
      //   arrDK.indexOf(row.ma_trang_thai) === -1 &&
      //   row.ma_trang_thai === 3
      // ) {
      //   const now = getCurrentDateNoTime()
      //   if (arrDK.indexOf(row.ngay_bo_sung_ho_so) === -1 && (new Date(row.ngay_bo_sung_ho_so)) < now) {
      //     return 'warning-row'
      //   }
      // }
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
