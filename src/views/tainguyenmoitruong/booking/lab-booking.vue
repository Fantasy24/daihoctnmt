<template>
  <div v-loading="loading" class="app-container">
    <el-card>
      <el-form
        ref="formSearch"
        :model="formSearch"
        v-loading="formLoading"
        label-width="190px"
        @keyup.enter.native="onSearchHandling('[BTN_SEARCH]BOOKING')"
      >
        <el-row v-show="false" :gutter="20">
          <select-master-data :get-list="getListMasterData" />
          <!-- <select-thiet-bi :get-list="getListTB" />
          <select-dung-cu :get-list="getListDC" />
          <select-hoa-chat :get-list="getListHC" /> -->
        </el-row>
        <el-row :gutter="20">
          <el-form-item style="float: right">
            <el-button
              v-if="checkPermissionShowButton('[BTN_INSERT]BOOKING')"
              id="btnAddCo"
              icon="el-icon-plus"
              style="float: right"
              type="primary"
              @click="onPreInsert"
              >Cập nhật PTN
            </el-button>
          </el-form-item>
        </el-row>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div
              style="
                padding: 3px 7px;
                border-radius: 2px;
                background-color: rgb(255, 205, 210);
                margin-right: 1px;
                float: left;
                width: 10%;
              "
            >
              <span
                style="
                  font-size: 12px;
                  font-weight: 500;
                  font-family: Roboto;
                  color: rgb(198, 55, 55);
                  text-transform: uppercase;
                "
                >Đang bận</span
              >
            </div>
            <div
              style="
                padding: 3px 7px;
                border-radius: 2px;
                background-color: rgb(179, 229, 252);
                margin-right: 1px;
                float: left;
                width: 10%;
              "
            >
              <span
                style="
                  font-size: 12px;
                  font-weight: 500;
                  font-family: Roboto;
                  color: rgb(35, 84, 144);
                  text-transform: uppercase;
                "
                >Đang trống</span
              >
            </div>
            <div
              style="
                padding: 3px 7px;
                border-radius: 2px;
                background-color: rgb(255, 216, 178);
                margin-right: 1px;
                float: left;
                width: 12%;
              "
            >
              <span
                style="
                  font-size: 12px;
                  font-weight: 500;
                  font-family: Roboto;
                  color: rgb(128, 91, 54);
                  text-transform: uppercase;
                "
                >Đang đặt phòng</span
              >
            </div>
          </el-col>
        </el-row>
        <div class="EmptyBox5" />
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-tooltip
              v-for="lab in lstLab"
              :key="lab.id"
              :open-delay="350"
              :content="lab.description"
              effect="light"
              placement="top-start"
            >
              <el-tag type="" effect="dark" class="lab-booking">
                <div class="lab-list" @click="showBookingList(lab)"></div>
                <div class="lab-register" @click="labRegistration(lab)">
                  {{ lab.labName }}
                </div>
              </el-tag>
            </el-tooltip>

            <!-- <el-tag type="" effect="dark" class="lab-booking">
              <div class="lab-list"></div>
              <div class="lab-register">A.246</div>
            </el-tag>
            <el-tag type="" effect="dark" class="lab-booking">
              <div class="lab-list"></div>
              <div class="lab-register">A.247</div>
            </el-tag>
            <el-tag type="" effect="dark" class="lab-booking">
              <div class="lab-list"></div>
              <div class="lab-register">A.248</div>
            </el-tag> -->
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div>
      <el-dialog
        :close-on-click-modal="false"
        :title="titleDialogLab"
        :visible.sync="isShowDlgPTN"
        width="80%"
        @close="resetFormPTN('formAddEditPTN')"
      >
        <el-form
          id="formAddEditPTN"
          ref="formAddEditPTN"
          :model="formAddEditPTN"
          :rules="rulesPTN"
          label-width="170px"
          :disabled="isHidenGuiHoSo"
        >
          <el-tabs v-model="tabIndex" type="border-card">
            <el-tab-pane label="Thông tin đăng ký">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Mã cán bộ" prop="bookingUser">
                    <el-input-etc
                      id="bookingUser"
                      :v-model.sync="formAddEditPTN.bookingUser"
                      placeholder="Mã cán bộ"
                      :maxlength="50"
                      :require="true"
                      :disabled="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Số điện thoại" prop="phone">
                    <el-input-etc
                      id="phone"
                      :v-model.sync="formAddEditPTN.phone"
                      placeholder="Số điện thoại"
                      :maxlength="50"
                      :require="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <select-master-data
                    :is-show-option-all="false"
                    :v-model.sync="formAddEditPTN.department"
                    label="Khoa"
                    placeholder="Khoa"
                    prop-form="department"
                    :required="true"
                    :disabled="true"
                    :rules="ruleLabDepartment"
                    :is-filter="true"
                    :filter-data="masterTypeLabDepartment"
                  />
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="email" prop="email">
                    <el-input-etc
                      id="email"
                      :v-model.sync="formAddEditPTN.email"
                      placeholder="email"
                      :maxlength="50"
                      :require="true"
                      :disabled="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Ngày" prop="bookingDate">
                    <el-date-picker
                      id="bookingDate"
                      v-model="formAddEditPTN.bookingDate"
                      :picker-options="minDateBooking"
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
                  <el-form-item label="Giờ" prop="startTime">
                    <el-time-select
                      class="time-picker"
                      placeholder="Giờ bắt đầu"
                      v-model="formAddEditPTN.startTime"
                      :picker-options="{
                        start: '08:00',
                        step: '00:15',
                        end: '20:00',
                      }"
                    >
                    </el-time-select>
                    <el-time-select
                      class="time-picker"
                      placeholder="Giờ kết thúc"
                      v-model="formAddEditPTN.endTime"
                      :picker-options="{
                        start: '08:00',
                        step: '00:15',
                        end: '20:00',
                        minTime: formAddEditPTN.startTime,
                      }"
                    >
                    </el-time-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="Mục đích PTN" prop="purpose">
                    <el-radio-group v-model="formAddEditPTN.purpose">
                      <el-radio label="GIANG_DAY">Giảng dạy</el-radio>
                      <el-radio label="NGHIEN_CUU_KH"
                        >Nghiên cứu khoa học</el-radio
                      >
                      <el-radio label="DO_AN">Đồ án</el-radio>
                      <el-radio label="KHOA_LUAN_TN"
                        >Khóa luận tốt nghiệp</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Giảng viên" prop="pic">
                    <el-input-etc
                      id="pic"
                      :v-model.sync="formAddEditPTN.pic"
                      placeholder="Giảng viên"
                      :maxlength="100"
                      :require="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Đề tài" prop="lessonName">
                    <el-input-etc
                      id="lessonName"
                      :v-model.sync="formAddEditPTN.lessonName"
                      placeholder="Đề tài"
                      :maxlength="250"
                      :require="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Lớp học" prop="className">
                    <el-input-etc
                      id="className"
                      :v-model.sync="formAddEditPTN.className"
                      placeholder="Lớp học"
                      :maxlength="50"
                      :require="true"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Nhóm" prop="group">
                    <el-input-etc
                      id="group"
                      :v-model.sync="formAddEditPTN.group"
                      placeholder="Nhóm"
                      :maxlength="50"
                      :require="false"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <el-form-item label="Chỉ tiêu phân tích" prop="targets">
                    <el-input-etc
                      id="targets"
                      :v-model.sync="formAddEditPTN.targets"
                      placeholder="Chỉ tiêu phân tích"
                      :maxlength="50"
                      :require="false"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <select-trang-thai
                    label="Trạng thái"
                    :is-show-option-all="false"
                    :v-model.sync="formAddEdit.status"
                    prop-form="status"
                    :disabled="isHiddenInput"
                  />
                </el-col>
              </el-row> -->
            </el-tab-pane>
            <el-tab-pane label="Thiết bị sử dụng">
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
                    :params-fetch="formSearchLab"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false"
                    :page.sync="pageFix"
                    :size.sync="sizeFix"
                    :pagination-method="onSearch"
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
                                checkPermissionShowButton('[BTN_DELETE]BOOKING')
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
                :disabled="isHidenGuiHoSo"
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
                      v-if="checkPermissionShowButton('[BTN_INSERT]BOOKING')"
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

            <el-tab-pane label="Dụng cụ sử dụng">
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
                    :params-fetch="formSearchLab"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false"
                    :page.sync="pageFix"
                    :size.sync="sizeFix"
                    :pagination-method="onSearch"
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
                                checkPermissionShowButton('[BTN_DELETE]BOOKING')
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
                :disabled="isHidenGuiHoSo"
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
                      v-if="checkPermissionShowButton('[BTN_INSERT]BOOKING')"
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

            <el-tab-pane label="Hóa chất sử dụng">
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
                    :params-fetch="formSearchLab"
                    :row-class-name="tableRowClassName"
                    :highlight-current-row="false"
                    :page.sync="pageFix"
                    :size.sync="sizeFix"
                    :pagination-method="onSearch"
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
                                checkPermissionShowButton('[BTN_DELETE]BOOKING')
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
                :disabled="isHidenGuiHoSo"
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
                      v-if="checkPermissionShowButton('[BTN_INSERT]BOOKING')"
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
              checkPermissionShowButton('[BTN_INSERT]BOOKING')
            "
            id="btnSaveCo"
            :loading="buttonSaveLoading"
            icon="el-icon-check"
            type="primary"
            @click="onInsert('formAddEditPTN')"
          >
            Đặt phòng
          </el-button>
          <el-button
            v-if="
              flagShowDialog === FORM_MODE.EDIT &&
              checkPermissionShowButton('[BTN_UPDATE]BOOKING')
            "
            id="btnUpdateCo"
            :loading="buttonUpdateLoading"
            icon="el-icon-check"
            type="primary"
            @click="onUpdate('formAddEdit')"
          >
            {{ $t("baseLabel.btnSave") }}
          </el-button>
          <el-button id="btnCancelCo" @click="isShowDlgPTN = false">{{
            $t("baseLabel.btnCancel")
          }}</el-button>
        </span>
      </el-dialog>
    </div>

    <div>
      <el-dialog
        :close-on-click-modal="false"
        :title="titleDialog"
        :visible.sync="isShowDlgAddEdit"
        width="80%"
        @close="resetForm('formAddEdit')"
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
                <el-form-item label="Tên phòng" prop="labName">
                  <el-input-etc
                    id="labName"
                    :v-model.sync="formAddEdit.labName"
                    placeholder="Tên phòng"
                    :maxlength="50"
                    :require="true"
                    show-word-limit
                    @input="
                      (v) => {
                        formAddEdit.labName = v.toUpperCase();
                      }
                    "
                  />
                </el-form-item>
              </el-col>

              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <select-master-data
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.department"
                  label="Khoa"
                  placeholder="Khoa"
                  prop-form="department"
                  :required="true"
                  :disabled="isHiddenInput"
                  :rules="ruleLabDepartment"
                  :is-filter="true"
                  :filter-data="masterTypeLabDepartment"
                />
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="Mô tả" prop="description">
                  <el-input-etc
                    id="description"
                    :v-model.sync="formAddEdit.description"
                    placeholder="Mô tả"
                    :maxlength="500"
                    :require="true"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <select-trang-thai
                  label="Trạng thái"
                  :is-show-option-all="false"
                  :v-model.sync="formAddEdit.status"
                  prop-form="status"
                  :disabled="isHiddenInput"
                />
              </el-col>
            </el-row>
            <el-row>
              <el-form-item style="float: right">
                <el-button
                  v-if="
                    flagShowDialog === FORM_MODE.CREATE &&
                    checkPermissionShowButton('[BTN_INSERT]BOOKING')
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
                    checkPermissionShowButton('[BTN_UPDATE]BOOKING')
                  "
                  id="btnUpdateCo"
                  :loading="buttonUpdateLoading"
                  icon="el-icon-check"
                  type="primary"
                  @click="onUpdate('formAddEdit')"
                >
                  {{ $t("baseLabel.btnSave") }}
                </el-button>
              </el-form-item>
            </el-row>
          </el-tabs>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button id="btnCancelCo" @click="isShowDlgAddEdit = false">{{
            $t("baseLabel.btnCancel")
          }}</el-button>
        </span>
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
              :params-fetch="formSearchLab"
              :row-class-name="tableRowClassName"
              :highlight-current-row="false"
              :page.sync="formSearchLab.page"
              :size.sync="formSearchLab.size"
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
                        v-if="checkPermissionShowButton('[BTN_UPDATE]BOOKING')"
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
                        v-if="checkPermissionShowButton('[BTN_DELETE]BOOKING')"
                        :loading="iconDelLoading"
                        circle
                        icon="el-icon-delete"
                        size="mini"
                        type="danger"
                        @click="onDelete(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </div>
            </el-table-etc-custom>
          </div>
        </el-card>
      </el-dialog>
      <danh-sach-template
        v-if="showDlgTemplate"
        :show-dlg-template="showDlgTemplate"
        :close-template="showHideTemplate"
        :fill-template="fillTemplate"
        :loai-hs="loaiHoSo"
      />
    </div>

    <div>
      <el-dialog
        :close-on-click-modal="false"
        title="Danh sách đặt phòng"
        :visible.sync="isShowDlgListLab"
        width="80%"
        @close="resetForm('formAddEditListLab')"
      >
        <el-card>
          <div>
            <el-table-etc-custom
              ref="tblMainLab"
              :list-data-table.sync="listDataTableLab"
              :loading.sync="loadDataTableLab"
              :total.sync="total"
              :columns="columnsLab"
              :is-export="true"
              :is-show-pdf="false"
              :is-show-print="false"
              :api-fetch="ConstantAPI[MENU_CODE_API].SEARCH"
              :params-fetch="formSearchLab"
              :row-class-name="tableRowClassName"
              :highlight-current-row="false"
              :page.sync="formSearchLab.page"
              :size.sync="formSearchLab.size"
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
                        v-if="checkPermissionShowButton('[BTN_UPDATE]BOOKING')"
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
                        v-if="checkPermissionShowButton('[BTN_DELETE]BOOKING')"
                        :loading="iconDelLoading"
                        circle
                        icon="el-icon-delete"
                        size="mini"
                        type="danger"
                        @click="onDelete(scope.row)"
                      />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </div>
            </el-table-etc-custom>
          </div>
        </el-card>
      </el-dialog>
    </div>
  </div>
</template>
<script src="./lab-booking-controller.js" />
<style scoped></style>
