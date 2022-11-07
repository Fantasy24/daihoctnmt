<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]REQUISITION')"
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
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Người đề xuất" prop="code">
                  <el-input-etc
                    :v-model.sync="formSearch.requestor"
                    placeholder="Người đề xuất"
                    :maxlength="100"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Tên đề xuất" prop="subject">
                  <el-input-etc
                    :v-model.sync="formSearch.subject"
                    placeholder="Tên đề xuất"
                    :maxlength="255"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <select-trang-thai-de-xuat-mua-sam
                  label="Trạng thái"
                  :is-show-option-all="true"
                  :v-model.sync="formSearch.status"
                  prop-form="status"
                  @change="changeValue"
                />
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <el-form-item style="float: right">
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]REQUISITION')"
            ref="btnSearch"
            icon="el-icon-search"
            type="primary"
            @click="onSearch('')"
          >
            {{ $t("baseLabel.btnSearch") }}
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_SEARCH]REQUISITION')"
            icon="el-icon-refresh-left"
            type="primary"
            @click="resetForm('formSearch')"
          >
            Xóa tìm kiếm
          </el-button>
          <el-button
            v-if="checkPermissionShowButton('[BTN_INSERT]REQUISITION')"
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
                    id="btnEditCo"
                    v-if="
                      showHideBtnUpdateInGrid(scope.row) &&
                      checkPermissionShowButton('[BTN_UPDATE]REQUISITION')
                    "
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
                    v-if="
                      showHideBtnDeleteInGrid(scope.row) &&
                      checkPermissionShowButton('[BTN_DELETE]REQUISITION')
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
          <el-tabs v-model="tabIndex" type="border-card" :lazy="true">
            <el-tab-pane label="Thông tin Đề xuất" lazy>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Người đề xuất" prop="requestor">
                    <el-input-etc
                      id="requestor"
                      :v-model.sync="formAddEdit.requestor"
                      placeholder="Người đề xuất"
                      :maxlength="100"
                      :require="true"
                      :disabled="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Tên đề xuất" prop="subject">
                    <el-input-etc
                      id="subject"
                      :v-model.sync="formAddEdit.subject"
                      placeholder="Tên đề xuất"
                      :maxlength="500"
                      :require="true"
                      :disabled="isHiddenInput"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Số điện thoại" prop="phoneNumber">
                    <el-input-etc
                      id="phoneNumber"
                      :v-model.sync="formAddEdit.phoneNumber"
                      placeholder="Số điện thoại"
                      :maxlength="50"
                      :require="true"
                      :disabled="isHiddenInput"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="email" prop="email">
                    <el-input-etc
                      id="email"
                      :v-model.sync="formAddEdit.email"
                      placeholder="email"
                      :maxlength="150"
                      :require="true"
                      :disabled="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Ngày tạo" prop="createdAt">
                    <el-date-picker
                      id="createdAt"
                      v-model="formAddEdit.createdAt"
                      :disabled="true"
                      :required="true"
                      clearable
                      format="dd/MM/yyyy"
                      placeholder="DD/MM/YYYY"
                      type="date"
                      unlink-panels
                    />
                  </el-form-item>
                </el-col>

                <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Ngày kết thúc" prop="REQUISITIONDateTo">
                    <el-date-picker
                      id="REQUISITIONDateTo"
                      v-model="formAddEdit.REQUISITIONDateTo"
                      :picker-options="minDateREQUISITION"
                      :disabled="isHiddenInput"
                      :required="true"
                      clearable
                      format="dd/MM/yyyy HH:mm:ss"
                      placeholder="DD/MM/YYYY HH:MM:SS"
                      type="datetime"
                      unlink-panels
                    />
                  </el-form-item>                
                </el-col> -->
              </el-row>
              <el-row
                v-if="formAddEdit.status === '2' || formAddEdit.status === '3'"
                :gutter="20"
              >
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Người duyệt" prop="approvedBy">
                    <el-input-etc
                      id="approvedBy"
                      :v-model.sync="formAddEdit.approvedBy"
                      placeholder="Người duyệt"
                      :maxlength="150"
                      :require="false"
                      :disabled="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Ngày duyệt" prop="createdAt">
                    <el-date-picker
                      id="createdAt"
                      v-model="formAddEdit.createdAt"
                      :disabled="true"
                      :required="false"
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
                  <el-form-item label="Tệp đính kèm" prop="fileTB">
                    <el-upload
                      id="fileTB"
                      ref="uploadFileTB"
                      v-model="formAddEdit.fileTB"
                      :auto-upload="false"
                      :before-upload="onBeforeUpload"
                      :on-change="handleChangeFile"
                      :on-remove="handleRemoveFile"
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
                        id="formAddBtnUpload"
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
                            @click="handleRemoveFile(file)"
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
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="Thiết bị" lazy>
              <el-card>
                <div>
                  <el-table-etc-custom
                    ref="tblMainTB"
                    :list-data-table.sync="listDataTableTB"
                    :loading.sync="loadDataTableTB"
                    :total.sync="totalTB"
                    :columns="columnsTB"
                    :is-export="true"
                    :is-show-pdf="false"
                    :is-show-print="false"
                    :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
                    :params-fetch="formSearch"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false"
                    :page.sync="pageFix"
                    :size.sync="sizeFix"
                    pagination-method=""
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
                            content="Xóa Thông Tin"
                            effect="light"
                            placement="top-start"
                          >
                            <el-button
                              id="btnDelCo"
                              v-if="
                                checkPermissionShowButton(
                                  '[BTN_DELETE]REQUISITION'
                                ) && !isHiddenInput
                              "
                              :loading="iconDelLoading"
                              circle
                              icon="el-icon-delete"
                              size="mini"
                              type="danger"
                              @click="onDeleteTB(scope.row)"
                            />
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </div>
                  </el-table-etc-custom>
                </div>
              </el-card>
              <div class="EmptyBox20" />
              <el-form
                id="formTB"
                ref="formTB"
                :model="formTB"
                :rules="rulesTB"
                label-width="170px"
                :disabled="isHiddenInput"
              >
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <select-thiet-bi
                      :v-model.sync="formTB.deviceId"
                      label="Thiết bị"
                      :is-show-option-all="false"
                      :get-list="getListTB"
                      prop-form="deviceId"
                    />
                  </el-col>

                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <select-master-data
                      :is-show-option-all="false"
                      :v-model.sync="formTB.unit"
                      label="Đơn vị tính"
                      placeholder="Đơn vị tính"
                      prop-form="unit"
                      :required="false"
                      :disabled="true"
                      :is-filter="true"
                      :filter-data="masterType"
                    />
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="Số lượng" prop="quantity">
                      <el-input-etc
                        id="quantity"
                        :v-model.sync="formTB.quantity"
                        placeholder="Số lượng"
                        :maxlength="15"
                        :required="true"
                        :disabled="isHiddenInput"
                        show-word-limit
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-button
                      v-if="
                        checkPermissionShowButton('[BTN_INSERT]REQUISITION')
                      "
                      id="btnAddCo"
                      icon="el-icon-plus"
                      style="float: left"
                      type="primary"
                      @click="onInsertTB"
                      >Thêm thiết bị
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="Dụng cụ" lazy>
              <el-card>
                <div>
                  <el-table-etc-custom
                    ref="tblMainDC"
                    :list-data-table.sync="listDataTableDC"
                    :loading.sync="loadDataTableDC"
                    :total.sync="totalDC"
                    :columns="columnsDC"
                    :is-export="true"
                    :is-show-pdf="false"
                    :is-show-print="false"
                    :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
                    :params-fetch="formSearch"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false"
                    :page.sync="pageFix"
                    :size.sync="sizeFix"
                    pagination-method=""
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
                            content="Xóa Thông Tin"
                            effect="light"
                            placement="top-start"
                          >
                            <el-button
                              id="btnDelCo"
                              v-if="
                                checkPermissionShowButton(
                                  '[BTN_DELETE]REQUISITION'
                                ) && !isHiddenInput
                              "
                              :loading="iconDelLoading"
                              circle
                              icon="el-icon-delete"
                              size="mini"
                              type="danger"
                              @click="onDeleteDC(scope.row)"
                            />
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </div>
                  </el-table-etc-custom>
                </div>
              </el-card>
              <div class="EmptyBox20" />
              <el-form
                id="formDC"
                ref="formDC"
                :model="formDC"
                :rules="rulesTB"
                label-width="170px"
                :disabled="isHiddenInput"
              >
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <select-dung-cu
                      :v-model.sync="formDC.toolId"
                      label="Dụng cụ"
                      :is-show-option-all="false"
                      :get-list="getListDC"
                      prop-form="toolId"
                    />
                  </el-col>

                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <select-master-data
                      :is-show-option-all="false"
                      :v-model.sync="formDC.unit"
                      label="Đơn vị tính"
                      placeholder="Đơn vị tính"
                      prop-form="unit"
                      :required="false"
                      :is-filter="true"
                      :filter-data="masterType"
                    />
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="Số lượng" prop="quantity">
                      <el-input-etc
                        id="quantity"
                        :v-model.sync="formDC.quantity"
                        placeholder="Số lượng"
                        :maxlength="15"
                        :required="true"
                        :disabled="isHiddenInput"
                        show-word-limit
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-button
                      v-if="
                        checkPermissionShowButton('[BTN_INSERT]REQUISITION')
                      "
                      id="btnAddCo"
                      icon="el-icon-plus"
                      style="float: left"
                      type="primary"
                      @click="onInsertDC"
                      >Thêm dụng cụ
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="Hóa chất" lazy>
              <el-card>
                <div>
                  <el-table-etc-custom
                    ref="tblMainHC"
                    :list-data-table.sync="listDataTableHC"
                    :loading.sync="loadDataTableHC"
                    :total.sync="totalHC"
                    :columns="columnsHC"
                    :is-export="true"
                    :is-show-pdf="false"
                    :is-show-print="false"
                    :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
                    :params-fetch="formSearch"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false"
                    :page.sync="pageFix"
                    :size.sync="sizeFix"
                    pagination-method=""
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
                            content="Xóa Thông Tin"
                            effect="light"
                            placement="top-start"
                          >
                            <el-button
                              id="btnDelCo"
                              v-if="
                                checkPermissionShowButton(
                                  '[BTN_DELETE]REQUISITION'
                                ) && !isHiddenInput
                              "
                              :loading="iconDelLoading"
                              circle
                              icon="el-icon-delete"
                              size="mini"
                              type="danger"
                              @click="onDeleteHC(scope.row)"
                            />
                          </el-tooltip>
                        </template>
                      </el-table-column>
                    </div>
                  </el-table-etc-custom>
                </div>
              </el-card>
              <div class="EmptyBox20" />
              <el-form
                id="formHC"
                ref="formHC"
                :model="formHC"
                :rules="rulesTB"
                label-width="170px"
                :disabled="isHiddenInput"
              >
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <select-hoa-chat
                      :v-model.sync="formHC.resourceId"
                      label="Hóa chất"
                      :is-show-option-all="false"
                      :get-list="getListHC"
                      prop-form="resourceId"
                    />
                  </el-col>

                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <select-master-data
                      :is-show-option-all="false"
                      :v-model.sync="formHC.unit"
                      label="Đơn vị tính"
                      placeholder="Đơn vị tính"
                      prop-form="unit"
                      :required="false"
                      :is-filter="true"
                      :filter-data="masterType"
                    />
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="Số lượng" prop="quantity">
                      <el-input-etc
                        id="quantity"
                        :v-model.sync="formHC.quantity"
                        placeholder="Số lượng"
                        :maxlength="15"
                        :required="true"
                        :disabled="isHiddenInput"
                        show-word-limit
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-button
                      v-if="
                        checkPermissionShowButton('[BTN_INSERT]REQUISITION')
                      "
                      id="btnAddCo"
                      icon="el-icon-plus"
                      style="float: left"
                      type="primary"
                      @click="onInsertHC"
                      >Thêm hóa chất
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.CREATE &&
              checkPermissionShowButton('[BTN_INSERT]REQUISITION')
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
              checkPermissionShowButton('[BTN_UPDATE]REQUISITION')
            "
            id="btnUpdateCo"
            :loading="buttonUpdateLoading"
            icon="el-icon-check"
            type="primary"
            @click="onUpdate('formAddEdit')"
          >
            {{ $t("baseLabel.btnSave") }}
          </el-button>
          <el-button
            v-if="
              checkPreApprove() &&
              checkPermissionShowButton('[BTN_APPROVE]REQUISITION')
            "
            id="btnApprove"
            :loading="buttonApproveLoading"
            icon="el-icon-check"
            type="primary"
            @click="onApprove('formAddEdit')"
          >
            Phê duyệt
          </el-button>
          <el-button
            v-if="
              checkPreRefuse() &&
              checkPermissionShowButton('[BTN_REFUSE]REQUISITION')
            "
            id="btnRefuse"
            :loading="buttonRefuseLoading"
            icon="el-icon-close"
            type="danger"
            @click="onRefuse('formAddEdit')"
          >
            Từ chối
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
            :disabled="!checkPermissionShowButton('[BTN_SEARCH]REQUISITION')"
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
<script src="./requisition-controller.js" />
<style scoped></style>
