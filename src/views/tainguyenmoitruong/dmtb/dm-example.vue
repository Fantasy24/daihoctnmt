<template>
  <div class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearch('')"
      >
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <select-list-ma-hq
              :v-model.sync="formSearch.orgCode"
              :is-show-option-all="false"
              :required="true"
              :store="$store"
              :clearable="false"
              @change="changeValue"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã Example" prop="code">
              <el-input-etc
                :v-model.sync="formSearch.code"
                placeholder="Mã Example"
                :maxlength="15"
              />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Tên Example" prop="name">
              <el-input-etc
                :v-model.sync="formSearch.name"
                placeholder="Tên Example"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item style="float: right">
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]EXAMPLE')"
            ref="btnSearch"
            icon="el-icon-search"
            type="primary"
            @click="onSearch('')"
          >
            {{ $t('baseLabel.btnSearch') }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]EXAMPLE')"
            icon="el-icon-refresh-left"
            type="primary"
            @click="resetForm('formSearch')"
          >
            {{ $t('baseLabel.btnClear') }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_INSERT]EXAMPLE')"
            id="btnAddCo"
            icon="el-icon-plus"
            style="float: right"
            type="primary"
            @click="onPreInsert"
          >{{ $t('baseLabel.btnCreate') }}
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
          :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
          :params-fetch="formSearch"
          :highlight-current-row="false"
          :page.sync="formSearch.page"
          :size.sync="formSearch.size"
          :pagination-method="onSearch"
          :paging-parent="getParentRowAndGroup"
          row-key="ma"
          default-expand-all
          :show-stt="false"
          :span-method="arraySpanMethod"
          :is-show-hide-column="false"
          @row-click="rowClicked"
        >
          <div slot="columns">
            <el-table-column
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
                    v-if="checkPermissionShowButton('[BTN_UPDATE]EXAMPLE')"
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
                    v-if="checkPermissionShowButton('[BTN_DELETE]EXAMPLE')"
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
              </template>
            </el-table-column>
          </div>
        </el-table-etc-custom>
      </div>
    </el-card>

    <el-card>
      <div>
        <el-table-etc-custom
          ref="tblMain"
          :list-data-table.sync="listDataTable2"
          :loading.sync="loadDataTable"
          :total.sync="total"
          :columns="columns2"
          :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
          :params-fetch="formSearch"
          :highlight-current-row="false"
          :page.sync="formSearch.page"
          :size.sync="formSearch.size"
          :pagination-method="onSearch"
          :show-stt="false"
          :is-show-hide-column="false"
          :is-export="true"
          :multi-header-excel="multiHeaderExcel"
          :merge-cell-excel="mergeCellExcel"
          @select="selectRow"
        >
          <div slot="columns">
            <el-table-column
              label="Phương pháp hủy"
              align="center"
              width="250"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.phuong_phap_huy"
                  placeholder="Chọn hình thức kiểm tra"
                  style="width: 100%;"
                  clearable
                  @change="selectDropdownInGrid"
                >
                  <el-option
                    v-for="type in lstStatus"
                    :key="type.key"
                    :value="type.key"
                    :label="type.label"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('baseLabel.labelTableAction')"
              align="center"
              width="250"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-tooltip
                  :open-delay="350"
                  content="Duyet"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    v-if="checkPermissionShowButton('[BTN_UPDATE]EXAMPLE')"
                    id="btnDuyet"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-s-operation"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row)"
                  />
                </el-tooltip>
                <el-tooltip
                  :open-delay="350"
                  content="Nhap so thong bao ket qua"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    v-if="checkPermissionShowButton('[BTN_UPDATE]EXAMPLE')"
                    id="btnNhapSoThongBaoKQPT"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-plus"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row)"
                  />
                </el-tooltip>
                <el-tooltip
                  :open-delay="350"
                  content="Chọn"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    v-if="checkPermissionShowButton('[BTN_UPDATE]EXAMPLE')"
                    id="btnChoose"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-check"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row)"
                  />
                </el-tooltip>
                <el-tooltip
                  :open-delay="350"
                  content="Sửa thông tin"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    v-if="checkPermissionShowButton('[BTN_UPDATE]EXAMPLE')"
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
                    v-if="checkPermissionShowButton('[BTN_DELETE]EXAMPLE')"
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
        width="50%"
        @close="resetFrm('formAddEdit')"
      >
        <el-form
          id="formAddEditLoaiKD"
          ref="formAddEdit"
          :model="formAddEdit"
          :rules="rules"
          label-width="170px"
        >
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Mã kiểm định" prop="ma" required>
                <span v-if="isHiddenInput" id="viewMaLoaiKD" class="viewSpan">{{
                  formAddEdit.ma
                }}</span>

                <el-input-etc
                  v-else
                  id="maAddEditLoaiKD"
                  :v-model.sync="formAddEdit.ma"
                  :disabled="disableWhenEdit"
                  placeholder="Mã kiểm định"
                  :maxlength="15"
                  show-word-limit
                  @input="
                    value => {
                      formAddEdit.ma = value.toUpperCase()
                    }
                  "
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Tên kiểm định" prop="ten" required>
                <span v-if="isHiddenInput" id="viewNameCo" class="viewSpan">{{
                  formAddEdit.ten
                }}</span>
                <el-input-etc
                  v-else
                  id="nameAddEditCo"
                  :v-model.sync="formAddEdit.ten"
                  placeholder="Tên kiểm định"
                  maxlength="255"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Mô tả">
                <span v-if="isHiddenInput" id="viewDesCo" class="viewSpan">{{
                  formAddEdit.mo_ta
                }}</span>
                <el-input-etc
                  v-else
                  id="desAddEditCo"
                  :v-model.sync="formAddEdit.mo_ta"
                  :maxlength="255"
                  placeholder="Mô tả"
                  show-word-limit
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Trường hợp áp dụng">
                <span v-if="isHiddenInput" id="viewDesCo" class="viewSpan">{{
                  formAddEdit.truong_hop_ap_dung
                }}</span>
                <el-input-etc
                  v-else
                  id="apDungAddEditLoaiKD"
                  :v-model.sync="formAddEdit.truong_hop_ap_dung"
                  :maxlength="255"
                  placeholder="Trường hợp áp dụng"
                  show-word-limit
                  type="text"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item
                :label="$t('baseLabel.labelStatus')"
                prop="status"
                required
              >
                <span v-if="isHiddenInput" id="statusView" class="viewSpan">
                  {{ getStatusSelected(formAddEdit.status) }}
                </span>

                <el-select
                  v-else
                  id="idSelectStatus"
                  v-model="formAddEdit.status"
                  :placeholder="$t('baseLabel.labelChoice')"
                  popper-class="idSelectStatus"
                  clearable
                >
                  <el-option
                    v-for="item in statusSelect"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button id="btnCancelCo" @click="isShowDlgAddEdit = false">{{
            $t('baseLabel.btnCancel')
          }}</el-button>
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
                checkPermissionShowButton('[BTN_INSERT]EXAMPLE')
            "
            id="btnSaveCo"
            :loading="buttonSaveLoading"
            icon="el-icon-check"
            type="primary"
            @click="onInsert('formAddEdit')"
          >
            {{ $t('baseLabel.btnSave') }}
          </el-button>
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.EDIT &&
                checkPermissionShowButton('[BTN_UPDATE]EXAMPLE')
            "
            id="btnUpdateCo"
            :loading="buttonUpdateLoading"
            icon="el-icon-check"
            type="primary"
            @click="onUpdate('formAddEdit')"
          >
            {{ $t('baseLabel.btnUpdate') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./dm-example-controller.js" />
<style scoped>
.el-table_1_column_1 span.el-table__indent {
  padding-left: 0px !important;
}
</style>
