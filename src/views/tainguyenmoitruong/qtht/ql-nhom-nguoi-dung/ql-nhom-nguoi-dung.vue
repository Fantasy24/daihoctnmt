<template>
  <div class="app-container">
    <el-card>
      <div slot="header" class="clearfix">
        <span>QUẢN LÝ {{ HEADER_LABEL }}</span>
      </div>

      <div>
        <el-form
          id="formSearch"
          ref="formSearch"
          :model="formSearch"
          :rules="ruleSearch"
          label-width="150px"
          @keyup.enter.native="onSearch('')"
        >
          <!-- <el-row :gutter="20">
            <el-col :span="12">
              <select-list-app
                :app-code.sync="formSearch.appCode"
                :is-require="true"
                popper-class="idAppCodeSearch"
                :menu-code-api="appCodeMenuApi"
                :rules="rulesAddEdit.appCode"
                prop-form="appCode"
                @customEvent="changeValue"
              />
            </el-col>

            <el-col :span="12">
              <select-ma-hq
                :is-require="true"
                :rules="rulesAddEdit.orgCode"
                :s-cusid.sync="formSearch.orgCode"
                class-item="idSelectMaHqSearch"
                prop-form="orgCode"
                @onChange="changeValue"
              />
            </el-col>
          </el-row> -->

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Mã nhóm" prop="groupCode">
                <el-input
                  id="groupCode"
                  v-model="formSearch.groupCode"
                  clearable
                  placeholder="Mã nhóm"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Tên nhóm" prop="name">
                <el-input
                  id="name"
                  v-model="formSearch.name"
                  clearable
                  placeholder="Tên nhóm"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <!-- <el-form-item label="Trạng thái" prop="status">
                <el-select
                  id="status"
                  v-model="formSearch.status"
                  popper-class="idStatusSearch"
                  placeholder="Chọn"
                  style="width: 100%"
                  @change="changeValue"
                >
                  <el-option
                    v-for="item in statusSelect"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item> -->
              <select-trang-thai
                label="Trạng thái"
                :is-show-option-all="false"
                :v-model.sync="formSearch.status"
                prop-form="status"
                @change="changeValue"
              />
            </el-col>
          </el-row>

          <el-form-item style="float: right">
            <el-button
              v-if="checkPermissionShowButton('[BTN_SEARCH]QLNND')"
              id="btnSearch"
              ref="btnSearch"
              icon="el-icon-search"
              type="primary"
              @click="onSearch('')"
            >
              {{ $t("baseLabel.btnSearch") }}
            </el-button>
            <el-button
              v-if="checkPermissionShowButton('[BTN_SEARCH]QLNND')"
              id="btnClearAll"
              icon="el-icon-refresh-left"
              type="primary"
              @click="onClearAll('formSearch', '')"
            >
              {{ $t("baseLabel.btnClear") }}
            </el-button>
            <el-button
              v-if="checkPermissionShowButton('[BTN_INSERT]QLNND')"
              id="btnCreate"
              icon="el-icon-plus"
              style="float: right"
              type="primary"
              @click="onPrepareInsert"
              >{{ $t("baseLabel.btnCreate") }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="EmptyBox5" />
    <el-card>
      <div>
        <el-table-etc-custom
          ref="tblMain"
          :list-data-table.sync="listDataTable"
          :loading.sync="loadDataTable"
          :total.sync="total"
          :columns="columns"
          :is-export="true"
          :is-show-pdf="false"
          :is-show-print="false"
          :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
          :params-fetch="formSearch"
          :highlight-current-row="false"
          :page.sync="formSearch.page"
          :size.sync="formSearch.size"
          :pagination-method="onSearch"
        >
          <div slot="columns">
            <el-table-column
              align="center"
              fixed="right"
              label="Thao tác"
              width="120"
            >
              <template slot-scope="scope">
                <el-dropdown
                  split-button
                  type="primary"
                  @click="onView(scope.row)"
                >
                  <i class="el-icon-view" />
                  Xem
                  <el-dropdown-menu slot="dropdown" class="dropdown-table">
                    <el-dropdown-item class="keyMenu" disabled>
                      {{ scope.row.username }}
                    </el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-edit"
                      @click.native="onPrepareEdit(scope.row)"
                      v-if="checkPermissionShowButton('[BTN_UPDATE]QLNND')"
                    >
                      Sửa
                    </el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-delete"
                      v-if="checkPermissionShowButton('[BTN_DELETE]QLNND')"
                      @click.native="onDelete(scope.row)"
                    >
                      <!-- :disabled="scope.row.status === 0" -->

                      Xóa
                    </el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-view"
                      @click.native="onView(scope.row)"
                    >
                      Xem chi tiết
                    </el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-s-operation"
                      v-if="
                        checkPermissionShowButton('[BTN_GROUP_PERMISSION]QLNND')
                      "
                      :disabled="scope.row.status === 0"
                      @click.native="onPreparePermission(scope.row)"
                    >
                      <!-- :disabled="scope.row.status === 0" -->
                      Nhóm truy cập vào chức năng
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="checkPermissionShowButton('[BTN_USER_GROUP]QLNND')"
                      :disabled="scope.row.status === 0"
                      @click.native="onPrepareUserPermis(scope.row)"
                    >
                      <font-awesome-icon icon="users" />
                      Thêm người dùng vào nhóm
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </div>
        </el-table-etc-custom>

        <!-- <el-table
          id="tblListGroup"
          v-loading="loadDataTable"
          :data="listGroup"
          border
          fit
          style="width: 100%"
        >
          <el-table-column
            :index="
              (index) => {
                return (
                  (formSearch.page >= 1 ? formSearch.page - 1 : 0) *
                    formSearch.size +
                  index +
                  1
                );
              }
            "
            align="center"
            label="STT"
            type="index"
            width="50"
          />
          <el-table-column
            label="Mã ứng dụng"
            prop="appCode"
            show-overflow-tooltip
            width="180"
          />
          <el-table-column
            label="Mã Hải quan"
            prop="orgName"
            show-overflow-tooltip
            width="280"
          />
          <el-table-column
            label="Mã nhóm"
            prop="groupCode"
            show-overflow-tooltip
          />
          <el-table-column label="Tên nhóm" prop="name" show-overflow-tooltip />
          <el-table-column align="center" label="Trạng thái" width="160">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="success"
                >Kích hoạt</el-tag
              >
              <el-tag v-if="scope.row.status === 0" type="danger"
                >Hủy kích hoạt</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="Phân quyền"
            width="100"
          >
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="350"
                content="Phân quyền nhóm truy cập vào chức năng"
                effect="light"
                placement="top"
              >
                <el-button
                  v-if="
                    checkPermissionShowButton(
                      '[BTN_GROUP_PERMISSION]QLNND'
                    )
                  "
                  id="btnPrePermis"
                  :disabled="scope.row.status === 0"
                  circle
                  icon="el-icon-s-operation"
                  size="mini"
                  type="primary"
                  @click="onPreparePermission(scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                :open-delay="350"
                content="Thêm người dùng vào nhóm"
                effect="light"
                placement="top"
              >
                <el-button
                  v-if="
                    checkPermissionShowButton(
                      '[BTN_USER_GROUP]QLNND'
                    )
                  "
                  id="btnPreGroupPermis"
                  :disabled="scope.row.status === 0"
                  circle
                  size="mini"
                  type="primary"
                  @click="onPrepareUserPermis(scope.row)"
                >
                  <font-awesome-icon icon="user-plus" />
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            label="Thao tác"
            width="170"
          >
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="350"
                content="Sửa"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="
                    checkPermissionShowButton('[BTN_UPDATE]QLNND')
                  "
                  id="btnPreEdit"
                  :loading="loading"
                  circle
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="onPrepareEdit(scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                :open-delay="350"
                content="Xóa"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="
                    checkPermissionShowButton('[BTN_DELETE]QLNND')
                  "
                  id="btnDel"
                  :disabled="scope.row.status === 0"
                  circle
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="confirmDelete(scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                :open-delay="350"
                content="Xem chi tiết thông tin"
                effect="light"
                placement="top-start"
              >
                <el-button
                  id="btnView"
                  :loading="loading"
                  circle
                  icon="el-icon-view"
                  size="mini"
                  type="success"
                  @click="onView(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          id="pagination"
          popper-class="pagiGroups"
          :limit.sync="formSearch.size"
          :page.sync="formSearch.page"
          :total="total"
          @pagination="onSearch"
        /> -->
      </div>
    </el-card>

    <el-card>
      <div>
        <el-dialog
          id="dlgAddEdit"
          :close-on-click-modal="false"
          :title="titleDialog"
          :visible.sync="isShowAddEditDlg"
          width="70%"
          @close="resetForm('formAddEdit')"
        >
          <el-form
            id="formAddEdit"
            ref="formAddEdit"
            :model="formAddEdit"
            :rules="rulesAddEdit"
            label-width="190px"
          >
            <!-- <el-form-item
              v-if="isHiddenInput"
              label="Mã ứng dụng"
              prop="appCode"
            >
              <span id="appCodeView">
                {{ formAddEdit.appCode }}
              </span>
            </el-form-item>

            <select-list-app
              v-else
              :app-code.sync="formAddEdit.appCode"
              :is-disable="disableAppCodeModeEdit"
              :is-require="true"
              :menu-code-api="appCodeMenuApi"
              :rules="rulesAddEdit.appCode"
              prop-form="appCode"
              popper-class="idAppCodeIU"
            />

            <el-form-item
              v-if="isHiddenInput"
              label="Mã Hải quan"
              prop="orgCode"
            >
              <span id="orgCodeView">
                {{ formAddEdit.orgCode }}
              </span>
            </el-form-item>
            <select-ma-hq
              v-else
              :is-disable="disableAppCodeModeEdit"
              :is-require="true"
              :is-show-option-all="false"
              :rules="rulesAddEdit.orgCode"
              :s-cusid.sync="formAddEdit.orgCode"
              prop-form="orgCode"
              class-item="idSelectMaHqIU"
              @clear="formAddEdit.orgCode = ''"
            /> -->
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Mã nhóm" prop="roleId" required>
                  <el-input-etc
                    id="idGroupCode"
                    :v-model.sync="formAddEdit.roleId"
                    :disabled="disableAppCodeModeEdit"
                    :maxlength="50"
                    placeholder="Mã nhóm"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Tên nhóm" prop="description" required>
                  <el-input-etc
                    id="idName"
                    :v-model.sync="formAddEdit.description"
                    :maxlength="255"
                    :disabled="isHiddenInput"
                    placeholder="Tên nhóm"
                    show-word-limit
                    @input="
                      (v) => {
                        formAddEdit.description = v.trimLeft();
                      }
                    "
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <select-trang-thai
                  label="Trạng thái"
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.status"
                  :disabled="isHiddenInput"
                  prop-form="status"
                  @change="changeValue"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-checkbox v-model="formAddEdit.quantityWarningNotify"
                  >Nhận thông báo số lượng thiết bị, dụng cụ, hóa chất sắp
                  hết</el-checkbox
                >
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-checkbox v-model="formAddEdit.approveBookingNotify"
                  >Nhận thông báo yêu cầu phê duyệt sử dụng phòng thí
                  nghiệm</el-checkbox
                >
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-checkbox v-model="formAddEdit.approveRequisitionNotify"
                  >Nhận thông báo yêu cầu phê duyệt đề xuất mua sắm trang thiết
                  bị, dụng cụ, hóa chất</el-checkbox
                >
              </el-col>
            </el-row>
          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button id="btnCancel" @click="isShowAddEditDlg = false">{{
              $t("baseLabel.btnCancel")
            }}</el-button>
            <el-button
              v-if="
                flagShowDialog === FORM_MODE.CREATE &&
                checkPermissionShowButton('[BTN_INSERT]QLNND')
              "
              id="btnInsert"
              :loading="loading"
              icon="el-icon-check"
              type="primary"
              @click="onInsert('formAddEdit')"
            >
              {{ $t("baseLabel.btnSave") }}
            </el-button>
            <el-button
              v-if="
                flagShowDialog === FORM_MODE.EDIT &&
                checkPermissionShowButton('[BTN_UPDATE]QLNND')
              "
              id="btnUpdate"
              :loading="loadingUpdate"
              icon="el-icon-check"
              type="primary"
              @click="onUpdate('formAddEdit')"
            >
              {{ $t("baseLabel.btnUpdate") }}
            </el-button>
          </span>
        </el-dialog>
      </div>

      <div>
        <el-dialog
          id="dlgGroupPermis"
          :close-on-click-modal="false"
          :title="`PHÂN QUYỀN NHÓM NGƯỜI DÙNG [${labelAccount}] TRUY CẬP VÀO CHỨC NĂNG`"
          :visible.sync="isShowPermissionDlg"
          style="height: 100%"
          @close="resetForm('formUpdatePermission')"
        >
          <el-card
            id="cardGroupPermiss"
            shadow="never"
            style="height: 600px; overflow: scroll"
          >
            <div slot="header">
              <el-form
                id="formUpdatePermission"
                ref="formUpdatePermission"
                :model="formUpdatePermission"
                :rules="rulesPermission"
                label-width="200px"
              >
                <!-- <select-list-app
                  :app-code.sync="formUpdatePermission.appCode"
                  :is-disable="true"
                  :is-require="true"
                  :menu-code-api="appCodeMenuApi"
                  prop-form="appCode"
                  popper-class="idAppUpdatePermis"
                  :rules="rulesPermission.appCode"
                />

                <el-form-item label="Cấp Hải quan được sử dụng">
                  <el-checkbox-group
                    id="checksLvUsed"
                    v-model="checksLvUsed"
                    disabled
                  >
                    <el-checkbox
                      v-for="capHq in listCapHq"
                      :key="capHq.key"
                      :label="capHq.key"
                    >
                      {{ capHq.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item> -->
              </el-form>
            </div>
            <el-input
              id="idSearchTree"
              v-model="filterText"
              placeholder="Tìm tên chức năng"
            />
            <div class="EmptyBox10" />

            <el-tree
              id="idPermissionTree"
              ref="permissionTree"
              v-loading="loadPermissionTree"
              :data="listPermission"
              :default-checked-keys="listCheckedPermission"
              :filter-node-method="filterNode"
              :highlight-current="true"
              check-on-click-node
              default-expand-all
              empty-text="Không có dữ liệu"
              node-key="rowKey"
              show-checkbox
            >
              <span
                v-if="data"
                id="treeData"
                slot-scope="{ node, data }"
                class="custom-tree-node"
              >
                <span v-if="data.rowKey.startsWith('[BTN_DELETE]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="danger"
                    >DELETE</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_DELETE_PTN]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="danger"
                    >DELETE_PTN</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_APPROVE]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >APPROVE</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_APPROVE1]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >APPROVE_1</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_APPROVE2]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >APPROVE_2</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_CONFIRM]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >CONFIRM</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_REFUSE]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="danger"
                    >REFUSE</el-tag
                  >
                </span>

                <span v-if="data.rowKey.startsWith('[BTN_SEARCH]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="success"
                    >SEARCH</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_INSERT]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="success"
                    >INSERT</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_INSERT_PTN]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="success"
                    >INSERT_PTN</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_UPDATE]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >UPDATE</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_UPDATE_PTN]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >UPDATE_PTN</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_USER_GROUP]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >GROUP</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_USER_PERMISSION]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >PERMISSION</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_GROUP_PERMISSION]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >PERMISSION</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_POST]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="success"
                    >POST</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_PUT]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="warning"
                    >PUT</el-tag
                  >
                </span>
                <span v-if="data.rowKey.startsWith('[BTN_GET]')">
                  <el-tag
                    class="method-label-color"
                    style="font-weight: bold; border: 2px solid"
                    type="success"
                    >GET</el-tag
                  >
                </span>
                <span>{{
                  data.name.substring(0, data.name.indexOf("["))
                }}</span>
                <span>{{
                  data.name.substring(
                    data.name.indexOf("]") + 1,
                    data.name.length
                  )
                }}</span>
              </span>
            </el-tree>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button
              id="btnCancelPermis"
              @click="isShowPermissionDlg = false"
              >{{ $t("baseLabel.btnCancel") }}</el-button
            >
            <el-button
              v-if="checkPermissionShowButton('[BTN_GROUP_PERMISSION]QLNND')"
              id="btnSavePermis"
              :loading="loading"
              icon="el-icon-check"
              type="primary"
              @click="onSaveMenuPermission('formUpdatePermission')"
            >
              Lưu
            </el-button>
          </span>
        </el-dialog>
      </div>

      <div>
        <el-dialog
          id="btnAddUserGroup"
          :close-on-click-modal="false"
          :title="`THÊM NGƯỜI DÙNG VÀO NHÓM: [${labelAccount}]`"
          :visible.sync="isShowDlgGroupPermission"
          destroy-on-close
          width="60%"
          @close="resetForm('formUserPermis')"
        >
          <el-card shadow="never">
            <div slot="header">
              <el-form
                id="idFormUserPermis"
                ref="formUserPermis"
                :model="formUserPermis"
                :rules="rulesPermission"
                label-width="80px"
              >
                <!-- <el-row :gutter="20">
                  <el-col :span="6">
                    <div class="grid-content" />
                  </el-col>
                  <el-col :span="12">
                    <select-ma-hq
                      :is-disable="true"
                      prop-form="orgCode"
                      class-item="idSelectMaHqIU"
                      :s-cusid.sync="formUserPermis.orgCode"
                    />
                  </el-col>
                  <el-col :span="6" />
                </el-row> -->
              </el-form>
            </div>

            <el-transfer
              id="idTransferUser"
              ref="transfer"
              v-model="targetUsersPermis"
              :data="sourceUsersPermis"
              :filter-method="filterByKeyAndValue"
              :render-content="renderFunc"
              :titles="['Người dùng chưa gán quyền', 'Người dùng đã gán quyền']"
              filter-placeholder="Tìm tên người dùng"
              filterable
              style="width: 100%"
            />
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button
              id="btnCancelGroupPermis"
              @click="isShowDlgGroupPermission = false"
              >{{ $t("baseLabel.btnCancel") }}</el-button
            >
            <el-button
              v-if="checkPermissionShowButton('[BTN_USER_GROUP]QLNND')"
              id="idSaveGroupPermis"
              :loading="loading"
              icon="el-icon-check"
              type="primary"
              @click="onSaveGroupPermission('formUserPermis')"
            >
              Lưu
            </el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script src="./ql-nhom-nguoi-dung-controller.js"/>
<style>
.method-label-color {
  width: 85px !important;
  text-align: center !important;
  margin-right: 10px !important;
}

.el-transfer-panel {
  width: 40% !important;
  min-width: 100px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
