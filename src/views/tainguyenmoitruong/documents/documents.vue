<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]DOCUMENTS')"
      >
        <el-row v-show="false" :gutter="20">
          <select-master-data :get-list="getListDataDVT" />
        </el-row>
        <el-collapse
          v-model="activeCollapseName"
          accordion
          class="collapse-filter"
        >
          <el-collapse-item title="" name="1">
            <el-row :gutter="20">
              <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Ngày tìm kiếm" prop="fromToDate" required>
                  <date-range-picker
                    v-model="formSearch.fromToDate"
                    :picker-options="pickerOptions"
                    format="dd/MM/yyyy"
                  />
                </el-form-item>
              </el-col> -->
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Tên tài liệu" prop="name">
                  <el-input-etc
                    :v-model.sync="formSearch.name"
                    placeholder="Tên tài liệu"
                    :maxlength="255"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Mã tài liệu" prop="code">
                  <el-input-etc
                    :v-model.sync="formSearch.code"
                    placeholder="Mã tài liệu"
                    :maxlength="50"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-form-item style="float: right">
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DOCUMENTS')"
            ref="btnSearch"
            icon="el-icon-search"
            type="primary"
            @click="onSearch('')"
          >
            {{ $t("baseLabel.btnSearch") }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]DOCUMENTS')"
            icon="el-icon-refresh-left"
            type="primary"
            @click="resetForm('formSearch')"
          >
            Xóa tìm kiếm
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_INSERT]DOCUMENTS')"
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
                  content="Tải xuống"
                  effect="light"
                  placement="top-start"
                >
                  <el-button
                    id="btnEditCo"
                    :loading="iconEditLoading"
                    circle
                    icon="el-icon-download"
                    size="mini"
                    type="primary"
                    @click="handleDownload(scope.row)"
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
                    v-if="checkPermissionShowButton('[BTN_DELETE]DOCUMENTS')"
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
                    @click="handlePictureCardPreview(scope.row)"
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
        width="80%"
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
                      <img
                        v-if="getFileExtension(file) === 'pdf'"
                        class="el-upload-list__item-thumbnail"
                        src="@/assets/icon/pdf72.png"
                        alt=""
                        @click="handlePictureCardPreview(file)"
                      />
                      <img
                        v-if="
                          getFileExtension(file) === 'xlsx' ||
                          getFileExtension(file) === 'xls'
                        "
                        class="el-upload-list__item-thumbnail"
                        src="@/assets/icon/excel72.png"
                        alt=""
                        @click="handlePictureCardPreview(file)"
                      />
                      <img
                        v-if="
                          getFileExtension(file) === 'docx' ||
                          getFileExtension(file) === 'doc'
                        "
                        class="el-upload-list__item-thumbnail"
                        src="@/assets/icon/word72.png"
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
              checkPermissionShowButton('[BTN_INSERT]DOCUMENTS')
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
              checkPermissionShowButton('[BTN_UPDATE]DOCUMENTS')
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
            :disabled="!checkPermissionShowButton('[BTN_SEARCH]DOCUMENTS')"
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
<script src="./documents-controller.js" />
<style scoped></style>
