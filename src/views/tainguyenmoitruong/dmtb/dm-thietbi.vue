<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]DMTB')"
      >
        <el-row v-show="false" :gutter="20">
          <select-don-vi-tinh :get-list="getListDataDVT" />
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Loại thiết bị" prop="deviceType">
              <el-input-etc
                :v-model.sync="formSearch.itemType"
                placeholder="Loại thiết bị"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã thiết bị" prop="code">
              <el-input-etc
                :v-model.sync="formSearch.itemCode"
                placeholder="Mã thiết bị"
                :maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Tên thiết bị" prop="name">
              <el-input-etc
                :v-model.sync="formSearch.itemName"
                placeholder="Tên thiết bị"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <select-trang-thai
              label="Trạng thái"
              :is-show-option-all="false"
              :v-model.sync="formSearch.status"
              prop-form="status"
              @change="changeValue"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Xuất xứ" prop="brand">
              <el-input-etc
                :v-model.sync="formSearch.brand"
                placeholder="Xuất xứ"
                :maxlength="150"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="float: right">
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DMTB')"
            ref="btnSearch"
            icon="el-icon-search"
            type="primary"
            @click="onSearch('')"
          >
            {{ $t("baseLabel.btnSearch") }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DMTB')"
            icon="el-icon-refresh-left"
            type="primary"
            @click="resetForm('formSearch')"
          >
            Xóa tìm kiếm
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_INSERT]DMTB')"
            id="btnAddCo"
            icon="el-icon-plus"
            style="float: right"
            type="primary"
            @click="onPreInsert"
            >{{ $t("baseLabel.btnCreate") }}
          </el-button>
        </el-form-item>
      </el-form>
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
          :row-class-name="tableRowClassName"
          :highlight-current-row="false"
          :page.sync="formSearch.page"
          :size.sync="formSearch.size"
          :pagination-method="onSearch"
          :join-name-excel="joinNameByCodeColumnExcel"
        >
          <div slot="columns">
            <el-table-column
              :label="$t('baseLabel.labelTableAction')"
              align="right"
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
                    id="btnEditCo"
                    v-if="checkPermissionShowButton('[BTN_UPDATE]DMTB')"
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
                    id="btnDelCo"
                    v-if="checkPermissionShowButton('[BTN_DELETE]DMTB')"
                    :loading="iconDelLoading"
                    circle
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                    @click="onDelete(scope.row)"
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
              </template>
            </el-table-column>
          </div>
        </el-table-etc-custom>
      </div>
    </el-card>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        :title="titleDialog"
        :visible.sync="isShowDlgAddEdit"
        width="80%"
      >
        <el-form
          id="formAddEdit"
          ref="formAddEdit"
          :model="formAddEdit"
          :rules="rules"
          label-width="170px"
          :disabled="isHidenGuiHoSo"
        >
          <el-tabs v-model="tabIndex" type="border-card">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Mã thiết bị" prop="deviceCode">
                  <el-input-etc
                    id="deviceCode"
                    :v-model.sync="formAddEdit.deviceCode"
                    placeholder="Mã thiết bị"
                    :maxlength="50"
                    :disabled="disableAppCodeModeEdit"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày tạo" prop="createdAt">
                  <el-date-picker
                    id="createdAt"
                    v-model="formAddEdit.createdAt"
                    clearable
                    format="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    type="date"
                    :required="true"
                    :disabled="isHiddenInput"
                    unlink-panels
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Tên thiết bị" prop="deviceName">
                  <el-input-etc
                    id="deviceName"
                    :v-model.sync="formAddEdit.deviceName"
                    placeholder="Tên thiết bị"
                    :maxlength="255"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Số serial" prop="serial">
                  <el-input-etc
                    id="serial"
                    :v-model.sync="formAddEdit.serial"
                    placeholder="Số serial"
                    :maxlength="255"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Loại thiết bị" prop="deviceType">
                  <el-input-etc
                    id="deviceType"
                    :v-model.sync="formAddEdit.deviceType"
                    placeholder="Loại thiết bị"
                    :maxlength="255"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Số lượng" prop="quantity">
                  <el-input-etc
                    id="quantity"
                    :v-model.sync="formAddEdit.quantity"
                    placeholder="Số lượng"
                    :maxlength="15"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Khu lưu trữ" prop="storageLocation">
                  <el-input-etc
                    id="storageLocation"
                    :v-model.sync="formAddEdit.storageLocation"
                    placeholder="Khu lưu trữ"
                    :maxlength="255"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Xuất xứ" prop="brand">
                  <el-input-etc
                    id="brand"
                    :v-model.sync="formAddEdit.brand"
                    placeholder="Xuất xứ"
                    :maxlength="150"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Mô tả" prop="description">
                  <el-input-etc
                    id="description"
                    :v-model.sync="formAddEdit.description"
                    placeholder="Mô tả"
                    :maxlength="1000"
                    :disabled="isHiddenInput"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="Mô tả" prop="description">
                  <el-input-etc
                    id="description"
                    :v-model.sync="formAddEdit.description"
                    placeholder="Mô tả"
                    :maxlength="1000"
                    type="textarea"
                    :rows="2"
                    :disabled="isHiddenInput"
                    :required="true"
                    show-word-limit
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
                  prop-form="status"
                  :disabled="isHiddenInput"
                  @change="changeValue"
                />
              </el-col>
            </el-row>
          </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
              checkPermissionShowButton('[BTN_INSERT]DMTB')
            "
            id="btnSaveCo"
            :loading="buttonSaveLoading"
            icon="el-icon-check"
            type="primary"
            @click="onInsert('formAddEdit')"
          >
            {{ $t("baseLabel.btnSave") }}
          </el-button>
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.EDIT &&
              checkPermissionShowButton('[BTN_UPDATE]DMTB')
            "
            id="btnUpdateCo"
            :loading="buttonUpdateLoading"
            icon="el-icon-check"
            type="primary"
            @click="onUpdate('formAddEdit')"
          >
            {{ $t("baseLabel.btnSave") }}
          </el-button>
          <el-button id="btnCancelCo" @click="isShowDlgAddEdit = false">{{
            $t("baseLabel.btnCancel")
          }}</el-button>
        </span>
      </el-dialog>
      <danh-sach-template
        v-if="showDlgTemplate"
        :show-dlg-template="showDlgTemplate"
        :close-template="showHideTemplate"
        :fill-template="fillTemplate"
        :loai-hs="loaiHoSo"
      />
    </div>
  </div>
</template>
<script src="./dm-thietbi-controller.js" />
<style scoped></style>
