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
          <select-master-data :get-list="getListDataDVT" />
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Mã thiết bị" prop="code">
              <el-input-etc
                :v-model.sync="formSearch.itemCode"
                placeholder="Mã thiết bị"
                :maxlength="50"
                @input="
                  (v) => {
                    formSearch.itemCode = v.toUpperCase();
                  }
                "
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Loại thiết bị" prop="deviceType">
              <el-input-etc
                :v-model.sync="formSearch.itemType"
                placeholder="Loại thiết bị"
                :maxlength="255"
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
            <select-trang-thai-thiet-bi
              label="Trạng thái"
              :is-show-option-all="false"
              :v-model.sync="formSearch.status"
              prop-form="status"
              @change="changeValue"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item label="Xuất xứ" prop="brand">
              <el-input-etc
                :v-model.sync="formSearch.brand"
                placeholder="Xuất xứ"
                :maxlength="150"
              />
            </el-form-item>
          </el-col> -->
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <select-master-data
              :is-show-option-all="false"
              :v-model.sync="formSearch.brand"
              label="Xuất xứ"
              placeholder="Xuất xứ"
              prop-form="brand"
              :is-filter="true"
              :filter-data="masterTypeOrigin"
            />
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
                    @input="
                      (v) => {
                        formAddEdit.deviceCode = v.toUpperCase();
                      }
                    "
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
                <select-master-data
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.brand"
                  label="Xuất xứ"
                  placeholder="Xuất xứ"
                  prop-form="brand"
                  :required="true"
                  :disabled="isHiddenInput"
                  :rules="ruleOrigin"
                  :is-filter="true"
                  :filter-data="masterTypeOrigin"
                />
              </el-col>
              <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
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
              </el-col> -->
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
                <select-trang-thai-thiet-bi
                  label="Trạng thái"
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.status"
                  prop-form="status"
                  :disabled="isHiddenInput"
                  @change="changeValue"
                />
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày bảo dưỡng" prop="nextMaintainDate">
                  <el-date-picker
                    id="nextMaintainDate"
                    v-model="formAddEdit.nextMaintainDate"
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
                <el-form-item label="Tệp đính kèm" prop="fileTB">
                  <!-- <el-upload
                    id="fileTB"
                    ref="uploadFileTB"
                    v-model="formAddEdit.fileTB"
                    :auto-upload="false"
                    :before-upload="onBeforeUpload"
                    :on-change="handleChangeFileTLKTHS"
                    :on-remove="handleRemoveFileTLKTHS"
                    :on-exceed="handleExceedFile"
                    action="`${process.env.VUE_APP_ZAMMAD}/api/v1/form_submit`"
                    class="upload-demo"
                    :limit="10"
                    accept="image/jpeg,application/pdf"
                    drag
                    list-type="picture"
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
                  </el-upload> -->

                  <el-upload
                    id="fileTB"
                    ref="uploadFileTB"
                    v-model="formAddEdit.fileTB"
                    :auto-upload="false"
                    :before-upload="onBeforeUpload"
                    :on-change="handleChangeFileTB"
                    :on-remove="handleRemoveFileTB"
                    :on-exceed="handleExceedFile"
                    action="#"
                    class="upload-demo"
                    :limit="LIMIT_UPLOAD_FILE"
                    :file-list="fileListUpload"
                    :disabled="isHiddenInput"
                    accept="image/jpeg,application/pdf"
                    multiple
                    list-type="picture"
                  >
                    <!-- <i slot="default" class="el-icon-plus"></i> -->
                    <span v-if="isHiddenInput || isHidenGuiHoSo">&nbsp;</span>
                    <el-button
                      v-else
                      id="formAddBtnUploadTk"
                      slot="trigger"
                      icon="el-icon-plus"
                      type="primary"
                      @click="onSelectUpload(1, 1)"
                    />
                    <div v-if="file" slot="file" slot-scope="{ file }">
                      <img
                        v-if="checkIsImage(file) === true"
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                        @click="handlePictureCardPreview(file)"
                      />
                      <img
                        v-if="getFileExtension(file) === 'pdf'"
                        class="el-upload-list__item-thumbnail"
                        src="@/assets/icon/pdf72.png"
                        alt=""
                        @click="handlePictureCardPreview(file)"
                      />
                      <span class="el-upload-list__item-actions">
                        <!-- <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
                        </span> -->
                        <span
                          v-if="!disabled"
                          class="download-file el-upload-list__item-name"
                          @click="handleDownload(file)"
                        >
                          {{ file.name || file.fileName }}
                          <!-- <i class="el-icon-download"></i> -->
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemoveFileTB(file)"
                        >
                          <i class="el-icon-circle-close"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                  <el-dialog
                    width="65%"
                    :visible.sync="dialogImgPreview"
                    class="dlg-preview-img"
                  >
                    <img
                      v-if="dialogFileExt !== 'pdf'"
                      width="100%"
                      :src="dialogImageUrl"
                      alt=""
                    />

                    <el-form
                      v-if="dialogFileExt === 'pdf'"
                      id="formAddEdit"
                      label-width="275px"
                    >
                      <iframe
                        v-if="dialogFileExt === 'pdf'"
                        :src="dialogImageUrl"
                        style="width: 100%; height: 500px; border: none"
                      />
                    </el-form>
                    <!-- <iframe id="pdf-iframe" :src="pdfLink"></iframe> -->
                  </el-dialog>

                  <!-- <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :file-list="fileList"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary"
                      >Click to upload</el-button
                    >
                    <div slot="tip" class="el-upload__tip"></div>
                  </el-upload> -->
                </el-form-item>
                <!-- <div class="alg-left">Giấy tờ khác có liên quan</div> -->
              </el-col>
              <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4"> </el-col>
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
