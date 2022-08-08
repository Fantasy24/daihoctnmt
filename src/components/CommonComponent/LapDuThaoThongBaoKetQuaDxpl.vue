<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="Thông tin dự thảo thông báo"
      :visible.sync="isShowDlgAddEdit"
      width="80%"
    >
      <el-form
        id="formAddEdit"
        ref="formAddEdit"
        :model="formAddEdit"
        :rules="rules"
        label-width="180px"
        :disabled="isHidenGuiHoSo"
      >
        <el-tabs v-model="tabIndex" type="border-card">
          <el-row v-show="false" :gutter="20">
            <select-trang-thai-phieu-ptpl
              :is-filter="true"
              :filter-data="loaiHoSo"
              :get-list="getTrangThaiDuThao"
            />
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Căn cứ lập thông báo" prop="can_cu_lap_tb">
                <span
                  v-if="isHiddenInput"
                  id="viewCanCuLapTb"
                  class="viewSpan"
                >{{ formAddEdit.can_cu_lap_tb }}</span>

                <el-input-etc
                  v-else
                  id="soPhieuYeuCauAddEdit"
                  :v-model.sync="formAddEdit.can_cu_lap_tb"
                  placeholder="Căn cứ lập thông báo"
                  :maxlength="4000"
                  type="textarea"
                  :rows="3"
                  :disabled="false"
                  show-word-limit
                />
              </el-form-item>
            </el-col>

          </el-row>

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
                  :maxlength="18"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Ngày yêu cầu" prop="ngay_lap">
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
                  :disabled="true"
                  :required="true"
                  unlink-panels
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item
                label="Số phiếu tiếp nhận"
                prop="so_phieu_tiep_nhan_ptpl"
              >
                <span
                  v-if="isHiddenInput"
                  id="viewSoPhieuTiepNhanPtpl"
                  class="viewSpan"
                >{{ formAddEdit.so_phieu_tiep_nhan_ptpl }}</span>

                <el-input-etc
                  v-else
                  id="soPhieuTiepNhanAddEdit"
                  :v-model.sync="formAddEdit.so_phieu_tiep_nhan_ptpl"
                  placeholder="Số phiếu tiếp nhận"
                  :maxlength="18"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Ngày tiếp nhận" prop="ngay_tiep_nhan">
                <span
                  v-if="isHiddenInput"
                  id="viewNgayThucHienPtpl"
                  class="viewSpan"
                >
                  {{ formAddEdit.ngay_tiep_nhan | formatFullDate_VN }}
                </span>
                <el-date-picker
                  v-else
                  id="ngayTiepNhanAddEdit"
                  v-model="formAddEdit.ngay_tiep_nhan"
                  clearable
                  format="dd/MM/yyyy"
                  placeholder="DD/MM/YYYY"
                  type="date"
                  :disabled="true"
                  :required="true"
                  unlink-panels
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item v-if="isHiddenInput" label="Đơn vị yêu cầu phân tích" prop="hq_yeu_cau_phan_tich">
                <span
                  id="viewMaHaiQuanYCPT"
                  class="viewSpan"
                >{{ ''.concat(formAddEdit.hq_yeu_cau_phan_tich,' - ', getHaiQuanByMa(formAddEdit.hq_yeu_cau_phan_tich)) }}
                </span>
              </el-form-item>
              <select-list-ma-hq
                v-else
                :is-get-all="isGetAllHq"
                :is-show-option-all="isShowOptionAllHqEdit"
                :label="labelHqYcPt"
                :s-cusid.sync="formAddEdit.hq_yeu_cau_phan_tich"
                prop-form="hq_yeu_cau_phan_tich"
                :required="false"
                :disabled="true"
                :store="$store"
              />
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item
                v-if="isHiddenInput"
                label="Đơn vị tiếp nhận PT"
                prop="hq_tiep_nhan_yeu_cau_phan_tich"
              >
                <span
                  v-if="isHiddenInput"
                  id="viewMaHaiQuanPT"
                  class="viewSpan"
                >{{ ''.concat(formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich,' - ', getHaiQuanByMa(formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich)) }}
                </span>
              </el-form-item>
              <select-list-ma-hq
                v-else
                :is-get-all="isGetAllHq"
                :is-show-option-all="isShowOptionAllHqEdit"
                :label="labelHqPt"
                :s-cusid.sync="formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich"
                prop-form="hq_tiep_nhan_yeu_cau_phan_tich"
                :required="false"
                :disabled="true"
                :store="$store"
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
                  :disabled="true"
                  show-word-limit
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
                  :disabled="true"
                  unlink-panels
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Đơn vị XNK" prop="ma_dvxnk">
                <span v-if="isHiddenInput" id="viewDonViXnk" class="viewSpan">{{
                  formAddEdit.ma_dvxnk
                }}</span>

                <el-input-etc
                  v-else
                  id="donViXnkAddEdit"
                  :v-model.sync="formAddEdit.ma_dvxnk"
                  placeholder="Đơn vị XNK"
                  :maxlength="250"
                  :required="true"
                  :disabled="true"
                  show-word-limit
                  @blur="getDvxnkByMa(formAddEdit.ma_dvxnk)"
                />
              </el-form-item>
            </el-col>
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
                  :maxlength="250"
                  :required="true"
                  :disabled="true"
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
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col v-if="loaiDuThao === 2" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Chuyên viên phân loại" prop="ten_user_phan_loai">
                <span v-if="isHiddenInput" id="viewChuyenVienPL" class="viewSpan">{{
                  formAddEdit.ten_user_phan_loai
                }}</span>

                <el-input-etc
                  v-else
                  id="chuyenVienPhanLoaiAddEdit"
                  :v-model.sync="formAddEdit.ten_user_phan_loai"
                  placeholder="Chuyên viên phân loại"
                  :maxlength="18"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col v-if="loaiDuThao === 1" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Chuyên viên phân tích" prop="ten_user_phan_tich">
                <span
                  v-if="isHiddenInput"
                  id="viewChuyenVienPhanTich"
                  class="viewSpan"
                >{{ formAddEdit.ten_user_phan_tich }}</span>

                <el-input-etc
                  v-else
                  id="chuyenVienPhanTichAddEdit"
                  :v-model.sync="formAddEdit.ten_user_phan_tich"
                  placeholder="Chuyên viên phân tích"
                  :maxlength="18"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <h4>Kết quả phân tích</h4>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item
                label="Mô tả và đặc tính HH"
                prop="mo_ta_hang_hoa_by_mhs_tc"
              >
                <span
                  v-if="isHiddenInput"
                  id="viewMotaDacTinhHh"
                  class="viewSpan"
                >{{ formAddEdit.mo_ta_hang_hoa_by_mhs_tc }}</span>

                <el-input-etc
                  v-else
                  id="moTaDacTinhAddEdit"
                  :v-model.sync="formAddEdit.mo_ta_hang_hoa_by_mhs_tc"
                  placeholder="Mô tả và đặc tính hàng hóa"
                  :maxlength="500"
                  :required="true"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Tên hàng hóa" prop="ten_hang_kb_by_mhs_tc">
                <span v-if="isHiddenInput" id="viewTenHh" class="viewSpan">{{
                  formAddEdit.ten_hang_kb_by_mhs_tc
                }}</span>

                <el-input-etc
                  v-else
                  id="tenHangHoaAddEdit"
                  :v-model.sync="formAddEdit.ten_hang_kb_by_mhs_tc"
                  placeholder="Tên hàng hóa"
                  :maxlength="500"
                  :required="true"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Mã số đề xuất" prop="ma_so_du_kien_phan_loai">
                <span v-if="isHiddenInput" id="viewMaSoDeXuat" class="viewSpan">{{
                  formAddEdit.ma_so_du_kien_phan_loai
                }}</span>

                <el-input-etc
                  v-else
                  id="tenHangHoaAddEdit"
                  :v-model.sync="formAddEdit.ma_so_du_kien_phan_loai"
                  placeholder="Mã số đề xuất"
                  :maxlength="500"
                  :required="true"
                  :disabled="true"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
              <el-row class="display-flex">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div class="alg-left">
                    <el-form-item label="File đính kèm" />
                  </div>
                  <div class="alg-left pad-left-20">
                    <el-upload
                      id="formAddFileUploadGUQKBBK"
                      ref="uploadDuThao"
                      v-model="formAddEdit.fileGUQ"
                      :auto-upload="false"
                      :before-upload="onBeforeUpload"
                      :on-change="handleChangeFile"
                      :on-remove="handleRemoveFile"
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
                      />
                    </el-upload>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
              <ul id="ulFile" class="ul-file">
                <li v-for="(item, index) in lstAttachment" :key="index">
                  <el-button
                    ref="download"
                    :disabled="!isDownload"
                    class="download-file"
                    @click="downloadFile(item)"
                  >{{ item.ten_file }}</el-button>
                  <span v-if="isHiddenInput || isHidenGuiHoSo">&nbsp;</span>
                  <el-button
                    v-else
                    id="btnDelCo"
                    :loading="iconDelLoading"
                    class="ico-delete-file"
                    @click="onDeleteFile(item)"
                  />
                </li>
              </ul>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <h4>Thông tin thông báo</h4>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Số thông báo" prop="so_thong_bao">
                <span v-if="isHiddenInput" id="viewSoThongBao" class="viewSpan">{{
                  formAddEdit.so_thong_bao
                }}</span>

                <el-input-etc
                  v-else
                  id="soThongBaoAddEdit"
                  :v-model.sync="formAddEdit.so_thong_bao"
                  placeholder="Số thông báo"
                  :maxlength="50"
                  :required="true"
                  :disabled="isDisabledEdit"
                  show-word-limit
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item
                v-if="isHiddenInput"
                label="Trạng thái"
                prop="trang_thai"
              >
                <span
                  v-if="isHiddenInput"
                  id="viewTrangThai"
                  class="viewSpan"
                >{{ getTrangThaiDuThaoByMa(formAddEdit.trang_thai) }}
                </span>
              </el-form-item>
              <select-trang-thai-phieu-ptpl
                v-else
                label-option="Tất cả"
                :value.sync="formAddEdit.trang_thai"
                label="Trạng thái thông báo"
                prop-form="trang_thai"
                :is-filter="true"
                :filter-data="loaiHoSo"
                :disabled="isDisabledEdit"
              />
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Lãnh đạo chi cục" prop="ten_lanh_dao">
                <span v-if="isHiddenInput" id="viewTenLanhDao" class="viewSpan">{{
                  formAddEdit.ten_lanh_dao
                }}</span>

                <el-input-etc
                  v-else
                  id="tenLanhDaoAddEdit"
                  :v-model.sync="formAddEdit.ten_lanh_dao"
                  placeholder="Lãnh đạo chi cục"
                  :maxlength="50"
                  :disabled="isDisabledEdit"
                  show-word-limit
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item label="Ngày ký" prop="ngay_thong_bao">
                <span v-if="isHiddenInput" id="viewNgayThongbao" class="viewSpan">
                  {{ formAddEdit.ngay_thong_bao | formatFullDate_VN }}
                </span>
                <el-date-picker
                  v-else
                  id="ngayThongBaoAddEdit"
                  v-model="formAddEdit.ngay_thong_bao"
                  clearable
                  format="dd/MM/yyyy"
                  placeholder="DD/MM/YYYY"
                  type="date"
                  :required="true"
                  :disabled="isDisabledEdit"
                  unlink-panels
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="Ý kiến lãnh đạo" prop="ykien_lanh_dao">
                <span v-if="isHiddenInput" id="viewTenHh" class="viewSpan">{{
                  formAddEdit.ykien_lanh_dao
                }}</span>

                <el-input-etc
                  v-else
                  id="yKienLanhDaoAddEdit"
                  :v-model.sync="formAddEdit.ykien_lanh_dao"
                  placeholder="Ý kiến lãnh đạo"
                  :maxlength="500"
                  :required="true"
                  :disabled="isDisabledEdit"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tabs>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="isPrint && checkPermissionShowButton('[BTN_PRINT]' + menuCode)"
          id="btnPrint"
          :loading="buttonPrintLoading"
          icon="el-icon-printer"
          type="primary"
          @click="onPrintPreviewDuThao()"
        >
          In dự thảo
        </el-button>
        <el-button
          v-if="
            flagShowDialog === FORM_MODE.CREATE &&
              checkPermissionShowButton('[BTN_INSERT]' + menuCode)
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
              checkPermissionShowButton('[BTN_UPDATE]' + menuCode)
          "
          id="btnUpdateCo"
          :loading="buttonUpdateLoading"
          icon="el-icon-check"
          type="primary"
          @click="onUpdate('formAddEdit')"
        >
          {{ $t('baseLabel.btnSave') }}
        </el-button>
        <el-button id="btnCancelCo" @click="isShowDlgAddEdit = false">{{
          $t('baseLabel.btnCancel')
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :title="printTitle"
      :visible.sync="isShowDlgPrint"
      width="90%"
    >
      <el-form
        label-width="275px"
      >
        <iframe :src="pdfSource" style="width: 100%;height: 500px; border: none;" title="" />
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          id="btnPrint"
          :loading="buttonPrintLoading"
          icon="el-icon-printer"
          type="primary"
          @click="onPrintDuThao()"
        >
          In
        </el-button>

        <el-button id="btnCancelCo" @click="isShowDlgPrint = false">{{
          $t('baseLabel.btnCancel')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  errAlert,
  ERROR,
  showAlert,
  showConfirmDelete,
  SUCCESS,
  WARNING
} from 'ff24-js/src/utils/AlertMessage'
import apiFactory from '../../api/apiFactory'
import ConstantAPI from '../../utils/ConstantAPI'
import { FORM_MODE } from '../../utils/Constant'
import SelectTrangThaiPhieuPtpl from './SelectTrangThaiPhieuPtpl'
import checkPermissionShowButton from 'ff24-js/src/utils/ECustomsUtils'
import {
  validateFileExtension,
  maxFileSize,
  checkIsValidFileSize,
  camelCaseToSnakeCaseDeep,
  LIST_CUSTOMS
} from '../../utils/ECustomsUtils'

const STATUS_TAO_MOI = 1
const GUI_PHIEU_YC = 1 // 2
const LIMIT_UPLOAD_FILE = 15
const PHIEU_YC_PRINT_FILE_NAME = 'DuThaoThongBao.pdf'
const ACTION_MODE = { DEFAULT: 0, INSERT: 1, UPDATE: 2, SEND: 3 }

export default {
  components: {
    SelectTrangThaiPhieuPtpl
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    showDlgLapDuThao: {
      type: Boolean,
      default: false
    },
    propForm: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: ''
    },
    loaiHs: {
      type: String,
      default: '0'
    },
    idHs: {
      type: Number,
      default: 0
    },
    closeHistory: Function,
    funSuccess: Function,
    funError: Function,
    closeFormAddEdit: Function,
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
      default: 'Đơn vị tiếp nhận PT'
    },
    labelHqYcPt: {
      type: String,
      default: 'Đơn vị yêu cầu phân tích'
    },
    labelOptionAllHq: {
      type: String,
      default: 'Tất cả'
    },
    // Lap du thao
    formMode: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      printTitle: '',
      isShowDlgPrint: false,
      pdfSource: '',
      tabIndex: 0,
      iconEditLoading: false,
      buttonUpdateLoading: false,
      buttonSaveLoading: false,
      buttonPrintLoading: false,
      iconDelLoading: false,
      iconShowKBBKLoading: false,
      isShowDlgAddEdit: false,
      isDisabledView: false,
      isDisabledEdit: false,
      isDownload: true,
      isPrint: false,
      flagShowDialog: this.formMode,
      menuCode: '',
      loaiHoSo: 75,
      loaiDuThao: 0,
      param: {
        id: this.idHs,
        loaiHoSo: this.loaiHs,
        maDvxnk: this.$store.getters.userInfo.org,
        page: this.page,
        size: this.size
      },
      page: 0,
      size: 500,
      total: 0,
      disableWhenEdit: false,
      isHiddenInput: false,
      isHidenGuiHoSo: false,
      fileListUpload: [],
      fileListDelete: [],
      lstAttachment: [],
      listDataTable: [],
      loadDataTable: false,
      lstTrangThai: [],
      lapDuThao: {},
      lapDuThaoData: {},
      formAddEdit: {
        id: 0,
        fileDinhKem: '',
        lstFileDelete: '',
        is_change_detail: false,
        status: null,
        // thông tin du thao
        can_cu_lap_tb: '',
        so_phieu_yeu_cau: '',
        ngay_lap: null,
        so_phieu_tiep_nhan_ptpl: '',
        ngay_tiep_nhan: '',
        hq_yeu_cau_phan_tich: '',
        hq_tiep_nhan_yeu_cau_phan_tich: '',
        so_to_khai: '',
        ngay_dk_to_khai: null,
        ma_dvxnk: '',
        ma_hang_khai_bao: '',
        ten_hang_khai_bao: '',
        nguoi_giao_ptpl: '',
        ten_user_phan_loai: '',
        ten_user_phan_tich: '',
        mo_ta_hang_hoa_by_mhs_tc: '',
        ten_hang_kb_by_mhs_tc: '',
        ma_so_du_kien_phan_loai: '',
        so_thong_bao: '',
        trang_thai: '',
        ten_lanh_dao: '',
        ngay_thong_bao: '',
        ykien_lanh_dao: '',
        // Yeu cau tra mau
        id_phieu_yeu_cau: 0,
        loai_tra_mau: 1,
        ngay_tra_mau: null,
        gio_tra_mau: null,
        ma_dvkd: this.$store.getters.userInfo.org,
        ten_dvkd: this.$store.getters.userInfo.orgName,
        id_phieu_yeu_cau_ptpl: '',
        don_vi_yeu_cau_tra_mau: '',
        so_cong_van_yctm: '',
        ngay_cong_van_yctm: '',
        so_luong_mau_tra_lai: 0,
        nguoi_nhan_lai_mau: '',
        cmt_nguoi_nhan: '',
        giay_uy_quyen: '',
        ngay_uy_quyen: '',
        nguoi_tra_mau: '',
        chuc_vu: '',
        luu_y: '',
        so_tbkq_phan_tich: '',
        ngay_tbkq_phan_tich: null,
        trang_thai_phe_duyet: null,
        version: null,
        is_latest: null
      },
      rules: {
        ma_dvkd: [
          this.requiredRule('Đơn vị tiếp nhận phân tích'),
          this.specialCharRule('Đơn vị tiếp nhận phân tích')
        ],

        ngay_tra_mau: [this.requiredRule('Thời gian trả mẫu')],
        so_luong_mau_tra_lai: [this.requiredRule('Số lượng mẫu trả lại')],
        don_vi_yeu_cau_tra_mau: [this.requiredRule('Đơn vị đề nghị trả mẫu')],
        so_cong_van_yctm: [this.requiredRule('Số công văn đề nghị trả mẫu')],
        ngay_cong_van_yctm: [this.requiredRule('Ngày công văn')],
        nguoi_nhan_lai_mau: [this.requiredRule('Người nhận lại mẫu')],
        cmt_nguoi_nhan: [this.requiredRule('CMTND/CCCD/HC')],
        nguoi_tra_mau: [this.requiredRule('Người trả mẫu')],
        chuc_vu: [this.requiredRule('Chức vụ')]
      },
      FORM_MODE
    }
  },
  computed: {
    syncTotal: {
      get() {
        return this.total
      },
      set(total) {
        this.$emit('update:total', total)
      }
    }
  },
  watch: {
    showDlgTemplate(newValue) {
      this.flagShowDialog = newValue
    }
  },

  mounted() {
    // this.onLoadForm()    // this.onLoadList()
  },
  methods: {
    checkPermissionShowButton(idButton) {
      return checkPermissionShowButton(this.menuCode, idButton)
    },
    onChoose(row) {
      this.fillHistory(row)
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
          // console.log('Mã đơn vị XNK không tồn tại trên hệ thống')
          this.formAddEdit.ma_dvxnk = ''
          this.formAddEdit.ten_dvxnk = ''
        })
    },
    loadForm(lapDt) {
      this.lapDuThao = lapDt
      // console.log(lapDt)
      this.isShowDlgAddEdit = true
      this.menuCode = this.lapDuThao.menu_code
      this.loaiDuThao = this.lapDuThao.loai_du_thao
      this.flagShowDialog = this.lapDuThao.form_mode
      if (this.flagShowDialog === FORM_MODE.CREATE || this.flagShowDialog === FORM_MODE.EDIT) {
        this.isDisabledEdit = true
        this.isHiddenInput = false
        this.isPrint = false
      } else if (this.flagShowDialog === FORM_MODE.VIEW) {
        this.isHiddenInput = true
        this.isPrint = true
      } else {
        this.isDisabledEdit = false
        this.isHiddenInput = false
        this.isPrint = false
        // this.onPreEdit()
      }

      this.onPreInsert()
    },
    onPreInsert() {
      if (this.$refs.formAddEdit) {
        this.$refs.formAddEdit.resetFields()
      }
      if (this.$refs.uploadDuThao) {
        this.$refs.uploadDuThao.clearFiles()
      }

      this.fileListUpload = []
      this.fileListDelete = []
      this.lstAttachment = []
      this.listDataTable = []

      this.formAddEdit.id = 0
      this.formAddEdit.fileDinhKem = ''
      this.formAddEdit.lstFileDelete = ''
      this.formAddEdit.is_change_detail = false
      this.formAddEdit.status = null
      this.formAddEdit.so_phieu_yeu_cau = ''
      // thông tin du thao
      this.formAddEdit.ngay_lap = null
      this.formAddEdit.so_phieu_tiep_nhan_ptpl = ''
      this.formAddEdit.ngay_tiep_nhan = ''
      this.formAddEdit.hq_yeu_cau_phan_tich = ''
      this.formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich = ''
      this.formAddEdit.so_to_khai = ''
      this.formAddEdit.ngay_dk_to_khai = null
      this.formAddEdit.ma_dvxnk = ''
      this.formAddEdit.ma_hang_khai_bao = ''
      this.formAddEdit.ten_hang_khai_bao = ''
      this.formAddEdit.nguoi_giao_ptpl = ''
      this.formAddEdit.ten_user_phan_loai = ''
      this.formAddEdit.ten_user_phan_tich = ''
      this.formAddEdit.mo_ta_hang_hoa_by_mhs_tc = ''
      this.formAddEdit.ten_hang_kb_by_mhs_tc = ''
      this.formAddEdit.ma_so_du_kien_phan_loai = ''
      this.formAddEdit.so_thong_bao = ''
      this.formAddEdit.trang_thai = null
      this.formAddEdit.ten_lanh_dao = ''
      this.formAddEdit.ngay_thong_bao = ''
      this.formAddEdit.ykien_lanh_dao = ''
      this.formAddEdit.can_cu_lap_tb = ''

      if (this.flagShowDialog === FORM_MODE.CREATE) {
        this.formAddEdit.can_cu_lap_tb = ''.concat('Căn cứ Luật Hải quan số 54/2014/QH13 ngày 23 tháng 6 năm 2014;\n', 'Căn cứ Nghị định số 08/2015/NĐ-CP ngày 21 tháng 01 năm 2015 của Chính phủ quy định chi tiết và biện pháp thi hành Luật Hải quan về thủ tục hải quan, kiểm tra giám sát, kiểm soát hải quan; Nghị định số 59/2018/NĐ-CP ngày 20 tháng 4 năm 2018 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định số 08/2015/NĐ-CP ngày 21 tháng 01 năm 2015\n', 'Căn cứ Thông tư số 14/2015/TT-BTC ngày 30/01/2015 của Bộ Tài chính hướng dẫn về phân loại hàng hóa, phân tích để phân loại hàng hóa, phân tích để kiểm tra chất lượng, kiểm tra an toàn thực phẩm; Thông tư số 17/2021/TT-BTC ngày 26/02/2021 của Bộ Tài chính sửa đổi, bổ sung Thông tư số 14/2015/TT-BTC ngày 30/01/2015 của Bộ Tài chính; Thông tư số 65/2017/TT-BTC ngày 27/06/2017 của Bộ Tài chính về việc ban hành Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam;')
      }

      let endpoint = 'SELECT_ITEM_BY_ID_DE_XUAT'
      const param = {
        id: this.lapDuThao.id_de_xuat_phan_loai
      }
      if (this.lapDuThao.id_du_thao_thong_bao !== undefined && this.lapDuThao.id_du_thao_thong_bao !== null && this.lapDuThao.id_du_thao_thong_bao > 0) {
        param.id = this.lapDuThao.id_du_thao_thong_bao
        endpoint = 'SELECT_ITEM_BY_ID_DUTHAO'
      }

      apiFactory
        .callAPI(
          ConstantAPI[this.menuCode][endpoint],
          {},
          param
        )
        .then(rs => {
          this.preEditDetails(rs)
          this.iconEditLoading = false
          this.isShowDlgAddEdit = true
          // this.isPrint = true
          this.showHideBtnUpdate()
          this.showHideBtnTrinhPheDuyet()
        })
        .catch(() => {
          this.iconEditLoading = false
          // showAlert(this, WARNING, 'Bản ghi không tồn tại trên hệ thống')
        })
    },
    preEditDetails(rs) {
      const arrDK = [undefined, null, '']
      if (arrDK.indexOf(rs) === -1) {
        // console.log(rs)
        this.lapDuThaoData = rs
        this.loadDataFormAddEdit(rs)
        this.lapDuThao.id_du_thao_thong_bao = rs.du_thao_tb_dto.id_du_thao_thong_bao
        this.lapDuThao.id_de_xuat_phan_loai = rs.de_xuat_pl_dto.id_de_xuat_phan_loai
        this.lapDuThao.id_phieu_yeu_cau = rs.yeu_cau_pl_dto.id_phieu_yeu_cau
        // File
        this.getLstAttachment(rs)
        // this.checkGuiHoSoPreEdit()
      }
    },

    getLstAttachment(rs) {
      const arrDK = [undefined, null, '']
      const files = []
      this.fileTepNoiDung = null
      this.fileBienBanTraMau = null
      let len = 0
      let i = 0
      // Them list File
      const filesTmp = rs.du_thao_tb_dto.files
      if (arrDK.indexOf(filesTmp) === -1) {
        len = filesTmp.length
        while (i < len) {
          files.push(filesTmp[i])
          i++
        }
      }

      files.sort((a, b) => a.id_tai_lieu - b.id_tai_lieu)
      // Danh sach tai lieu
      this.lstAttachment = files
    },
    checkGuiHoSoPreEdit() {
      if (this.formAddEdit.trang_thai === GUI_PHIEU_YC) {
        this.flagShowDialog = FORM_MODE.APPROVE
        // Disabled all khi Edit gui ho so
        // this.isHidenGuiHoSo = true
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
    loadDataFormAddEdit(rs) {
      this.formAddEdit.id = 0
      this.formAddEdit.loai_du_thao = this.loaiDuThao
      this.formAddEdit.fileDinhKem = ''
      this.formAddEdit.lstFileDelete = ''
      this.formAddEdit.is_change_detail = false
      this.formAddEdit.status = null
      // Id
      this.formAddEdit.id_de_xuat_phan_loai = rs.de_xuat_pl_dto.id_de_xuat_phan_loai
      this.formAddEdit.id_phieu_yeu_cau = rs.yeu_cau_pl_dto.id_phieu_yeu_cau
      this.formAddEdit.id_du_thao_thong_bao = rs.du_thao_tb_dto !== null ? rs.du_thao_tb_dto.id_du_thao_thong_bao : null

      // phieu yeu cau ptpl
      this.formAddEdit.so_phieu_yeu_cau = rs.yeu_cau_pl_dto.so_phieu_yeu_cau
      this.formAddEdit.ngay_lap = rs.yeu_cau_pl_dto.ngay_lap
      this.formAddEdit.so_phieu_tiep_nhan_ptpl = rs.yeu_cau_pl_dto.so_phieu_tiep_nhan_ptpl
      this.formAddEdit.ngay_tiep_nhan = rs.yeu_cau_pl_dto.ngay_tiep_nhan
      this.formAddEdit.hq_yeu_cau_phan_tich = rs.yeu_cau_pl_dto.hq_yeu_cau_phan_tich
      this.formAddEdit.hq_tiep_nhan_yeu_cau_phan_tich = rs.yeu_cau_pl_dto.hq_tiep_nhan_yeu_cau_phan_tich
      this.formAddEdit.so_to_khai = rs.yeu_cau_pl_dto.so_to_khai
      this.formAddEdit.ngay_dk_to_khai = rs.yeu_cau_pl_dto.ngay_dk_to_khai
      this.formAddEdit.ma_dvxnk = rs.yeu_cau_pl_dto.ma_dvxnk
      this.formAddEdit.ma_hang_khai_bao = rs.yeu_cau_pl_dto.ma_hang_khai_bao
      this.formAddEdit.ten_hang_khai_bao = rs.yeu_cau_pl_dto.ten_hang_khai_bao
      this.formAddEdit.nguoi_giao_ptpl = ''
      this.formAddEdit.ten_user_phan_loai = rs.yeu_cau_pl_dto.ten_user_phan_loai
      this.formAddEdit.ten_user_phan_tich = rs.yeu_cau_pl_dto.ten_user_phan_tich
      // De xuat phan loai
      this.formAddEdit.mo_ta_hang_hoa_by_mhs_tc = rs.de_xuat_pl_dto.mo_ta_hang_hoa_by_mhs_tc
      this.formAddEdit.ten_hang_kb_by_mhs_tc = rs.de_xuat_pl_dto.ten_hang_kb_by_mhs_tc
      this.formAddEdit.ma_so_du_kien_phan_loai = rs.de_xuat_pl_dto.ma_so_du_kien_phan_loai
      // Du thao thong bao
      this.formAddEdit.so_thong_bao = rs.du_thao_tb_dto.so_thong_bao
      this.formAddEdit.trang_thai = rs.du_thao_tb_dto.trang_thai !== 2 && rs.du_thao_tb_dto.trang_thai !== 3 ? 1 : rs.du_thao_tb_dto.trang_thai
      this.formAddEdit.ten_lanh_dao = rs.du_thao_tb_dto.ten_lanh_dao
      this.formAddEdit.ngay_thong_bao = rs.du_thao_tb_dto.ngay_thong_bao
      this.formAddEdit.ykien_lanh_dao = rs.du_thao_tb_dto.ykien_lanh_dao
      this.formAddEdit.can_cu_lap_tb = rs.du_thao_tb_dto.can_cu_lap_tb

      // Show hide Button Update
      const arrDK = [undefined, null, '']
      if (
        arrDK.indexOf(rs.du_thao_tb_dto) === -1 &&
        rs.du_thao_tb_dto.id_du_thao_thong_bao > 0 &&
        this.lapDuThao.form_mode !== FORM_MODE.VIEW
      ) {
        this.flagShowDialog = FORM_MODE.EDIT
      }
    },
    onInsert(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }

        if (!this.validateFileUpload()) {
          return false
        }
        const duThaoTb = this.getLapDuThaoByForm()
        if (!this.validateFileUploadMaxSize(duThaoTb.files)) {
          return false
        }
        // console.log(JSON.stringify(duThaoTb))

        this.buttonAction =
          this.buttonAction !== ACTION_MODE.SEND
            ? ACTION_MODE.INSERT
            : ACTION_MODE.SEND

        this.showBtnLoading(true)
        apiFactory
          .callAPIFormFile(
            ConstantAPI[this.menuCode].INSERT,
            duThaoTb,
            this.fileListUpload
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Thêm mới thành công!')
            this.showBtnLoading(false)
            if (this.funSuccess !== undefined && this.funSuccess !== null) {
              this.funSuccess()
              this.closeFormAddEdit()
            }
            this.isShowDlgAddEdit = false
            // console.log(rs)
          })
          .catch(err => {
            errAlert(this, err)
            this.showBtnLoading(false)
            this.isShowDlgAddEdit = false
          })
      })
    },
    onUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false
        }
        if (!this.validateFileUpload()) {
          return false
        }
        const duThaoTb = this.getLapDuThaoByFormUpdate()
        if (!this.validateFileUploadMaxSize(duThaoTb.files)) {
          return false
        }
        // console.log(duThaoTb)
        this.buttonAction =
          this.buttonAction !== ACTION_MODE.SEND
            ? ACTION_MODE.UPDATE
            : ACTION_MODE.SEND
        this.showBtnLoading(true)
        apiFactory
          .callAPIFormFile(
            ConstantAPI[this.menuCode].UPDATE,
            duThaoTb,
            this.fileListUpload
          )
          .then(() => {
            showAlert(this, SUCCESS, 'Cập nhật thành công!')
            this.showBtnLoading(false)
            if (this.funSuccess !== undefined && this.funSuccess !== null) {
              this.funSuccess('')
            }
            this.isShowDlgAddEdit = false
          })
          .catch(err => {
            showAlert(this, ERROR, 'Lỗi! ' + err.message)
            this.showBtnLoading(false)
            this.isShowDlgAddEdit = true
          })
      })
    },
    validateFileSize(files) {
      let totalSize = 0
      for (const obj of files) {
        totalSize += obj.file_size
      }
      return checkIsValidFileSize(totalSize, maxFileSize)
    },
    validateFileUploadMaxSize(lstFile) {
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
    validateFileUpload() {
      if (this.fileListUpload.length === 0) {
        if (this.lstAttachment.length === 0) {
          showAlert(this, WARNING, 'Bạn phải đính kèm file')
          return false
        }
      }
      if (
        this.fileListUpload.length + this.lstAttachment.length >
        LIMIT_UPLOAD_FILE
      ) {
        showAlert(this, WARNING, 'Bạn chỉ được đính kèm'.concat(LIMIT_UPLOAD_FILE, ' file'))
        return false
      }
      let len = this.fileListUpload.length
      while (len--) {
        if (!validateFileExtension(this.fileListUpload[len].raw)) {
          showAlert(
            this,
            WARNING,
            'File đính kèm không đúng định dạng hoặc tên file không được có ký tự đặc biệt và không được viết tiếng việt có dấu'
          )
          return false
        }
      }

      return true
    },
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 5

      return isIMAGE && isLt1M
    },
    handleChangeFile(file) {
      this.fileTemp = file.raw
      if (this.fileTemp) {
        // this.fileListUpload = fileList
        this.fileListUpload.push(file)
      } else {
        showAlert(this, WARNING, 'Bạn hãy chọn file cần upload')
      }
    },
    // How to remove files
    handleRemoveFile(file) {
      // this.fileListUpload = fileList
      const lstFile = this.fileListUpload.filter(obj => obj !== file)
      this.fileListUpload = lstFile
      this.fileTemp = null
      // console.log(this.fileListUpload)
    },
    handleExceedFile() {
      showAlert(
        this,
        WARNING,
        'Bạn chỉ được đính kèm '.concat(
          LIMIT_UPLOAD_FILE,
          ' file. Hãy xóa file hiện tại trước khi upload file mới'
        )
      )
    },
    onDeleteFile(objFile) {
      showConfirmDelete(this.$confirm, () => {
        this.fileListDelete.push(objFile.id_tai_lieu)
        this.lstAttachment = this.lstAttachment.filter(item => item !== objFile)
      })
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
    getHaiQuanByMa(choose) {
      const lstHQ = JSON.parse(localStorage.getItem(LIST_CUSTOMS))
      lstHQ.forEach(hq => {
        if (choose === hq.code) {
          choose = hq.name
        }
      })
      return choose
    },
    getTrangThaiDuThao(lstValue) {
      this.lstTrangThai = lstValue
    },
    getTrangThaiDuThaoByMa(choose) {
      this.lstTrangThai.forEach(duThao => {
        if (Number(choose) === duThao.ma) {
          choose = duThao.ten
        }
      })
      return choose
    },
    getLapDuThaoByForm() {
      let objDuThao = {}
      this.formAddEdit.lstFileDelete = this.fileListDelete.join(',')
      this.formAddEdit.loai_du_thao = this.loaiDuThao
      if (this.formAddEdit.trang_thai === undefined || this.formAddEdit.trang_thai === null) {
        this.formAddEdit.trang_thai = STATUS_TAO_MOI
      }

      const master = camelCaseToSnakeCaseDeep(this.formAddEdit)
      // master.ma_dvkd = this.$store.getters.userInfo.org

      const files = []
      let i = 0

      const filesTmp = this.fileListUpload

      if (filesTmp.length > 0) {
        const lenUp = filesTmp.length
        while (i < lenUp) {
          const objTL = {}
          objTL.id_chung_tu_goc = 0
          objTL.ma_chi_muc = filesTmp[i].maChiMuc
          objTL.ma_file = ''
          objTL.ten_file = filesTmp[i].raw.name
          objTL.loai_file = filesTmp[i].raw.type
          objTL.file_size = filesTmp[i].raw.size
          objTL.uid = filesTmp[i].raw.uid

          files.push(objTL)
          i++
        }
      }

      objDuThao = master
      objDuThao.files = files

      return objDuThao
    },
    getLapDuThaoByFormUpdate() {
      let objDuThao = {}

      this.formAddEdit.lstFileDelete = this.fileListDelete.join(',')
      this.formAddEdit.loaiHoSo = this.loaiHoSo
      this.formAddEdit.loai_du_thao = this.loaiDuThao

      const master = camelCaseToSnakeCaseDeep(this.formAddEdit)

      // Them list File
      const files = []
      let i = 0
      const filesTmp = this.fileListUpload

      if (filesTmp.length > 0) {
        const lenUp = filesTmp.length
        while (i < lenUp) {
          const objTL = {}
          objTL.id_chung_tu_goc = 0
          objTL.ma_file = ''
          objTL.ten_file = filesTmp[i].raw.name
          objTL.loai_file = filesTmp[i].raw.type
          objTL.file_size = filesTmp[i].raw.size
          objTL.uid = filesTmp[i].raw.uid

          files.push(objTL)
          i++
        }
      }

      objDuThao = master
      objDuThao.files = files
      return objDuThao
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
    async onPrintDuThao() {
      this.buttonPrintLoading = true
      const param = { id: this.formAddEdit.id_du_thao_thong_bao }
      await apiFactory
        .download(
          ConstantAPI[this.menuCode].PRINT_DU_THAO,
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
    onPrintPreviewDuThao() {
      this.isShowDlgPrint = true
      this.buttonPrintLoading = true
      this.titleDialog = 'In thông tin dự thảo thông báo'
      this.pdfSource = ''
      const param = { id: this.formAddEdit.id_du_thao_thong_bao }
      apiFactory
        .showReport(ConstantAPI[this.menuCode].PRINT_DU_THAO, param, this)
        .then(rs => {
          this.pdfSource = rs
          this.buttonPrintLoading = false
        })
        .catch(err => {
          this.buttonPrintLoading = false
          errAlert(this, err)
        })
    }
  }
}
</script>

<style scoped></style>
