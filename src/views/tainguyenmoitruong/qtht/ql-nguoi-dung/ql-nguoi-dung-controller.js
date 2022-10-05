import {
	errAlert,
	showAlert,
	showConfirmDelete,
	SUCCESS,
} from "ff24-js/src/utils/AlertMessage";
import {
	APP_CODE,
	FORM_MODE,
	LIST_LV_CUSTOM,
	PAGINATION_PARAM,
	VALIDATE_CODE,
} from "@/utils/Constant";
import { formatFullDate_VN } from '../../../../filters/index'
import apiFactory from "@/api/apiFactory";
import Pagination from "ff24-customs-lib/src/components/Pagination";
import SelectMaHq from "ff24-customs-lib/src/lib-components/BaseFormCustoms/SelectListMaHq";
import SelectPosCode from "ff24-customs-lib/src/lib-components/BaseFormCustoms/SelectListPosition";
import SelectDepCode from "ff24-customs-lib/src/lib-components/BaseFormCustoms/SelectListDepartment";
import {
	filterByKeyAndValue,
	getCapMaHq,
	getTenChucVuByKey,
	getTenHqByMa,
	getTenPhongBanByKey,
} from "@/utils/ECustomsUtils";
// import SelectListApp from '@/components/BaseFormCustoms/SelectListApplication'
import ConstantAPI from "@/utils/ConstantAPI";
import checkPermissionShowButton from "ff24-js/src/utils/ECustomsUtils.js";
import RuleChangePass from "ff24-customs-lib/src/lib-components/BaseFormCustoms/RuleChangePass";
import TrangThaiRecord from "@/components/BaseFormCustoms/TrangThaiRecord";
import SelectTrangThai from "../../../../components/CommonComponent/SelectTrangThai";

const MENU_CODE_API = "QLND";

