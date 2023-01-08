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
          label-width="170px"
          @keyup.enter.native="onSearch('')"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Tên đăng nhập" prop="code">
                <el-input-etc
                  id="username"
                  :v-model.sync="formSearch.username"
                  clearable
                  placeholder="Tên đăng nhập"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Họ và tên" prop="name">
                <el-input-etc
                  id="fullName"
                  :v-model.sync="formSearch.fullName"
                  clearable
                  placeholder="Họ và tên"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <!-- <select-ma-hq
                :is-require="true"
                class-item="idSelectMaHqSearch"
                :is-show-option-all="true"
                :rules="rulesAddEdit.orgCode"
                :s-cusid.sync="formSearch.orgCode"
                prop-form="orgCode"
                @onChange="changeValue"
                @clear="formSearch.orgCode = `_${$store.getters.org}`"
              /> -->
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <select-master-data
                :is-show-option-all="false"
                :v-model.sync="formSearch.depCode"
                label="Khoa"
                placeholder="Khoa"
                prop-form="depCode"
                :required="false"
                :is-filter="true"
                :filter-data="masterTypeLabDepartment"
              />
            </el-col>
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
              </el-form-item>-->
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
              v-if="checkPermissionShowButton('[BTN_SEARCH]QLND')"
              id="btnSearch"
              ref="btnSearch"
              icon="el-icon-search"
              type="primary"
              @click="onSearch('')"
            >
              {{ $t("baseLabel.btnSearch") }}
            </el-button>
            <el-button
              v-if="checkPermissionShowButton('[BTN_SEARCH]QLND')"
              id="btnClear"
              icon="el-icon-refresh-left"
              type="primary"
              @click="resetForm('formSearch')"
            >
              {{ $t("baseLabel.btnClear") }}
            </el-button>

            <el-button
              v-if="checkPermissionShowButton('[BTN_INSERT]QLND')"
              id="btnCreate"
              icon="el-icon-plus"
              style="float: right; margin-left: 10px"
              type="primary"
              @click="onPrepareInsert"
            >
              {{ $t("baseLabel.btnCreate") }}
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
                      v-if="checkPermissionShowButton('[BTN_UPDATE]QLND')"
                    >
                      Sửa
                    </el-dropdown-item>
                    <!-- <el-dropdown-item
                      v-if="
                        checkPermissionShowButton('[BTN_CHANGE_PASSWORD]QLND')
                      "
                      icon="el-icon-unlock"
                      @click.native="onPrepareResetPass(scope.row)"
                    >
                      Đặt lại mật khẩu
                    </el-dropdown-item> -->
                    <el-dropdown-item
                      icon="el-icon-delete"
                      v-if="checkPermissionShowButton('[BTN_DELETE]QLND')"
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
                        checkPermissionShowButton('[BTN_USER_PERMISSION]QLND')
                      "
                      :disabled="scope.row.status === 0"
                      @click.native="onPreparePermission(scope.row)"
                    >
                      <!-- :disabled="scope.row.status === 0" -->
                      Người dùng truy cập vào chức năng
                    </el-dropdown-item>
                    <el-dropdown-item
                      v-if="checkPermissionShowButton('[BTN_USER_GROUP]QLND')"
                      :disabled="scope.row.status === 0"
                      @click.native="onPrepareGroupUser(scope.row)"
                    >
                      <font-awesome-icon icon="users" />
                      Thêm người dùng vào nhóm
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <!-- <el-table-column
              :label="$t('baseLabel.labelTableAction')"
              align="center"
              width="125"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :open-delay="350"
                  content="Sửa thông tin"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    v-if="checkPermissionShowButton('[BTN_UPDATE]DMKD')"
                    id="btnEditCo"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-edit"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row)"
                  />
                </el-tooltip>

                <el-tooltip
                  :open-delay="350"
                  content="Xóa Thông Tin"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    v-if="checkPermissionShowButton('[BTN_DELETE]DMKD')"
                    id="btnDelCo"
                    :loading="iconDelLoading"
                    circle
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                    @click="onDelete(scope.row['id'])"
                  />
                </el-tooltip>

                <el-tooltip
                  :open-delay="350"
                  content="Xem chi tiết thông tin"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    id="btnViewCo"
                    :loading="iconViewLoading"
                    circle
                    icon="el-icon-view"
                    size="mini"
                    type="success"
                    @click="onView(scope.row)"
                  />
                </el-tooltip>

                <el-tooltip
                :open-delay="350"
                content="Sửa"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="checkPermissionShowButton('[BTN_UPDATE]QLND')"
                  id="btnPreEdit"
                  :loading="loadEditBtn"
                  circle
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="onPrepareEdit(scope.row)"
                />
              </el-tooltip>

              <el-tooltip :open-delay="350" content="Đặt lại mật khẩu" effect="light" placement="top-start">
                <el-button
                  v-if="checkPermissionShowButton('[BTN_CHANGE_PASSWORD]QLND')"
                  id="btnPreResetPass"
                  :disabled="scope.row.status === 0"
                  circle
                  icon="el-icon-unlock"
                  size="mini"
                  type="success"
                  @click="onPrepareResetPass(scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                :open-delay="350"
                content="Xóa"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="checkPermissionShowButton('[BTN_DELETE]QLND')"
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
                  :loading="loadViewBtn"
                  circle
                  icon="el-icon-view"
                  size="mini"
                  type="success"
                  @click="onView(scope.row)"
                />
              </el-tooltip>
              </template>
            </el-table-column> -->
          </div>
        </el-table-etc-custom>
      </div>
    </el-card>

    <!-- <div>
        <el-table
          id="tlbUsers"
          v-loading="loadDataTable"
          :data="listUsers"
          border
          fit
          style="width: 100%"
        >
          <el-table-column
            :index="(index) => {return ((formSearch.page >= 1 ? formSearch.page - 1 : 0) * formSearch.size) + index + 1}"
            align="center"
            label="STT"
            type="index"
            width="50"
          />
          <el-table-column
            label="Tên đăng nhập"
            prop="username"
            show-overflow-tooltip
          />
          <el-table-column
            label="Họ và tên"
            prop="fullname"
            show-overflow-tooltip
          />
          <el-table-column
            label="Mã công chức"
            prop="idCard"
            show-overflow-tooltip
          />
          <el-table-column
            label="Email"
            prop="email"
            show-overflow-tooltip
            width="200"
          />
          <el-table-column
            label="Mã Hải quan"
            prop="orgName"
            show-overflow-tooltip
            width="200"
          />

          <el-table-column
            align="center"
            label="Ngày hiệu lực"
            prop="createdDate"
          >
            <template slot-scope="{row}">
              {{ row.createdDate | formatDate }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="Ngày hết hiệu lực"
          >
            <template v-if="row.status === 0" slot-scope="{row}">
              {{ row.updatedDate | formatDate }}
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            label="Trạng thái"
            width="120"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 1" type="success">Kích hoạt</el-tag>
              <el-tag v-if="scope.row.status === 0" type="danger">Hủy kích hoạt</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="Phân quyền" width="100">
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="350"
                content="Phân quyền người dùng truy cập vào chức năng"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="checkPermissionShowButton('[BTN_USER_PERMISSION]QLND')"
                  id="btnUserPermis"
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
                content="Phân quyền người dùng vào nhóm người dùng"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="checkPermissionShowButton('[BTN_USER_GROUP]QLND')"
                  id="btnUserGroupPermis"
                  :disabled="scope.row.status === 0"
                  circle
                  size="mini"
                  type="primary"
                  @click="onPrepareGroupUser(scope.row)"
                >
                  <font-awesome-icon icon="users"/>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" fixed="right" label="Thao tác" width="170">
            <template slot-scope="scope">
              <el-tooltip
                :open-delay="350"
                content="Sửa"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="checkPermissionShowButton('[BTN_UPDATE]QLND')"
                  id="btnPreEdit"
                  :loading="loadEditBtn"
                  circle
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="onPrepareEdit(scope.row)"
                />
              </el-tooltip>

              <el-tooltip :open-delay="350" content="Đặt lại mật khẩu" effect="light" placement="top-start">
                <el-button
                  v-if="checkPermissionShowButton('[BTN_CHANGE_PASSWORD]QLND')"
                  id="btnPreResetPass"
                  :disabled="scope.row.status === 0"
                  circle
                  icon="el-icon-unlock"
                  size="mini"
                  type="success"
                  @click="onPrepareResetPass(scope.row)"
                />
              </el-tooltip>

              <el-tooltip
                :open-delay="350"
                content="Xóa"
                effect="light"
                placement="top-start"
              >
                <el-button
                  v-if="checkPermissionShowButton('[BTN_DELETE]QLND')"
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
                  :loading="loadViewBtn"
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
          popper-class="pagiUsers"
          :limit.sync="formSearch.size"
          :page.sync="formSearch.page"
          :total="total"
          @pagination="onSearch"
        />
      </div> -->

    <div>
      <el-dialog
        id="dlgAddEdit"
        :close-on-click-modal="false"
        :title="titleDialog"
        :visible.sync="isShowAddEditDlg"
        width="80%"
        @close="onCloseDialog('formAddEdit')"
      >
        <el-form
          id="formAddEdit"
          ref="formAddEdit"
          :model="formAddEdit"
          :rules="rulesAddEdit"
          label-width="190px"
        >
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Tên đăng nhập" prop="username" required>
                <el-input-etc
                  id="username"
                  :v-model.sync="formAddEdit.username"
                  :disabled="flagShowDialog === 2 || isHiddenInput"
                  :maxlength="50"
                  placeholder="Tên đăng nhập"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Họ và tên" prop="fullName" required>
                <el-input-etc
                  id="fullName"
                  :v-model.sync="formAddEdit.fullName"
                  :maxlength="500"
                  :disabled="isHiddenInput"
                  placeholder="Họ và tên"
                  show-word-limit
                  @input="
                    (v) => {
                      formAddEdit.fullName = v.replace(/^\s+/, '');
                    }
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Ngày sinh" prop="dateOfBirth">
                <el-date-picker
                  id="dateOfBirth"
                  v-model="formAddEdit.dateOfBirth"
                  :picker-options="maxDateOfBirth"
                  :disabled="isHiddenInput"
                  clearable
                  format="dd/MM/yyyy"
                  placeholder="DD/MM/YYYY"
                  type="date"
                  unlink-panels
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Địa chỉ email" prop="email" required>
                <el-input
                  id="email"
                  v-model="formAddEdit.email"
                  :maxlength="254"
                  :disabled="isHiddenInput"
                  placeholder="Địa chỉ email"
                  show-word-limit
                  @input="
                    (v) => {
                      formAddEdit.email = v.trim();
                    }
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Số điện thoại" prop="phoneNumber">
                <el-input
                  id="phoneNumber"
                  v-model="formAddEdit.phoneNumber"
                  :maxlength="11"
                  :disabled="isHiddenInput"
                  placeholder="Số điện thoại"
                  show-word-limit
                  @keypress.native="onPreventChar"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <!-- <el-form-item v-if="isHiddenInput" label="Mã phòng ban">
              <span id="depCodeView" class="viewSpan">{{ getTenPhongBanByKey(formAddEdit.depCode) }}</span>
            </el-form-item>

            <select-dep-code v-else id="depCode" :dep-code.sync="formAddEdit.depCode" prop-form="depCode"/>

            <el-form-item v-if="isHiddenInput" label="Mã chức vụ">
              <span id="posCodeView" class="viewSpan">{{ getTenChucVuByKey(formAddEdit.posCode) }}</span>
            </el-form-item>
            <select-pos-code v-else id="posCode" :pos-code.sync="formAddEdit.posCode" prop-form="posCode"/> -->

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
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <select-master-data
                :is-show-option-all="false"
                :v-model.sync="formAddEdit.depCode"
                label="Khoa"
                placeholder="Khoa"
                prop-form="depCode"
                :required="true"
                :disabled="isHiddenInput"
                :rules="ruleLabDepartment"
                :is-filter="true"
                :filter-data="masterTypeLabDepartment"
              />
            </el-col>
          </el-row>

          <!-- <el-form-item label="Mô tả" prop="description">
              <span v-if="isHiddenInput" id="descriptionView" class="viewSpan">{{ formAddEdit.description }}</span>
              <el-input
                v-else
                id="description"
                v-model="formAddEdit.description"
                :maxlength="500"
                :row="3"
                placeholder="Mô tả"
                show-word-limit
                type="textarea"
              />
            </el-form-item> -->

          <!-- <div v-if="isHiddenInput">
              <el-form-item label="Ngày hiệu lực" prop="createdDate">
                <span id="createdDateView" class="viewSpan">{{ formAddEdit.createdDate | formatDate }}</span>
              </el-form-item>
              <el-form-item v-if="formAddEdit.status === 0" label="Ngày hết hiệu lực" prop="updatedDate">
                <span id="updatedDateView" class="viewSpan">{{ formAddEdit.updatedDate | formatDate }}</span>
              </el-form-item>

            </div> -->
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button id="btnCancelAddEdit" @click="isShowAddEditDlg = false">{{
            $t("baseLabel.btnCancel")
          }}</el-button>
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
              checkPermissionShowButton('[BTN_INSERT]QLND')
            "
            id="btnSave"
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
              checkPermissionShowButton('[BTN_UPDATE]QLND')
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
        id="dlgPermisUser"
        :close-on-click-modal="false"
        :title="`PHÂN QUYỀN NGƯỜI DÙNG [${labelAccount}] TRUY CẬP VÀO CHỨC NĂNG`"
        :visible.sync="isShowPermissionDlg"
        destroy-on-close
        top="5vh"
        style="height: 100%"
        @close="onCloseDialog('formUpdatePermission')"
      >
        <el-card shadow="never" style="height: 600px; overflow: scroll">
          <div slot="header">
            <el-form
              id="formUpdatePermission"
              ref="formUpdatePermission"
              :model="formUpdatePermission"
              :rules="rulesPermission"
              label-width="220px"
            >
              <!-- <select-list-app
                :app-code.sync="formUpdatePermission.appCode"
                :is-require="true"
                popper-class="idSelectAppPermis"
                :menu-code-api="appCodeMenuApi"
                prop-form="appCode"
                :rules="rulesPermission.appCode"
                @customEvent="onGetListPermission"
              /> -->

              <!-- <el-form-item label="Cấp Hải quan được sử dụng">
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
            id="idSearchMenu"
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
              <span>{{ data.name.substring(0, data.name.indexOf("[")) }}</span>
              <span>{{
                data.name.substring(
                  data.name.indexOf("]") + 1,
                  data.name.length
                )
              }}</span>
              <!-- <span v-if="data.rowKey.startsWith('[BTN')">
                <el-tag
                  class="method-label-color"
                  style="font-weight: bold; border: 2px solid #83afff"
                  type="primary"
                  >BUTTON</el-tag
                >
              </span> -->

              <!-- <el-tooltip
                :content="data.name"
                :open-delay="400"
                effect="dark"
                placement="bottom"
              > 
              <span>{{ data.name.substring(0, data.name.indexOf("[")) }}</span>
              <span>{{
                data.name.substring(
                  data.name.indexOf("]") + 1,
                  data.name.length
                )
              }}</span>
              </el-tooltip> -->
            </span>
          </el-tree>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button id="btnCancel" @click="isShowPermissionDlg = false">{{
            $t("baseLabel.btnCancel")
          }}</el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_USER_PERMISSION]QLND')"
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
        id="dlgGroupPermis"
        :close-on-click-modal="false"
        :title="`PHÂN QUYỀN NGƯỜI DÙNG [${labelAccount}] VÀO NHÓM`"
        :visible.sync="isShowDlgGroupPermission"
        style="height: 100%"
        destroy-on-close
        width="60%"
        top="5vh"
        @close="onCloseDialog('formGroupPermis')"
      >
        <el-card shadow="never">
          <div slot="header">
            <el-form
              id="formGroupPermis"
              ref="formGroupPermis"
              :model="formGroupPermis"
              :rules="rulesPermission"
              label-width="130px"
            >
              <el-row>
                <el-col :span="24">
                  <select-list-app
                    :app-code.sync="formGroupPermis.appCode"
                    :is-require="true"
                    :menu-code-api="appCodeMenuApi"
                    popper-class="idSelectAppGroup"
                    :prop-form="'appCode'"
                    :rules="rulesPermission.appCode"
                    @customEvent="onGetListGroupPermis"
                  />
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="Tên đăng nhập" prop="username">
                    <el-input
                      id="idUsername"
                      v-model="formGroupPermis.username"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <el-transfer
            id="transfer"
            ref="transfer"
            v-model="targetGroupPermis"
            :data="sourceGroupPermis"
            :filter-method="filterByKeyAndValue"
            :render-content="renderFunc"
            :titles="['Nhóm chưa gán quyền', 'Nhóm đã gán quyền']"
            filter-placeholder="Tìm nhóm"
            filterable
            style="width: 100%"
          />
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button
            id="btnCancelDlg"
            @click="isShowDlgGroupPermission = false"
            >{{ $t("baseLabel.btnCancel") }}</el-button
          >
          <el-button
            v-if="checkPermissionShowButton('[BTN_USER_GROUP]QLND')"
            id="btnSaveGroupPermis"
            :loading="loading"
            icon="el-icon-check"
            type="primary"
            @click="onSaveGroupPermission('formGroupPermis')"
          >
            Lưu
          </el-button>
        </span>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        id="dlgResetPass"
        :close-on-click-modal="false"
        :title="`ĐẶT LẠI MẬT KHẨU : TÀI KHOẢN [${labelAccount}]`"
        :visible.sync="isShowDlgResetPass"
        @close="onCloseDialog('formResetPass')"
      >
        <!-- <el-card id="idCardResetPass" shadow="never">
            <div slot="header">
              <el-form
                id="formResetPass"
                ref="formResetPass"
                :model="formResetPass"
                :rules="ruleResetPass"
                label-width="220px"
              >
                <el-form-item label="Mật khẩu mới" prop="newPassword" required>
                  <el-input
                    id="newPassword"
                    v-model="formResetPass.newPassword"
                    :maxlength="50"
                    placeholder="Mật khẩu mới"
                    type="password"
                  />
                </el-form-item>

                <div class="EmptyBox10" />

                <el-form-item
                  label="Xác nhận mật khẩu"
                  prop="confirmPassword"
                  required
                >
                  <el-input
                    id="confirmPassword"
                    v-model="formResetPass.confirmPassword"
                    :maxlength="50"
                    placeholder="Xác nhận mật khẩu"
                    type="password"
                  />
                </el-form-item>

                <div class="EmptyBox10" />

                <div class="text-center">
                  <el-button
                    id="btnReset"
                    @click="$refs.formResetPass.resetFields()"
                  >Nhập lại</el-button>
                  <el-button
                    id="btnCancelRs"
                    @click="isShowDlgResetPass = false"
                  >{{ $t('baseLabel.btnCancel') }}
                  </el-button>
                  <el-button
                    v-if="
                      checkPermissionShowButton(
                        '[BTN_CHANGE_PASSWORD]QLND'
                      )
                    "
                    id="btnSaveReset"
                    :loading="loading"
                    icon="el-icon-check"
                    type="primary"
                    @click="onSaveResetPass('formResetPass')"
                  >
                    Lưu
                  </el-button>
                </div>
              </el-form>
            </div>

            <rule-change-pass />
          </el-card> -->
      </el-dialog>
    </div>

    <div>
      <el-dialog
        id="dlgSyncUser"
        :close-on-click-modal="false"
        :title="'KẾT QUẢ ĐỒNG BỘ NGƯỜI DÙNG'"
        :visible.sync="isShowDlgSyncUser"
      >
        <!-- <strong>Danh sách tài khoản chưa đồng bộ được</strong>
          <div class="EmptyBox10" />
          <el-table
            id="tblSyncUser"
            v-loading="loadDataTable"
            :data="msgUserSyncFailure.value"
            border
            fit
            height="500"
            style="width: 100%"
          >
            <el-table-column label="Tên đăng nhập" prop="key" width="200" />
            <el-table-column label="Lỗi" prop="value" show-overflow-tooltip />
          </el-table>

          <span slot="footer" class="dialog-footer">
            <el-button
              id="btnCancelSync"
              @click="isShowDlgSyncUser = false"
            >Đóng</el-button>
          </span> -->
      </el-dialog>
    </div>
    <!-- </el-card> -->
  </div>
</template>

<script src="./ql-nguoi-dung-controller.js" />
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
</style>
