import { errAlert, showAlert, showConfirmDelete, SUCCESS } from 'ff24-js/src/utils/AlertMessage';
import { APP_CODE, FORM_MODE, LIST_LV_CUSTOM, PAGINATION_PARAM, VALIDATE_CODE } from '@/utils/Constant'
import apiFactory from '@/api/apiFactory'
import Pagination from 'ff24-customs-lib/src/components/Pagination'
import SelectMaHq from 'ff24-customs-lib/src/lib-components/BaseFormCustoms/SelectListMaHq'
// import SelectListApp from '@/components/BaseFormCustoms/SelectListApplication'
import ConstantAPI from '@/utils/ConstantAPI'
import { filterByKeyAndValue, getCapMaHq, getTenHqByMa } from '@/utils/ECustomsUtils'
import checkPermissionShowButton from 'ff24-js/src/utils/ECustomsUtils.js'
import SelectTrangThai from "../../../../components/CommonComponent/SelectTrangThai";
import TrangThaiRecord from "../../../../components/BaseFormCustoms/TrangThaiRecord";


const MENU_CODE_API = "QLNND";

export default {
  components: {
    Pagination,
    SelectMaHq,
    SelectTrangThai,
    TrangThaiRecord
  },
  data() {
    const STATUS = {
      ACTIVE: '1',
      UNACTIVE: '0'
    }
    return {
      ConstantAPI,
      HEADER_LABEL: 'NHÓM NGƯỜI DÙNG',
      FORM_MODE,
			MENU_CODE_API,
      formSearch: {
        appCode: '',
        groupCode: '',
        orgCode: '',
        name: '',
        status: '',
        page: PAGINATION_PARAM.page,
        size: PAGINATION_PARAM.size
      },
      total: 0,
      listGroup: [],
      loadDataTable: false,
      loadingUpdate: false,
      isHiddenInput: false,
      listDataTable: [],
			columns: [
				{
					prop: "roleId",
					label: "Mã nhóm",
					width: "130",
					show: true,
					sortable: true,
				},
				{
					prop: "description",
					label: "Tên nhóm",
					width: "150",
					show: true,
					sortable: true,
				},
				{
					prop: "status",
					label: "Trạng thái",
					width: "100",
					align: "center",
					formatter: TrangThaiRecord,
					show: true,
					sortable: true,
				},
			],
      flagShowDialog: FORM_MODE.DEFAULT,
      formAddEdit: {
        appCode: '',
        orgCode: '',
        groupCode: '',
        roleId: '',
        name: '',
        description: '',
        status: STATUS.ACTIVE
      },
      titleDialog: '',
      ruleSearch: {
        groupCode: [
          VALIDATE_CODE
        ]
      },
      rulesAddEdit: {
        roleId: [
          { required: true, message: 'Mã nhóm bắt buộc nhập' },
          {
            pattern: '^[a-zA-Z0-9_.-]+$',
            message: `Chỉ chấp nhận những ký tự [a-z] [A-Z] [0-9] - _ .`
          }
        ],
        orgCode: [
          { required: true, message: 'Mã Hải quan bắt buộc chọn' }
        ],
        appCode: [
          { required: true, message: 'Mã ứng dụng bắt buộc chọn' }
        ],
        description: [
          { required: true, message: 'Tên nhóm bắt buộc nhập' }
        ]
      },
      rulesPermission: {
        appCode: [{ required: true, message: 'Mã ứng dụng bắt buộc chọn' }]
      },
      disableAppCodeModeEdit: false,
      statusSelect: [
        { key: 1, value: 'Kích hoạt' },
        { key: 0, value: 'Hủy kích hoạt' }
      ],
      isShowAddEditDlg: false,
      listPermission: [],
      formUpdatePermission: {
        appCode: '',
        levelUsed: ''
      },
      formUserPermis: {
        appCode: '',
        groupCode: '',
        orgCode: ''
      },
      isShowPermissionDlg: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loadPermissionTree: false,
      objParamPermissionUpdate: {
        appCode: '',
        roleId: '',
        lstMenuCode: [],
        status: 1,
        groupCode: '',
        orgCode: ''
      },
      filterText: '',
      listCheckedPermission: [],
      listUnChecked: [],
      isShowDlgGroupPermission: false,
      targetUsersPermis: [],
      sourceUsersPermis: [],
      isShowDlgResetPass: false,
      labelAccount: '',
      checksLvUsed: [],
      listCapHq: LIST_LV_CUSTOM,
      loading: false,
      appCodeMenuApi: 'ql-nhom-nguoi-dung'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.permissionTree.filter(val)
    }
  },
  created() {
    // this.formSearch.orgCode = this.$store.getters.org
  },
  methods: {
    checkPermissionShowButton(idButton) {
      return checkPermissionShowButton(MENU_CODE_API, idButton)
    },
    onSearch(mode) {
      this.$refs['formSearch'].validate(valid => {
        if (!valid) {
          return false
        }
        this.loadDataTable = true
        this.formSearch.page = mode === '' ? 0 : this.formSearch.page
        apiFactory.callAPI(ConstantAPI[MENU_CODE_API].SEARCH, {}, this.formSearch).then(rs => {
          this.loadDataTable = false
          this.listDataTable = rs.result
          // this.listGroup.forEach(item => {
          //   item.orgName = getTenHqByMa(item.orgCode)
          // })
          this.total = rs['totalElements']          
        }).catch(err => {
          errAlert(this, err)
          this.loadDataTable = false
        })
      })
    },

    onPrepareInsert() {
      this.isHiddenInput = false
      this.titleDialog = 'THÊM MỚI ' + this.HEADER_LABEL
      this.flagShowDialog = FORM_MODE.CREATE
      this.isShowAddEditDlg = true
      if (this.$refs['formAddEdit']) {
        this.resetForm('formAddEdit')
      }
      this.formAddEdit.orgCode = ''
      this.formAddEdit.appCode = ''
      this.formAddEdit.groupCode = ''
      this.formAddEdit.name = ''
      this.formAddEdit.roleId = ''
      this.formAddEdit.description = ''
      this.formAddEdit.status = '1'
      this.disableAppCodeModeEdit = false
    },

    onPrepareEdit(rowData) {
      this.loadingUpdate = false
      this.isHiddenInput = false
      this.loading = true
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, {
        appCode: rowData.appCode,
        groupCode: rowData.roleId,
        orgCode: rowData.orgCode
      }).then(rs => {
        if (rs) {
          this.formAddEdit = rs
          this.titleDialog = 'CẬP NHẬT ' + this.HEADER_LABEL + ` : NHÓM NGƯỜI DÙNG [${rowData.roleId}]`
          this.flagShowDialog = FORM_MODE.EDIT
          this.disableAppCodeModeEdit = true
          this.isShowAddEditDlg = true
          this.loading = false
        }
      }).catch(err => {
        this.loading = false
        errAlert(this, err)
      })
    },

    onView(rowData) {
      this.isHiddenInput = true
      this.loading = true
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API].SELECT_ITEM, {}, {
        appCode: rowData.appCode,
        groupCode: rowData.roleId,
        orgCode: rowData.orgCode
      }).then(rs => {
        if (rs) {
          this.loading = false
          this.formAddEdit = rs
          this.titleDialog = 'CHI TIẾT ' + this.HEADER_LABEL + ` : NHÓM NGƯỜI DÙNG [${rowData.roleId}]`
          this.flagShowDialog = FORM_MODE.VIEW
          this.isShowAddEditDlg = true          
          this.disableAppCodeModeEdit = true
        }
      }).catch(err => {
        this.loading = false
        errAlert(this, err)
      })
    },

    onInsert(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        apiFactory.callAPI(ConstantAPI[MENU_CODE_API].INSERT, this.formAddEdit).then(() => {
          this.formSearch.appCode = this.formAddEdit.appCode
          this.onSearch()
          showAlert(this, SUCCESS, 'Thêm thành công!')
          this.loading = false
          this.isShowAddEditDlg = false
        }).catch(err => {
          this.loading = false
          this.isShowAddEditDlg = false
          errAlert(this, err)
        })
      })
    },

    onUpdate(formName) {
      this.loadingUpdate = true
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        apiFactory.callAPI(ConstantAPI[MENU_CODE_API].UPDATE, this.formAddEdit).then(() => {
          this.formSearch.appCode = this.formAddEdit.appCode
          showAlert(this, SUCCESS, 'Cập nhật thành công!')
          this.onSearch()
          this.isShowAddEditDlg = false
        }).catch(err => {
          errAlert(this, err)
          this.isShowAddEditDlg = false
          this.loadingUpdate = false
        })
      })
    },

    onDelete(row) {
      showConfirmDelete(this.$confirm, () => {
        apiFactory.callAPI(ConstantAPI[MENU_CODE_API].DELETE, {}, {
          appCode: row.appCode,
          roleId: row.roleId,
          orgCode: row.orgCode
        }).then(() => {
          showAlert(this, SUCCESS, 'Xóa thành công!')
          this.onSearch()
        }).catch(err => {
          errAlert(this, err)
        })
      }, 'idConfirmDelete', 'idCancelDelete', 'idConfirmDelete')
    },

    onPreparePermission(rowData) {
      this.isShowPermissionDlg = true
      this.filterText = ''
      this.labelAccount = rowData.roleId
      this.checksLvUsed = []
      // const capHq = getCapMaHq(rowData.orgCode.substring(0, 4))
      // this.checksLvUsed.push(
      //   (capHq & 4) === 4 ? 4 : null,
      //   (capHq & 2) === 2 ? 2 : null,
      //   (capHq & 1) === 1 ? 1 : null
      // )
      this.formUpdatePermission.appCode = APP_CODE
      this.objParamPermissionUpdate.groupCode = rowData.groupCode
      this.objParamPermissionUpdate.appCode = rowData.appCode
      this.objParamPermissionUpdate.orgCode = rowData.orgCode
      this.objParamPermissionUpdate.roleId = rowData.roleId
      this.objParamPermissionUpdate.lstMenuCode = []
      this.listPermission = []
      const params = {
        appCode: APP_CODE,
        orgCode: rowData.orgCode,
        roleId: rowData.roleId
        // permissionCode: rowData.groupCode,
        // permissionTable: 'GROUP'
      }
      this.listPermission = []
      this.listCheckedPermission = []
      this.listUnChecked = []
      this.loadPermissionTree = true;
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API].GET_MENU_BY_PERMISSION, {}, params).then(async rs => {
        await this.listPermission.push(rs[0])
        await this.recLoadListSelected(rs[0].children)
        console.log(this.listCheckedPermission)
        // await this.$refs.permissionTree.setCheckedNodes(this.listCheckedPermission)
        // await this.$refs.permissionTree.setCheckedKeys(this.listCheckedPermission)
        await this.$refs.permissionTree.setCheckedKeys(this.listCheckedPermission);
        console.log(this.$refs.permissionTree.getNode())
        
        let len = this.listUnChecked.length;
        while (len--) {
          await this.$refs.permissionTree.setChecked(this.listUnChecked[len], false);						
        }
        this.loadPermissionTree = false
      }).catch(err => {
        errAlert(this, err)
        this.loadPermissionTree = false
      })
    },

    recLoadListSelected(listChild) {
      if (listChild && listChild.length > 0) {
        listChild.forEach(childItem => {
          if (childItem.selected) {
            this.listCheckedPermission = [...this.listCheckedPermission, childItem.rowKey]
          }else {
						this.listUnChecked.push(childItem.rowKey);
					}
          this.recLoadListSelected(childItem.children)
        })
      }
    },

    onSaveMenuPermission(formName) {
      // this.$refs[formName].validate((valid) => {
        // if (!valid) {
        //   return false
        // }
        const selectedKey = [...this.$refs.permissionTree.getHalfCheckedKeys(), ...this.$refs.permissionTree.getCheckedKeys()]
        this.objParamPermissionUpdate.lstMenuCode = [...new Set(selectedKey)]
        this.loading = true
        apiFactory.callAPI(ConstantAPI[MENU_CODE_API].UPDATE_GROUP_PERMISSION, this.objParamPermissionUpdate).then(() => {
          showAlert(this, SUCCESS, 'Cập nhật [Quyền hạn nhóm người dùng] thành công!')
          this.loading = false
          this.isShowPermissionDlg = false
        }).catch(err => {
          errAlert(this, err)
          this.loading = false
          this.isShowPermissionDlg = false
        })
      //})
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    onPrepareUserPermis(rowData) {
      this.labelAccount = rowData.roleId
      this.formAddEdit = rowData
      this.isShowDlgGroupPermission = true
      this.formUserPermis.appCode = rowData.appCode
      this.formUserPermis.groupCode = rowData.groupCode
      this.formUserPermis.orgCode = rowData.orgCode      
      this.formUserPermis.roleId = rowData.roleId
      const paramSearch = {
        appCode: rowData.appCode,
        orgCode: rowData.orgCode,
        roleId: rowData.roleId
        // permissionCode: rowData.groupCode,
        // permissionTable: 'USER_GROUP'
      }
      this.sourceUsersPermis = []
      this.targetUsersPermis = []
      apiFactory.callAPI(ConstantAPI[MENU_CODE_API].GET_GROUP_PERMISSION, {}, paramSearch).then(rs => {
        rs.forEach((item) => {
          if (item.status === '1') {
            this.targetUsersPermis.push(item['username'])
          }

          this.sourceUsersPermis.push({
            key: item['username'],
            label: item.fullName ? item.fullName : ''
          })
        })
      })
    },

    renderFunc(h, option) {
      return <span>{option.key} - {option.label}</span>
    },

    onSaveGroupPermission(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.loading = true
        const paramUpdate = {
          appCode: this.formUserPermis.appCode,
          roleId: this.formAddEdit.roleId,
          lstUsername: this.targetUsersPermis,
          orgCode: this.formAddEdit.orgCode,
          groupCode: this.formAddEdit.groupCode,          
          status: '1'
        }
        apiFactory.callAPI(ConstantAPI[MENU_CODE_API].UPDATE_USER_PERMISSION, paramUpdate).then(() => {
          showAlert(this, SUCCESS, 'Cập nhật [Người dùng thuộc nhóm] thành công!')
          this.loading = false
          this.isShowDlgGroupPermission = false
        }).catch(err => {
          this.loading = false
          this.isShowDlgGroupPermission = false
          errAlert(this, err)
        })
      })
    },

    filterByKeyAndValue,

    resetForm(formName, mode) {
      this.$refs[formName].resetFields()
      if (this.formSearch.appCode) {
        this.onSearch(mode)
      }
      this.resetFiltersTranfer('transfer')
    },

    onClearAll(formName) {
      this.$refs[formName].resetFields()
      this.listGroup = []
      this.total = 0
    },

    changeValue() {
      this.$nextTick(() => {
        this.$refs.btnSearch.$el.focus()
      })
    },

    resetFiltersTranfer(refTransfer) {
      if (this.$refs[refTransfer] && this.$refs[refTransfer].$refs) {
        this.$refs[refTransfer].$refs.leftPanel.query = ''
        this.$refs[refTransfer].$refs.rightPanel.query = ''
      }
    },
    getStatusSelected(choose) {
      this.statusSelect.forEach(status => {
        if (Number(choose) === status.key) {
          choose = status.value
        }
      })
      return choose
    }
  }
}
