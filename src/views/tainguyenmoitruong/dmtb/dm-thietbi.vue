<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]DMHC')"
      >
        <el-row v-show="false" :gutter="20">
          <select-don-vi-tinh :get-list="getListDataDVT" />
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Ngày tìm kiếm" prop="fromToDate" required>
              <date-range-picker
                v-model="formSearch.fromToDate"
                :picker-options="pickerOptions"
                format="dd/MM/yyyy"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Loại hóa chất" prop="resourceType">
              <el-input-etc
                :v-model.sync="formSearch.resourceType"
                placeholder="Loại hóa chất"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã hóa chất" prop="code">
              <el-input-etc
                :v-model.sync="formSearch.code"
                placeholder="Mã hóa chất"
                :maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Tên hóa chất" prop="name">
              <el-input-etc
                :v-model.sync="formSearch.name"
                placeholder="Tên hóa chất"
                :maxlength="255"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <select-don-vi-tinh
              label-option="Tất cả"
              :is-show-option-all="false"
              :v-model.sync="formSearch.unit"
              label="Đơn vị tính"
              prop-form="unit"
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
            v-if="checkPermissionShowButton('[BTN_SEARCH]DMHC')"
            ref="btnSearch"
            icon="el-icon-search"
            type="primary"
            @click="onSearch('')"
          >
            {{ $t("baseLabel.btnSearch") }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DMHC')"
            icon="el-icon-refresh-left"
            type="primary"
            @click="resetForm('formSearch')"
          >
            Xóa tìm kiếm
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_INSERT]DMHC')"
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
                    v-if="checkPermissionShowButton('[BTN_UPDATE]DMHC')"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-edit"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row['resourceCode'])"
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
                    v-if="checkPermissionShowButton('[BTN_DELETE]DMHC')"
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
                <el-form-item label="Mã hóa chất" prop="resourceCode">
                  <el-input-etc
                    id="resourceCode"
                    :v-model.sync="formAddEdit.resourceCode"
                    placeholder="Mã hóa chất"
                    :maxlength="50"
                    :disabled="disableAppCodeModeEdit"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày tạo" prop="createdAt">
                  <el-date-picker
                    id="ngayLapAddEdit"
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
                <el-form-item label="Tên hóa chất" prop="resourceName">
                  <el-input-etc
                    id="resourceName"
                    :v-model.sync="formAddEdit.resourceName"
                    placeholder="Tên hóa chất"
                    :maxlength="255"
                    :required="true"
                    :disabled="isHiddenInput"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Loại hóa chất" prop="resourceType">
                  <el-input-etc
                    id="resourceType"
                    :v-model.sync="formAddEdit.resourceType"
                    placeholder="Loại hóa chất"
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
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <select-don-vi-tinh
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.unit"
                  prop-form="unit"
                  :required="true"
                  :disabled="isHiddenInput"
                  :rules="ruleDVT"
                />
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

            <!-- <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Đại diện người khai HQ"
                  prop="dai_dien_nguoi_khai_hq"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewDaiDienNguoiKhaiHQ"
                    class="viewSpan"
                    >{{ formAddEdit.dai_dien_nguoi_khai_hq }}</span
                  >

                  <el-input-etc
                    v-else
                    id="daiDienNguoiKhaiHqAddEdit"
                    :v-model.sync="formAddEdit.dai_dien_nguoi_khai_hq"
                    placeholder="Đại diện người khai HQ"
                    :maxlength="250"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Số lượng mẫu/Chi tiết mẫu"
                  prop="so_luong_mau"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewSoLuongMau"
                    class="viewSpan"
                    >{{ formAddEdit.so_luong_mau }}</span
                  >

                  <el-input-etc
                    v-else
                    id="soLuongMauAddEdit"
                    :v-model.sync="formAddEdit.so_luong_mau"
                    placeholder="Số lượng mẫu/Chi tiết mẫu"
                    :maxlength="50"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item
                  label="Đặc điểm quy cách đóng gói"
                  prop="dac_diem_quy_cach_dong_goi"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewDacDiemDongGoi"
                    class="viewSpan"
                    >{{ formAddEdit.dac_diem_quy_cach_dong_goi }}</span
                  >

                  <el-input-etc
                    v-else
                    id="dacDiemDongGoiAddEdit"
                    :v-model.sync="formAddEdit.dac_diem_quy_cach_dong_goi"
                    placeholder="Đặc điểm quy cách đóng gói"
                    :maxlength="250"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  v-if="isHiddenInput"
                  label="Hình thức kiểm tra"
                  prop="hinh_thuc_kiem_tra"
                >
                  <span id="viewHinhThucKiemTra" class="viewSpan">{{
                    getMaHinhThucKiemTraSelected(formAddEdit.hinh_thuc_kiem_tra)
                  }}</span>
                </el-form-item>
               <select-hinh-thuc-kiem-tra
                  v-else
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.hinh_thuc_kiem_tra"
                  prop-form="hinh_thuc_kiem_tra"
                  :required="true"
                  :rules="ruleHTKT"
                  :get-list="getListDataHinhThucKiemTra"
                />
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Mẫu được niêm phong HQ số"
                  prop="mau_duoc_niem_phong_hq_so"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewMauDuocNiemPhongSo"
                    class="viewSpan"
                    >{{ formAddEdit.mau_duoc_niem_phong_hq_so }}</span
                  >

                  <el-input-etc
                    v-else
                    id="mauDuocNiemPhongSoAddEdit"
                    :v-model.sync="formAddEdit.mau_duoc_niem_phong_hq_so"
                    placeholder="Mẫu được niêm phong HQ số"
                    :maxlength="50"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  v-if="isHiddenInput"
                  label="Người khai yêu cầu lấy lại mẫu"
                  prop="nguoi_khai_yeu_cau_lay_lai_mau"
                >
                  <span id="viewHinhThucKiemTra" class="viewSpan">{{
                    getListNguoiKhaiLayLaiMauSelected(
                      formAddEdit.nguoi_khai_yeu_cau_lay_lai_mau
                    )
                  }}</span>
                </el-form-item>
                <select-yes-no
                  v-else
                  label="Người khai yêu cầu lấy lại mẫu"
                  :is-show-option-all="false"
                  :value.sync="formAddEdit.nguoi_khai_yeu_cau_lay_lai_mau"
                  prop-form="nguoi_khai_yeu_cau_lay_lai_mau"
                  :required="true"
                  :rules="ruleNguoiKhai"
                  :get-list="getListNguoiKhaiLayLaiMau"
                  @change="changeSelectNguoiKhaiYCLayLaiMau"
                />
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Người ủy quyền nhận lại mẫu"
                  prop="nguoi_uy_quyen_nhan_lai_mau"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewNguoiUyQuyenNhanLaiMau"
                    class="viewSpan"
                    >{{ formAddEdit.nguoi_uy_quyen_nhan_lai_mau }}</span
                  >

                  <el-input-etc
                    v-else
                    id="nguoiUyQuyenNhanLaiMauAddEdit"
                    :v-model.sync="formAddEdit.nguoi_uy_quyen_nhan_lai_mau"
                    placeholder="Người ủy quyền nhận lại mẫu"
                    :maxlength="250"
                    :required="isNguoiKhaiYcLayMau"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row> -->
          </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
              checkPermissionShowButton('[BTN_INSERT]DMHC')
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
              checkPermissionShowButton('[BTN_UPDATE]DMHC')
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
            :disabled="!checkPermissionShowButton('[BTN_SEARCH]DMHC')"
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
<script src="./dm-thietbi-controller.js" />
<style scoped></style>