export default {
	components: {
		Pagination,
		SelectMaHq,
		SelectPosCode,
		SelectDepCode,
		// // SelectListApp,
		RuleChangePass,
		TrangThaiRecord,
		SelectTrangThai,
	},
	data() {
		const STATUS = {
			ACTIVE: "1",
			UNACTIVE: "0",
		};
		const validateNewPass = (rule, value, callback) => {
			const passLenght = 8;
			const reg = [/[a-z]/, /[A-Z]/, /[0-9]/, /[(!@#$%&]/];
			let count = 0;
			for (let i = 0; i < reg.length; i++) {
				if (reg[i].test(value)) {
					count++;
				}
			}
			if (value === "") {
				callback(new Error("Hãy nhập mật khẩu mới"));
			} else if (value.length < passLenght) {
				callback(new Error(`Tối thiểu ${passLenght} ký tự`));
			} else if (
				value.toLowerCase().includes(this.formResetPass.username.toLowerCase())
			) {
				callback(
					new Error(
						"[Mật khẩu mới] không được có phần trùng với [Tên tài khoản]"
					)
				);
			} else if (count < 3) {
				callback(new Error("Mật khẩu không thỏa mãn điều kiện"));
			} else {
				callback();
			}
		};
		const validateConfirmPass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("Hãy nhập lại mật khẩu"));
			} else if (value !== this.formResetPass.newPassword) {
				callback(new Error("Mật khẩu mới và mật khẩu xác nhận không khớp!"));
			} else {
				callback();
			}
		};
		const msgRequireAppCode = "Mã ứng dụng bắt buộc chọn";
		return {
			ConstantAPI,
			HEADER_LABEL: "NGƯỜI DÙNG",
			FORM_MODE,
			MENU_CODE_API,
			isHiddenInput: false,
			formatFullDate_VN,
			formSearch: {
				username: "",
				fullName: "",
				orgCode: "",
				status: "",
				page: PAGINATION_PARAM.page,
				size: PAGINATION_PARAM.size,
			},
			total: 0,
			listDataTable: [],
			columns: [
				{
					prop: "username",
					label: "Tên đăng nhập",
					width: "130",
					show: true,
					sortable: true,
				},
				{
					prop: "fullName",
					label: "Họ và tên",
					width: "150",
					show: true,
					sortable: true,
				},
				{
					prop: "email",
					label: "Email",
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
			loadDataTable: false,
			loadingUpdate: false,
			flagShowDialog: FORM_MODE.DEFAULT,
			formAddEdit: {
				username: "",
				fullName: "",
				orgCode: "",
				dateOfBirth: undefined,
				idCard: "",
				email: "",
				phoneNumber: "",
				depCode: "",
				posCode: "",
				description: "",
				updatedDate: "",
				createdDate: "",
				status: STATUS.ACTIVE,
			},
			titleDialog: "",
			ruleSearch: {
				code: [VALIDATE_CODE],
			},
			rulesAddEdit: {
				username: [
					{ required: true, message: "Tên đăng nhập bắt buộc nhập" },
					{ min: 3, message: this.$t("login.maxlengthUsername") },
					{
						pattern: "^[a-zA-Z0-9.]+$",
						message: "Không được viết dấu hoặc chứa ký tự đặc biệt",
					},
				],
				fullName: [{ required: true, message: "Họ và tên bắt buộc nhập" }],
				email: [
					{ required: true, message: "Email bắt buộc nhập" },
					{
						type: "email",
						message: "Email không đúng định dạng",
						trigger: "blur",
					},
				],
				// orgCode: [
				//   { required: true, message: 'Mã Hải quan bắt buộc chọn' }
				// ],
				appCode: [{ required: true, message: msgRequireAppCode }],
				status: [{ required: true, message: "Trạng thái bắt buộc chọn" }],
			},
			rulesPermission: {
				appCode: [{ required: true, message: msgRequireAppCode }],
			},
			ruleResetPass: {
				newPassword: [{ validator: validateNewPass }],
				confirmPassword: [{ validator: validateConfirmPass }],
			},
			statusSelect: [
				{ key: 1, value: this.$t("baseLabel.labelActive") },
				{ key: 0, value: this.$t("baseLabel.labelDeActive") },
			],
			isShowAddEditDlg: false,
			maxDateOfBirth: {
				disabledDate(date) {
					return date > new Date();
				},
			},
			listPermission: [],
			formUpdatePermission: {
				appCode: "",
				levelUsed: "",
			},
			formGroupPermis: {
				appCode: "",
				username: "",
			},
			isShowPermissionDlg: false,
			defaultProps: {
				children: "children",
				label: "name",
			},
			loadPermissionTree: false,
			objParamPermissionUpdate: {
				appCode: "",
				lstMenuCode: [],
				status: 1,
				username: "",
			},
			filterText: "",
			listCheckedPermission: [],
			listUnChecked: [],
			isShowDlgGroupPermission: false,
			targetGroupPermis: [],
			sourceGroupPermis: [],
			isShowDlgResetPass: false,
			formResetPass: {
				username: "",
				newPassword: "",
				confirmPassword: "",
			},
			labelAccount: "",
			checksLvUsed: [],
			listCapHq: LIST_LV_CUSTOM,
			loadingSyncUser: false,
			isShowDlgSyncUser: false,
			loadEditBtn: false,
			loadViewBtn: false,
			loading: false,
			msgUserSyncFailure: {},
			appCodeMenuApi: "ql-nguoi-dung",
		};
	},
	// created() {
	//   this.formSearch.orgCode = ''//this.$store.getters.org
	// },
	watch: {
		filterText(val) {
			this.$refs.permissionTree.filter(val);
		},
	},
	methods: {
		checkPermissionShowButton(idButton) {
			return checkPermissionShowButton(MENU_CODE_API, idButton);
		},
		dropdownCommand(command, rowData) {
			console.log("command 1 " + rowData);

			if ("a") {
				//showAlert("command 1")
				this.onView(1);
			} else {
				showAlert("command 2" + command);
			}
		},
		onSearch(mode) {
			this.loadDataTable = false;
			this.$refs["formSearch"].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.onCallApiGetListUser(mode);
			});
		},
		getTenHqByMa,
		getTenChucVuByKey,
		getTenPhongBanByKey,

		onCallApiGetListUser(mode) {
			this.formSearch.page = mode === "" ? 0 : this.formSearch.page;
			this.loadDataTable = true;
			apiFactory
				.callAPI(ConstantAPI[MENU_CODE_API].SEARCH, {}, this.formSearch)
				.then((rs) => {
					console.log(rs);
					this.loadDataTable = false;
					this.listDataTable = rs.result;
					// this.listDataTable.forEach((item) => {
					// 	item.orgName = getTenHqByMa(item.orgCode);
					// });
					this.total = rs["totalElements"];
				})
				.catch((err) => {
					this.loadDataTable = false;
					errAlert(this, err);
				});
		},

		changeValue() {
			this.$nextTick(() => {
				this.$refs.btnSearch.$el.focus();
			});
		},

		onPrepareInsert() {
			this.isHiddenInput = false;
			this.isShowAddEditDlg = true;
			this.flagShowDialog = FORM_MODE.CREATE;
			this.titleDialog = "THÊM MỚI " + this.HEADER_LABEL;
			if (this.$refs["formAddEdit"]) {
				this.$refs.formAddEdit.resetFields();
			}
			this.formAddEdit.username = "";
			this.formAddEdit.fullName = "";
			this.formAddEdit.orgCode = "";
			this.formAddEdit.dateOfBirth = undefined;
			this.formAddEdit.idCard = "";
			this.formAddEdit.email = "";
			this.formAddEdit.phoneNumber = "";
			this.formAddEdit.depCode = "";
			this.formAddEdit.posCode = "";
			this.formAddEdit.description = "";
			this.formAddEdit.status = "1";
		},

		onInsert(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.loading = true;
				apiFactory
					.callAPIFormFile(ConstantAPI[MENU_CODE_API].INSERT, this.formAddEdit)
					.then(() => {
						this.formSearch.code = this.formAddEdit.username;
						this.formSearch.orgCode = this.formAddEdit.orgCode;
						this.onCallApiGetListUser("");
						showAlert(this, SUCCESS, "Thêm thành công!");
						this.loading = false;
						this.isShowAddEditDlg = false;
					})
					.catch((err) => {
						this.loading = false;
						this.isShowAddEditDlg = false;
						errAlert(this, err);
					});
			});
		},

		onUpdate(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.loadingUpdate = true;
				apiFactory
					.callAPIFormFile(ConstantAPI[MENU_CODE_API].UPDATE, this.formAddEdit)
					.then(() => {
						showAlert(this, SUCCESS, "Cập nhật thành công!");
						this.formSearch.code = this.formAddEdit.username;
						this.formSearch.orgCode = this.formAddEdit.orgCode;
						this.onCallApiGetListUser("");
						this.isShowAddEditDlg = false;
					})
					.catch((err) => {
						errAlert(this, err);
						this.isShowAddEditDlg = false;
						this.loadingUpdate = false;
					});
			});
		},

		onDelete(row) {
			showConfirmDelete(
				this.$confirm,
				() => {
					apiFactory
						.callAPI(
							ConstantAPI[MENU_CODE_API].DELETE,
							{},
							{ username: row.username }
						)
						.then(() => {
							showAlert(this, SUCCESS, "Xóa thành công!");
							this.onSearch("");
						})
						.catch((err) => {
							errAlert(this, err);
						});
				},
				"idConfirmDelete",
				"idCancelDelete",
				"idConfirmDelete"
			);
		},

		onPrepareEdit(rowData) {
			this.loadingUpdate = false;
			this.isHiddenInput = false;
			this.loadEditBtn = true;
			apiFactory
				.callAPI(
					ConstantAPI[MENU_CODE_API].SELECT_ITEM,
					{},
					{ username: rowData.username }
				)
				.then((rs) => {
					if (rs) {
						this.formAddEdit = rs;
						this.titleDialog =
							"CẬP NHẬT " +
							this.HEADER_LABEL +
							` : TÀI KHOẢN [${rowData.username}]`;
						this.flagShowDialog = FORM_MODE.EDIT;
						this.isShowAddEditDlg = true;
						this.loadEditBtn = false;
					}
				})
				.catch((err) => {
					this.loadEditBtn = false;
					errAlert(this, err);
				});
		},

		onView(rowData) {
			this.isHiddenInput = true;
			this.loadViewBtn = true;
			apiFactory
				.callAPI(
					ConstantAPI[MENU_CODE_API].SELECT_ITEM,
					{},
					{ username: rowData.username }
				)
				.then((rs) => {
					if (rs) {
						this.formAddEdit = rs;
						this.titleDialog =
							"CHI TIẾT " +
							this.HEADER_LABEL +
							` : TÀI KHOẢN [${rowData.username}]`;
						this.flagShowDialog = FORM_MODE.VIEW;
						this.isShowAddEditDlg = true;
						this.disableAppCodeModeEdit = true;
						this.loadViewBtn = false;
					}
				})
				.catch((err) => {
					this.loadViewBtn = false;
					errAlert(this, err);
				});
		},

		onPreparePermission(rowData) {
			this.isShowPermissionDlg = true;
			this.checksLvUsed = [];
			// const capHq = getCapMaHq(rowData.orgCode.substring(0, 4));
			// this.checksLvUsed.push(
			// 	(capHq & 4) === 4 ? 4 : null,
			// 	(capHq & 2) === 2 ? 2 : null,
			// 	(capHq & 1) === 1 ? 1 : null
			// );
			this.labelAccount = rowData.username;
			this.formUpdatePermission.appCode = "";
			this.objParamPermissionUpdate.username = rowData.username;
			this.objParamPermissionUpdate.orgCode = rowData.orgCode;
			this.listPermission = [];
			this.filterText = "";
			this.onGetListPermission("");
		},

		onGetListPermission(dataEmit) {
			this.objParamPermissionUpdate.appCode = dataEmit;
			const params = {
				// appCode: dataEmit,
				// orgCode: this.$store.getters.org,
				// permissionCode: this.objParamPermissionUpdate.username,
				// permissionTable: "USER",
				appCode: APP_CODE,
				username: this.objParamPermissionUpdate.username
			};
			this.listPermission = [];
			this.listCheckedPermission = [];
			this.listUnChecked = [];
			this.objParamPermissionUpdate.lstMenuCode = [];
			this.loadPermissionTree = true;
			apiFactory
				.callAPI(ConstantAPI[MENU_CODE_API].GET_MENU_BY_PERMISSION, {}, params)
				.then(async (rs) => {
					await this.listPermission.push(rs[0]);
					await this.recLoadListSelected(rs[0].children);	
					console.log(this.listCheckedPermission)
					//this.listCheckedPermission = this.listCheckedPermission.filter(obj => obj.indexOf("BTN_")>-1);
					// await this.$refs.permissionTree.setCheckedNodes(
					// 	this.listCheckedPermission
					// );
					await this.$refs.permissionTree.setCheckedKeys(
						this.listCheckedPermission
					);
					let len = this.listUnChecked.length;
					while (len--) {
						await this.$refs.permissionTree.setChecked(this.listUnChecked[len], false);						
					}
					
					this.loadPermissionTree = false;
				})
				.catch((err) => {
					this.loadPermissionTree = false;
					errAlert(this, err);
				});
		},

		recLoadListSelected(listChild) {
			if (listChild && listChild.length > 0) {
				listChild.forEach((childItem) => {
					if (childItem.selected) {
						this.listCheckedPermission = [
							...this.listCheckedPermission,
							childItem.rowKey,
						];						
					} else {
						this.listUnChecked.push(childItem.rowKey);
					}
					this.recLoadListSelected(childItem.children);
				});
			}
		},

		onSaveMenuPermission(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				const selectedKey = [
					...this.$refs.permissionTree.getHalfCheckedKeys(),
					...this.$refs.permissionTree.getCheckedKeys(),
				];
				console.log(this.selectedKey)
				this.objParamPermissionUpdate.lstMenuCode = [...new Set(selectedKey)];
				this.objParamPermissionUpdate.appCode = APP_CODE
				this.loading = true;
				apiFactory
					.callAPI(
						ConstantAPI[MENU_CODE_API].UPDATE_USER_PERMISSION,
						this.objParamPermissionUpdate
					)
					.then(() => {
						showAlert(this, SUCCESS, "Phân quyền thành công!");
						this.loading = false;
						this.isShowPermissionDlg = false;
					})
					.catch((err) => {
						errAlert(this, err);
						this.loading = false;
						this.isShowPermissionDlg = false;
					});
			});
		},

		filterNode(value, data) {
			if (!value) return true;
			return (
				data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
				data.rowKey.toLowerCase().indexOf(value.toLowerCase()) !== -1
			);
		},

		onPrepareGroupUser(rowData) {
			this.labelAccount = rowData.username;
			this.formAddEdit = rowData;
			this.sourceGroupPermis = [];
			this.targetGroupPermis = [];
			this.isShowDlgGroupPermission = true;
			this.formGroupPermis.username = rowData.username;
			this.formGroupPermis.orgCode = rowData.orgCode;
			this.onGetListGroupPermis("HUNRE");
		},

		onGetListGroupPermis(eventValue) {
			this.formGroupPermis.appCode = eventValue;
			const paramSearch = {
				appCode: eventValue,
				//orgCode: this.formGroupPermis.orgCode.substring(0, 4),
				username: this.formGroupPermis.username,
			};
			this.sourceGroupPermis = [];
			this.targetGroupPermis = [];
			apiFactory
				.callAPI(
					ConstantAPI[MENU_CODE_API].GET_GROUP_PERMISSION,
					{},
					paramSearch
				)
				.then((rs) => {
					for (const item of rs) {
						if (item.status === '1') {
							this.targetGroupPermis = [
								...this.targetGroupPermis,
								item.groupCode,
							];
						}
						this.sourceGroupPermis = [
							...this.sourceGroupPermis,
							{
								key: item.groupCode,
								label: item.name,
							},
						];
					}
				});
		},

		onSaveGroupPermission(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.loading = true;
				const paramUpdate = {
					appCode: this.formGroupPermis.appCode,
					lstRole: this.targetGroupPermis,
					//orgCode: this.formAddEdit.orgCode.substring(0, 4),
					username: this.formAddEdit.username,
					status: 1,
				};
				apiFactory
					.callAPI(ConstantAPI[MENU_CODE_API].UPDATE_GROUP_PERMISSION, paramUpdate)
					.then(() => {
						showAlert(this, SUCCESS, "Phân quyền thành công!");
						this.loading = false;
						this.isShowDlgGroupPermission = false;
					})
					.catch((err) => {
						this.loading = false;
						errAlert(this, err);
					});
			});
		},

		renderFunc(h, option) {
			return (
				<span>
					{option.key} - {option.label}
				</span>
			);
		},

		filterByKeyAndValue,

		onPrepareResetPass(rowData) {
			this.isShowDlgResetPass = true;
			this.labelAccount = rowData.username;
			this.formResetPass.username = rowData.username;
			this.formResetPass.totp = "123456";
		},

		onSaveResetPass(formName) {
			this.$refs[formName].validate((valid) => {
				if (!valid) {
					return false;
				}
				this.loading = true;
				apiFactory
					.callAPI(ConstantAPI[MENU_CODE_API].RESET_PASS, this.formResetPass)
					.then(() => {
						showAlert(
							this,
							SUCCESS,
							`Đặt lại mật khẩu thành công : Tài khoản [${this.formResetPass.username}]`
						);
						this.loading = false;
						this.isShowDlgResetPass = false;
					})
					.catch((err) => {
						this.loading = false;
						errAlert(this, err);
					});
			});
		},

		onPreventChar($event) {
			const keyCode = $event.keyCode ? $event.keyCode : $event.which;
			if (keyCode < 48 || keyCode > 57) {
				$event.preventDefault();
			}
		},

		onSyncUserLdap() {
			this.loadingSyncUser = true;
			apiFactory
				.callAPI(ConstantAPI[MENU_CODE_API].SYNC_USERS_LDAP)
				.then((rsMsg) => {
					showAlert(this, SUCCESS, rsMsg.key);
					this.loadingSyncUser = false;
					this.isShowDlgSyncUser = rsMsg.value && rsMsg.value.length > 0;
					this.msgUserSyncFailure = rsMsg;
				})
				.catch((err) => {
					this.loadingSyncUser = false;
					this.isShowDlgSyncUser = false;
					errAlert(this, err);
				});
		},

		resetForm(formName) {
			this.$refs[formName].resetFields();
			this.listDataTable = [];
			this.total = 0;
			this.formSearch.username = '';
			this.formSearch.fullName = '';
			this.resetFiltersTranfer("transfer");
		},

		onCloseDialog(formName) {
			this.$refs[formName].resetFields();
			if (this.listDataTable && this.listDataTable.length > 0) {
				this.onSearch();
			}
		},

		resetFiltersTranfer(refTransfer) {
			if (this.$refs[refTransfer] && this.$refs[refTransfer].$refs) {
				this.$refs[refTransfer].$refs.leftPanel.query = "";
				this.$refs[refTransfer].$refs.rightPanel.query = "";
			}
		},
		getStatusSelected(choose) {
			this.statusSelect.forEach((status) => {
				if (Number(choose) === status.key) {
					choose = status.value;
				}
			});
			return choose;
		},
	},
};
