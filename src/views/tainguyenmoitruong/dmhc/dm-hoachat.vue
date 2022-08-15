<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]DMHC')"
      >
        <!-- <el-row v-show="false" :gutter="20">
          <select-hinh-thuc-kiem-tra :get-list="getListDataHinhThucKiemTra" />
          <select-yes-no :get-list="getListNguoiKhaiLayLaiMau" />
          <select-loai-hinh-xnk />
          <select-loai-phe-duyet :get-list="getListDataLoaiPheDuyet" />
          <select-chuyen-vien-phan-tich-phan-loai :ma-don-vi="maDonVi" />
        </el-row> -->

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
                :maxlength="20"
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
      <!-- <div>
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
                    :disabled="
                      !(
                        showHideBtnUpdateInGrid(scope.row) &&
                        checkPermissionShowButton('[BTN_UPDATE]DMHC')
                      )
                    "
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-edit"
                    size="mini"
                    type="primary"
                    @click="onPrepareEdit(scope.row['id_phieu_yeu_cau'])"
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
                    :disabled="
                      !(
                        showHideBtnDeleteInGrid(scope.row) &&
                        checkPermissionShowButton('[BTN_DELETE]DMHC')
                      )
                    "
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
      </div> -->
    </el-card>
    <!-- <div>
      <el-dialog
        :close-on-click-modal="false"
        :title="titleDialog"
        :visible.sync="isShowDlgAddEdit"
        width="90%"
        @close="resetFrm('formAddEdit')"
      >
        <el-form
          id="formAddEdit"
          ref="formAddEdit"
          :model="formAddEdit"
          :rules="rules"
          label-width="275px"
          :disabled="isHidenGuiHoSo"
        >
          <el-tabs v-model="tabIndex" type="border-card">

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Số phiếu yêu cầu" prop="so_phieu_yeu_cau">
                  <span
                    v-if="isHiddenInput"
                    id="viewSoPhieuYeuCau"
                    class="viewSpan"
                  >{{ formAddEdit.so_phieu_yeu_cau }}</span>

                  <el-input-etc
                    v-else
                    id="soPhieuYeuCauAddEdit"
                    :v-model.sync="formAddEdit.so_phieu_yeu_cau"
                    placeholder="Số phiếu yêu cầu"
                    :maxlength="20"
                    :disabled="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày lập" prop="ngay_lap">
                  <span v-if="isHiddenInput" id="viewNgayLap" class="viewSpan">
                    {{ formAddEdit.ngay_lap | formatFullDate_VN }}
                  </span>
                  <el-date-picker
                    v-else
                    id="ngayLapAddEdit"
                    v-model="formAddEdit.ngay_lap"
                    clearable
                    format="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    type="date"
                    :required="true"
                    unlink-panels
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Đơn vị yêu cầu phân tích" prop="hq_yeu_cau_phan_tich">
                  <span
                    v-if="isHiddenInput"
                    id="viewMaHaiQuanYCPT"
                    class="viewSpan"
                  >{{ ''.concat(formAddEdit.hq_yeu_cau_phan_tich,' - ',getHaiQuanByMa(formAddEdit.hq_yeu_cau_phan_tich)) }}
                  </span>
                  <el-input-etc
                    v-else
                    id="maHaiQuanYcptAddEdit"
                    :v-model.sync="formAddEdit.hq_yeu_cau_phan_tich"
                    placeholder="Đơn vị yêu cầu phân tích"
                    :maxlength="15"
                    :required="true"
                    :disabled="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  v-if="isHiddenInput"
                  label="Đơn vị tiếp nhận phân tích"
                  prop="hq_tiep_nhan_yeu_cau_phan_tich"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewMaHaiQuanPT"
                    class="viewSpan"
                  >{{
                    ''.concat(formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich,' - ',getHaiQuanByMa(formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich))
                  }}
                  </span>
                </el-form-item>
                <select-list-ma-hq
                  v-else
                  :is-get-all="isGetAllHq"
                  :is-show-option-all="isShowOptionAllHqEdit"
                  :label="labelHqPt"
                  :s-cusid.sync="formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich"
                  prop-form="hq_tiep_nhan_yeu_cau_phan_tich"
                  :required="true"
                  :store="$store"
                  @change="changeSelectHQEdit"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Số tờ khai" prop="so_to_khai">
                  <span v-if="isHiddenInput" id="viewSoToKhai" class="viewSpan">{{
                    formAddEdit.so_to_khai
                  }}</span>

                  <el-input-etc
                    v-else
                    id="soToKhaiAddEdit"
                    :v-model.sync="formAddEdit.so_to_khai"
                    placeholder="Số tờ khai"
                    :maxlength="15"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  v-if="isHiddenInput"
                  label="Loại hình XNK"
                  prop="ma_lhxnk"
                  required
                >
                  <span id="loaiHinhXnkView" class="viewSpan">
                    {{ getMaLoaiHinhXnkSelected(formAddEdit.ma_lhxnk) }}
                  </span>
                </el-form-item>
                <select-loai-hinh-xnk
                  v-else
                  :is-show-option-all="false"
                  :value.sync="formAddEdit.ma_lhxnk"
                  prop-form="ma_lhxnk"
                  :required="true"
                  :rules="ruleLHXNK"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Đơn vị XNK" prop="ma_dvxnk">
                  <span v-if="isHiddenInput" id="viewDonViXnk" class="viewSpan">{{
                    ''.concat(formAddEdit.ma_dvxnk,' - ',formAddEdit.ten_dvxnk)
                  }}</span>

                  <el-input-etc
                    v-else
                    id="donViXnkAddEdit"
                    :v-model.sync="formAddEdit.ma_dvxnk"
                    placeholder="Đơn vị XNK"
                    :maxlength="500"
                    :required="true"
                    show-word-limit
                    @blur="getDvxnkByMa(formAddEdit.ma_dvxnk)"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày đăng ký TK" prop="ngay_dk_to_khai">
                  <span v-if="isHiddenInput" id="viewNgayLap" class="viewSpan">
                    {{ formAddEdit.ngay_dk_to_khai | formatFullDate_VN }}
                  </span>
                  <el-date-picker
                    v-else
                    id="ngayDangKyTkAddEdit"
                    v-model="formAddEdit.ngay_dk_to_khai"
                    clearable
                    format="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    type="date"
                    :required="true"
                    unlink-panels
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Mã hàng khai báo" prop="ma_hang_khai_bao">
                  <span v-if="isHiddenInput" id="viewDonViXnk" class="viewSpan">{{
                    formAddEdit.ma_hang_khai_bao
                  }}</span>

                  <el-input-etc
                    v-else
                    id="maHangKhaiBaoAddEdit"
                    :v-model.sync="formAddEdit.ma_hang_khai_bao"
                    placeholder="Mã hàng khai báo "
                    :maxlength="15"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="Tên hàng khai báo" prop="ten_hang_khai_bao">
                  <span
                    v-if="isHiddenInput"
                    id="viewTenHangKhaiBao"
                    class="viewSpan"
                  >{{ formAddEdit.ten_hang_khai_bao }}</span>

                  <el-input-etc
                    v-else
                    id="maHangKhaiBaoAddEdit"
                    :v-model.sync="formAddEdit.ten_hang_khai_bao"
                    placeholder="Tên hàng khai báo"
                    :maxlength="500"
                    type="textarea"
                    :rows="2"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item
                  label="Nội dung yêu cầu phân tích"
                  prop="noi_dung_yeu_cau_phan_tich"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewNoiDungYcpt"
                    class="viewSpan"
                  >{{ formAddEdit.noi_dung_yeu_cau_phan_tich }}</span>

                  <el-input-etc
                    v-else
                    id="NoiDungYcptAddEdit"
                    :v-model.sync="formAddEdit.noi_dung_yeu_cau_phan_tich"
                    placeholder="Nội dung yêu cầu phân tích"
                    :maxlength="500"
                    type="textarea"
                    :rows="2"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Số giấy chứng nhận xuất xứ (C/O)"
                  prop="bien_kiem_soat_ptvt"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewSoGiayChungNhanXx"
                    class="viewSpan"
                  >{{ formAddEdit.so_chung_nhan_xuat_xu }}</span>

                  <el-input-etc
                    v-else
                    id="soGiayChungNhanXx"
                    :v-model.sync="formAddEdit.so_chung_nhan_xuat_xu"
                    placeholder="Số giấy chứng nhận xuất xứ (C/O)"
                    :maxlength="50"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Ngày chứng nhận xuất xứ (C/O)"
                  prop="ngay_chung_nhan_xuat_xu"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewNgayChungNhanXx"
                    class="viewSpan"
                  >
                    {{ formAddEdit.ngay_chung_nhan_xuat_xu | formatFullDate_VN }}
                  </span>
                  <el-date-picker
                    v-else
                    id="ngayChungNhanXxAddEdit"
                    v-model="formAddEdit.ngay_chung_nhan_xuat_xu"
                    clearable
                    format="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    type="date"
                    unlink-panels
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Địa điểm lấy mẫu" prop="dia_diem_lay_mau">
                  <span
                    v-if="isHiddenInput"
                    id="viewDiiaDiemLayMau"
                    class="viewSpan"
                  >{{ formAddEdit.dia_diem_lay_mau }}</span>

                  <el-input-etc
                    v-else
                    id="diaDiemLayMau"
                    :v-model.sync="formAddEdit.dia_diem_lay_mau"
                    placeholder="Địa điểm lấy mẫu"
                    :maxlength="250"
                    :required="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày lấy mẫu" prop="ngay_lay_mau">
                  <span v-if="isHiddenInput" id="viewNgayLayMau" class="viewSpan">
                    {{ formAddEdit.ngay_lay_mau | formatFullDate_VN }}
                  </span>
                  <el-date-picker
                    v-else
                    id="ngayChungNhanXxAddEdit"
                    v-model="formAddEdit.ngay_lay_mau"
                    clearable
                    format="dd/MM/yyyy"
                    placeholder="DD/MM/YYYY"
                    type="date"
                    :required="true"
                    unlink-panels
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  v-if="isHiddenInput"
                  label="Công chức HQ lấy mẫu 1"
                  prop="cong_chuc_hq_lay_mau1"
                >
                  <span
                    id="viewCongChuc1"
                    class="viewSpan"
                  >{{ formAddEdit.cong_chuc_hq_lay_mau1 }}</span>
                </el-form-item>
                <select-can-bo-hq
                  v-else
                  :is-show-option-all="false"
                  :value.sync="formAddEdit.cong_chuc_hq_lay_mau1"
                  prop-form="cong_chuc_hq_lay_mau1"
                  label="Công chức HQ lấy mẫu 1"
                  placeholder="Công chức HQ lấy mẫu 1"
                  :required="true"
                  :rules="ruleCongChucLayMau1"
                />
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  v-if="isHiddenInput"
                  label="Công chức HQ lấy mẫu 2"
                  prop="cong_chuc_hq_lay_mau2"
                >
                  <span
                    id="viewCongChuc2"
                    class="viewSpan"
                  >{{ formAddEdit.cong_chuc_hq_lay_mau2 }}</span>

                </el-form-item>
                <select-can-bo-hq
                  v-else
                  :is-show-option-all="false"
                  :value.sync="formAddEdit.cong_chuc_hq_lay_mau2"
                  prop-form="cong_chuc_hq_lay_mau2"
                  label="Công chức HQ lấy mẫu 2"
                  placeholder="Công chức HQ lấy mẫu 2"
                  :required="false"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item
                  label="Đại diện người khai HQ"
                  prop="dai_dien_nguoi_khai_hq"
                >
                  <span
                    v-if="isHiddenInput"
                    id="viewDaiDienNguoiKhaiHQ"
                    class="viewSpan"
                  >{{ formAddEdit.dai_dien_nguoi_khai_hq }}</span>

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
                  >{{ formAddEdit.so_luong_mau }}</span>

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
                  >{{ formAddEdit.dac_diem_quy_cach_dong_goi }}</span>

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
                  >{{ formAddEdit.mau_duoc_niem_phong_hq_so }}</span>

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
                  >{{ formAddEdit.nguoi_uy_quyen_nhan_lai_mau }}</span>

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
            </el-row>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <h4>Hồ sơ kèm theo</h4>
              </el-col>
            </el-row>

            <el-row
              v-for="(tailieu, index) in lstTaiLieuKemTheo"
              :key="index"
              class="pad-bottom-10"
              :gutter="20"
            >
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-row class="display-flex" :gutter="20">
                  <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                    <div class="alg-left">
                      {{ tailieu.ten }}
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
                    <div class="alg-left">
                      <el-radio-group
                        v-model="lstCauHoi[index]"
                        size="small"
                        :disabled="isHiddenInput"
                        @change="selectQuestion(index)"
                      >
                        <el-radio :label="radioYes">Có</el-radio>
                        <el-radio :label="radioNo">Không</el-radio>
                      </el-radio-group>
                    </div>
                  </el-col>
                  <el-col
                    v-if="lstCauHoi[index] === radioYes"
                    :xs="24"
                    :sm="24"
                    :md="4"
                    :lg="4"
                    :xl="4"
                  >
                    <div class="alg-left pad-left-20">
                      <el-upload
                        id="formAddFileUploadTLKTHS"
                        ref="uploadTLKTHS"
                        v-model="formAddEdit.fileGUQ"
                        :auto-upload="false"
                        :before-upload="onBeforeUpload"
                        :on-change="handleChangeFileTLKTHS"
                        :on-remove="handleRemoveFileTLKTHS"
                        :on-exceed="handleExceedFile"
                        action="`${process.env.VUE_APP_ZAMMAD}/api/v1/form_submit`"
                        class="upload-demo"
                        :multiple="true"
                        :limit="15"
                        accept="image/jpeg,application/pdf"
                      >
                        <span v-if="isHiddenInput || isHidenGuiHoSo">&nbsp;</span>
                        <el-button
                          v-else
                          id="formAddBtnUploadTk"
                          slot="trigger"
                          icon="el-icon-plus"
                          type="primary"
                          @click="onSelectUpload(tailieu, index)"
                        />
                      </el-upload>
                    </div>
                  </el-col>
                  <el-col
                    v-if="lstCauHoi[index] === radioYes"
                    :xs="24"
                    :sm="24"
                    :md="8"
                    :lg="8"
                    :xl="8"
                  >
                    <ul
                      v-if="
                        lstAttachmentGroup[index] !== undefined &&
                          lstAttachmentGroup[index] !== null
                      "
                      id="ulFile"
                      class="ul-file"
                    >
                      <li
                        v-for="(attachment, idx) in lstAttachmentGroup[index]"
                        :key="idx"
                      >
                        <el-button
                          ref="download"
                          :disabled="!isDownload"
                          class="download-file"
                          @click="downloadFile(attachment)"
                        >{{ attachment.ten_file }}</el-button>
                        <span v-if="isHiddenInput || isHidenGuiHoSo">&nbsp;</span>
                        <el-button
                          v-if="
                            attachment.ten_file !== undefined &&
                              attachment.ten_file !== null &&
                              attachment.ten_file !== '' &&
                              !isHiddenInput
                          "
                          id="btnDelCo"
                          :loading="iconDelLoading"
                          class="ico-delete-file"
                          @click="onDeleteFile(attachment, index, idx)"
                        />
                      </li>
                    </ul>
                  </el-col>
                  <el-col
                    v-if="lstCauHoi[index] === radioNo"
                    :xs="24"
                    :sm="24"
                    :md="12"
                    :lg="12"
                    :xl="12"
                  >
                    <el-form-item prop="ly_do_khong_dinh_kem">
                      <span
                        v-if="isHiddenInput"
                        id="viewLyDoKhongDinhKem"
                        class="viewSpan"
                      >{{ lstLyDoKhongDinhKem[index] }}</span>

                      <el-input-etc
                        v-else
                        id="lyDoKhongDinhKemAddEdit"
                        :v-model.sync="lstLyDoKhongDinhKem[index]"
                        placeholder="Lý do không đính kèm"
                        :maxlength="500"
                        show-word-limit
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <el-row class="pad-top-10" :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-row class="display-flex">
                  <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
                    <div class="alg-left">
                      Giấy tờ khác có liên quan
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
                    <div class="alg-left pad-left-20">
                      <el-upload
                        id="formAddFileUploadGiayToKhac"
                        ref="uploadGTK"
                        v-model="formAddEdit.fileKhac"
                        :auto-upload="false"
                        :before-upload="onBeforeUpload"
                        :on-change="handleChangeFileTLKTHS"
                        :on-remove="handleRemoveFileTLKTHS"
                        :on-exceed="handleExceedFile"
                        action="`${process.env.VUE_APP_ZAMMAD}/api/v1/form_submit`"
                        class="upload-demo"
                        :multiple="true"
                        :limit="15"
                        accept="image/jpeg,application/pdf"
                      >
                        <span v-if="isHiddenInput || isHidenGuiHoSo">&nbsp;</span>
                        <el-button
                          v-else
                          id="formAddBtnUploadTk"
                          slot="trigger"
                          icon="el-icon-plus"
                          type="primary"
                          @click="onSelectUpload(taiLieuKhac, TAI_LIEU_KHAC)"
                        />
                      </el-upload>
                    </div>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
                    <ul
                      v-if="
                        lstAttachmentGroup[lenTLKTHS] !== undefined &&
                          lstAttachmentGroup[lenTLKTHS] !== null
                      "
                      id="ulFile"
                      class="ul-file"
                    >
                      <li
                        v-for="(attachment, idx) in lstAttachmentGroup[lenTLKTHS]"
                        :key="idx"
                      >
                        <el-button
                          ref="download"
                          :disabled="!isDownload"
                          class="download-file"
                          @click="downloadFile(attachment)"
                        >{{ attachment.ten_file }}</el-button>
                        <span v-if="isHiddenInput || isHidenGuiHoSo">&nbsp;</span>
                        <el-button
                          v-if="
                            attachment.ten_file !== undefined &&
                              attachment.ten_file !== null &&
                              attachment.ten_file !== '' &&
                              !isHiddenInput
                          "
                          id="btnDelCo"
                          :loading="iconDelLoading"
                          class="ico-delete-file"
                          @click="onDeleteFile(attachment, lenTLKTHS, idx)"
                        />
                      </li>
                    </ul>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <span
                      v-if="isHiddenInput"
                      id="viewGiayToKhac"
                      class="viewSpan"
                    >{{ formAddEdit.giay_to_khac }}</span>

                    <el-input-etc
                      v-else
                      id="giayToKhacAddEdit"
                      :v-model.sync="formAddEdit.giay_to_khac"
                      placeholder="Giấy tờ khác có liên quan"
                      :maxlength="500"
                      show-word-limit
                    />
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div v-if="flagShowDialog === FORM_MODE.VIEW">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <h3>
                    Thông tin tiếp nhận yêu cầu phân tích hàng xóa xuất khẩu, nhập
                    khẩu
                  </h3>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    v-if="isHiddenInput"
                    label="Trạng thái tiếp nhận yêu cầu"
                    prop="status_pyc"
                  >
                    <span id="statusPhieuYeuCauView" class="viewSpan">
                      {{
                        getMaTrangThaiPhieuYeuCauSelected(formAddEdit.status_pyc)
                      }}
                    </span>
                  </el-form-item>
                  <select-loai-phe-duyet
                    v-else
                    :v-model.sync="formAddEdit.status_pyc"
                    prop="status_pyc"
                    label="Trạng thái tiếp nhận yêu cầu"
                    style="width: 100%"
                    :required="false"
                    :disabled="true"
                  />
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Ngày thực hiện" prop="ngay_thuc_hien_ptpl">
                    <span
                      v-if="isHiddenInput"
                      id="viewNgayPhanCong"
                      class="viewSpan"
                    >
                      {{ formAddEdit.ngay_thuc_hien_ptpl | formatFullDate_VN }}
                    </span>
                    <el-date-picker
                      v-else
                      id="ngayPhanCongAddEdit"
                      v-model="formAddEdit.ngay_thuc_hien_ptpl"
                      clearable
                      format="dd/MM/yyyy"
                      placeholder="DD/MM/YYYY"
                      type="date"
                      unlink-panels
                      style="width: 100%"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    label="Số tiếp nhận"
                    prop="so_phieu_tiep_nhan_ptpl"
                  >
                    <span
                      v-if="isHiddenInput"
                      id="viewStatusTiepNhan"
                      class="viewSpan"
                    >{{ formAddEdit.so_phieu_tiep_nhan_ptpl }}</span>

                    <el-input-etc
                      v-else
                      id="statusTiepNhanAddEdit"
                      :v-model.sync="formAddEdit.so_phieu_tiep_nhan_ptpl"
                      :maxlength="15"
                      show-word-limit
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    label="Số lượng mẫu tiếp nhận"
                    prop="so_luong_mau_tiep_nhan_ptpl"
                  >
                    <span
                      v-if="isHiddenInput"
                      id="viewSoLuongMauTiepNhan"
                      class="viewSpan"
                    >{{ formAddEdit.so_luong_mau_tiep_nhan_ptpl }}</span>

                    <el-input-etc
                      v-else
                      id="soLuongMauTiepNhanAddEdit"
                      :v-model.sync="formAddEdit.so_luong_mau_tiep_nhan_ptpl"
                      :maxlength="15"
                      show-word-limit
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item
                    label="Phân công thực hiện phân tích và lưu ý"
                    prop="luu_yptpl"
                  >
                    <span
                      v-if="isHiddenInput"
                      id="viewPcptVaLuuY"
                      class="viewSpan"
                    >{{ formAddEdit.luu_yptpl }}</span>

                    <el-input-etc
                      v-else
                      id="pcptVaLuuYAddEdit"
                      :v-model.sync="formAddEdit.luu_yptpl"
                      :maxlength="250"
                      show-word-limit
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Người giao" prop="nguoi_giao_ptpl">
                    <span
                      v-if="isHiddenInput"
                      id="viewNguoiGiao"
                      class="viewSpan"
                    >{{ formAddEdit.nguoi_giao_ptpl }}</span>

                    <el-input-etc
                      v-else
                      id="nguoiGiaoAddEdit"
                      :v-model.sync="formAddEdit.nguoi_giao_ptpl"
                      :maxlength="50"
                      show-word-limit
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    label="Người tiếp nhận"
                    prop="nguoi_tiep_nhan_ptpl"
                  >
                    <span
                      v-if="isHiddenInput"
                      id="viewNguoiTiepNhan"
                      class="viewSpan"
                    >{{ formAddEdit.nguoi_tiep_nhan_ptpl }}</span>

                    <el-input-etc
                      v-else
                      id="nguoiTiepNhanAddEdit"
                      :v-model.sync="formAddEdit.nguoi_tiep_nhan_ptpl"
                      :maxlength="50"
                      show-word-limit
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <h3>Thông tin phê duyệt yêu cầu phân tích, phân loại</h3>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    v-if="isHiddenInput"
                    label="Loại phê duyệt"
                    prop="loai_phe_duyet"
                    :required="false"
                  >
                    <span id="maLoaiPheDuyetView" class="viewSpan">
                      {{ getMaLoaiPheDuyetSelected(formAddEdit.loai_phe_duyet) }}
                    </span>
                  </el-form-item>
                  <select-loai-phe-duyet
                    v-else
                    :v-model.sync="formAddEdit.loai_phe_duyet"
                    prop="loai_phe_duyet"
                    label="Loại phê duyệt"
                    clearable
                    :required="false"
                    style="width: 100%"
                    @change="hideShowUserPTPL()"
                  />
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Số phân công PTPL" prop="so_phan_cong">
                    <span
                      v-if="isHiddenInput"
                      id="viewSoPhanCong"
                      class="viewSpan"
                    >{{ formAddEdit.so_phan_cong }}</span>

                    <el-input-etc
                      v-else
                      id="soPhanCongAddEdit"
                      :v-model.sync="formAddEdit.so_phan_cong"
                      :maxlength="50"
                      show-word-limit
                      :required="false"
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="Nội dung phê duyệt" prop="noi_dung">
                    <span
                      v-if="isHiddenInput"
                      id="viewNoiDungPheDuyet"
                      class="viewSpan"
                    >{{ formAddEdit.noi_dung }}</span>
                    <el-input-etc
                      v-else
                      id="noiDungPheDuyetAddEdit"
                      :v-model.sync="formAddEdit.noi_dung"
                      placeholder="Nội dung phê duyệt"
                      :maxlength="500"
                      show-word-limit
                      type="textarea"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Người phê duyệt" prop="ten_user_phan_cong">
                    <span
                      v-if="isHiddenInput"
                      id="viewStatusPheDuyet"
                      class="viewSpan"
                    >{{ formAddEdit.ten_user_phan_cong }}</span>

                    <el-input-etc
                      v-else
                      id="statusPheDuyetAddEdit"
                      :v-model.sync="formAddEdit.ten_user_phan_cong"
                      :maxlength="50"
                      show-word-limit
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Ngày phê duyệt" prop="ngay_phan_cong">
                    <span
                      v-if="isHiddenInput"
                      id="viewNgayPhanCong"
                      class="viewSpan"
                    >
                      {{ formAddEdit.ngay_phan_cong | formatFullDate_VN }}
                    </span>
                    <el-date-picker
                      v-else
                      id="ngayPhanCongAddEdit"
                      v-model="formAddEdit.ngay_phan_cong"
                      clearable
                      format="dd/MM/yyyy"
                      placeholder="DD/MM/YYYY"
                      type="date"
                      unlink-panels
                      :disabled="true"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    v-if="isHiddenInput"
                    label="Chuyên viên phân loại"
                    prop="user_phan_loai"
                  >
                    <span id="maChuyenVienPhanLoaiView" class="viewSpan">
                      {{
                        getMaChuyenVienPhanTichPhanLoai(
                          formAddEdit.user_phan_loai
                        )
                      }}
                    </span>
                  </el-form-item>
                  <select-chuyen-vien-phan-tich-phan-loai
                    v-else
                    ref="chuyenVienPhanLoaiRef"
                    :ma-don-vi="maDonVi"
                    :loai-chuyen-vien="maChuyenVienPhanLoai"
                    :is-get-all="true"
                    :is-show-option-all="false"
                    :value.sync="formAddEdit.user_phan_loai"
                    prop-form="user_phan_loai"
                    label="Chuyên viên phân loại"
                    :required="isPheDuyetThuCong"
                    :rules="ruleCVPL"
                    :clearable="true"
                    :disabled="!isPheDuyetThuCong"
                  />
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item
                    v-if="isHiddenInput"
                    label="Chuyên viên phân tích"
                    prop="user_phan_tich"
                  >
                    <span id="maChuyenVienPhanTichView" class="viewSpan">
                      {{
                        getMaChuyenVienPhanTichPhanLoai(
                          formAddEdit.user_phan_tich
                        )
                      }}
                    </span>
                  </el-form-item>
                  <select-chuyen-vien-phan-tich-phan-loai
                    v-else
                    ref="chuyenVienPhanTichRef"
                    :ma-don-vi="maDonVi"
                    :loai-chuyen-vien="maChuyenVienPhanTich"
                    :is-get-all="true"
                    :is-show-option-all="false"
                    :value.sync="formAddEdit.user_phan_tich"
                    prop-form="user_phan_tich"
                    label="Chuyên viên phân tích"
                    :required="isPheDuyetThuCong"
                    :rules="ruleCVPT"
                    :clearable="true"
                    :disabled="!isPheDuyetThuCong"
                  />
                </el-col>
              </el-row>
            </div>
          </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            id="btnPrint"
            :disabled="!(isPrint && checkPermissionShowButton('[BTN_PRINT]DMHC'))"
            :loading="buttonPrintPdfLoading"
            icon="el-icon-printer"
            type="primary"
            @click="onShowReport()"
          >
            In phiếu YC
          </el-button>
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
                checkPermissionShowButton('[BTN_INSERT]DMHC')
            "
            id="btnTemplate"
            :loading="buttonTemplateLoading"
            icon="el-icon-check"
            type="primary"
            @click="showHideTemplate()"
          >
            Tìm - Sao
          </el-button>
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
            {{ $t('baseLabel.btnSave') }}
          </el-button>
          <el-button
            v-if="
              (flagShowDialog === FORM_MODE.EDIT ||
                (flagShowDialog === FORM_MODE.APPROVE &&
                  isHidenGuiHoSo === false)) &&
                checkPermissionShowButton('[BTN_UPDATE]DMHC')
            "
            id="btnUpdateCo"
            :loading="buttonUpdateLoading"
            icon="el-icon-check"
            type="primary"
            @click="onUpdate('formAddEdit')"
          >
            {{ $t('baseLabel.btnSave') }}
          </el-button>

          <el-button
            id="btnSendCo"
            :disabled="!(
              flagShowDialog !== FORM_MODE.APPROVE &&
              isShowBtnSend &&
              checkPermissionShowButton('[BTN_UPDATE]DMHC'))
            "
            :loading="buttonSendLoading"
            icon="el-icon-check"
            type="primary"
            @click="onSendHoSo('formAddEdit')"
          >
            Gửi phiếu YC
          </el-button>
          <el-button id="btnCancelCo" @click="isShowDlgAddEdit = false">{{
            $t('baseLabel.btnCancel')
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
    </div> -->
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
<script src="./dm-hoachat-controller.js" />
<style scoped></style>
