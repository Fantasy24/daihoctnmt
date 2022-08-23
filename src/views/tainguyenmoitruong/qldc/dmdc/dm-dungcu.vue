<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]DMDC')"
      >
        <el-row v-show="false" :gutter="20">
          <select-master-data :get-list="getListDataDVT" />
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã dụng cụ" prop="code">
              <el-input-etc
                :v-model.sync="formSearch.code"
                placeholder="Mã dụng cụ"
                :maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Tên dụng cụ" prop="name">
              <el-input-etc
                :v-model.sync="formSearch.name"
                placeholder="Tên dụng cụ"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <select-master-data
                  :is-show-option-all="false"
                  :v-model.sync="formSearch.unit"
                  label="Đơn vị tính"
                  prop-form="unit"
                  :disabled="isHiddenInput"
                  :rules="ruleDVT"
                  :is-filter="true"
                  :filter-data="masterType"
                />
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Số lượng" prop="quantity">
              <el-input-etc
                :v-model.sync="formSearch.quantity"
                placeholder="Số lượng"
                :maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Xuất xứ" prop="origin">
              <el-input-etc
                :v-model.sync="formSearch.origin"
                placeholder="Xuất xứ"
                :maxlength="150"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Khu lưu trữ" prop="storageLocation">
              <el-input-etc
                :v-model.sync="formSearch.storageLocation"
                placeholder="Khu lưu trữ"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
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

        <el-form-item style="float: right">
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DMDC')"
            ref="btnSearch"
            icon="el-icon-search"
            type="primary"
            @click="onSearch('')"
          >
            {{ $t("baseLabel.btnSearch") }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DMDC')"
            icon="el-icon-refresh-left"
            type="primary"
            @click="resetForm('formSearch')"
          >
            Xóa tìm kiếm
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_INSERT]DMDC')"
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
                    v-if="checkPermissionShowButton('[BTN_UPDATE]DMDC')"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-edit"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row['toolId'])"
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
                    v-if="checkPermissionShowButton('[BTN_DELETE]DMDC')"
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
        @close="resetFrm('formAddEdit')"
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
                <el-form-item label="Mã dụng cụ" prop="toolCode">
                  <el-input-etc
                    id="toolCode"
                    :v-model.sync="formAddEdit.toolCode"
                    placeholder="Mã dụng cụ"
                    :maxlength="50"
                    :disabled="disableAppCodeModeEdit"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Tên dụng cụ" prop="toolName">
                  <el-input-etc
                    id="toolName"
                    :v-model.sync="formAddEdit.toolName"
                    placeholder="Tên dụng cụ"
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
                <select-master-data
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.unit"
                  label="Đơn vị tính"
                  prop-form="unit"
                  :required="true"
                  :disabled="isHiddenInput"
                  :rules="ruleDVT"
                  :is-filter="true"
                  :filter-data="masterType"
                />
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
                <el-form-item label="Xuất xứ" prop="origin">
                  <el-input-etc
                    id="origin"
                    :v-model.sync="formAddEdit.origin"
                    placeholder="Xuất xứ"
                    :maxlength="150"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
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
          </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
              checkPermissionShowButton('[BTN_INSERT]DMDC')
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
              checkPermissionShowButton('[BTN_UPDATE]DMDC')
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
    <!-- <div>
      <el-dialog
        :close-on-click-modal="false"
        :title="titleDialogPrint"
        :visible.sync="showPrint"
        width="90%"
      >
        <el-form
          id="formAddEdit"
          label-width="275px"
        >
          <iframe :src="pdfSource" style="width: 100%;height: 500px; border: none;" />
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            id="btnPrintPDF"
            :disabled="!checkPermissionShowButton('[BTN_SEARCH]DMDC')"
            :loading="buttonPrintLoading"
            icon="el-icon-printer"
            type="primary"
            @click="onPrintPhieuYeuCau()"
          >
            In
          </el-button>

          <el-button id="btnCancelCo" @click="showPrint = false">{{
            $t('baseLabel.btnCancel')
          }}</el-button>
        </span>
      </el-dialog>
    </div> -->
  </div>
</template>
<script src="./dm-dungcu-controller.js" />
<style scoped></style>
