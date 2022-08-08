/* eslint-disable no-unused-vars */
import {
  API_AUTH,
  API_CATEGORIES_COMMON,
  API_DEFAULT,
  API_CATEGORIES_V1
} from '@/utils/Constant'

const GET = 'GET'
const POST = 'POST'
const PUT = 'PUT'
const DELETE = 'DELETE'

export const ConstantTableEndPoint = {
  SCUSTOMS: 'SCUSTOMS',
  STRADE_TYPE: 'STRADE_TYPE', // 'STRADE_TYPE'
  SCOMPANY_EXIM: 'SCOMPANY-EXIM',
  USER: 'AUTH_USER'

}
const GET_LIST_LOAI_CT = {
  url: `${API_AUTH}/v1/strade-type/search`,
  method: GET
}

const GET_LIST_CHUNG_TU = {
  url: `${API_AUTH}/v1/category-common/search-schema-by-table-name`,
  method: GET
}

export const ConstantAPI = {
  DMDC: {
    STRADE_TYPE: {
      url: `${API_CATEGORIES_COMMON}`,
      method: GET,
      params: {
        tableName: ConstantTableEndPoint.STRADE_TYPE
      }
    },
    SCOMPANY_EXIM: {
      url: `${API_CATEGORIES_V1}/scompany-exim/search`,
      method: GET,
      params: {
        tableName: ConstantTableEndPoint.SCOMPANY_EXIM
      }
    },
    USER: {
      url: `${API_CATEGORIES_V1}/user/search`,
      method: GET,
      params: {
        orgCode: ConstantTableEndPoint.USER
      }
    },
    DMPHAN: {
      url: `${API_DEFAULT}/dm/search-phan-hh-all`,
      method: GET
    },
    DMCHUONG: {
      url: `${API_DEFAULT}/dm/search-chuong-hh-all`,
      method: GET
    }
  },
  DMCVPTPL: {
    SEARCH_BY_MA_DV: {
      url: `${API_DEFAULT}/dm/chuyen-vien-phan-tich-phan-loai/search-list-chuyen-vien-by-dvkd`,
      method: GET,
      buttons: ['[BTN_SEARCH]DMCVPTPL']
    }
  },
  DMNV: {
    STATUS_PTPL: {
      url: `${API_DEFAULT}/dm/search-trangthai-phieu-ptpl-all`,
      method: GET
    },
    TAILIEU_HS: {
      url: `${API_DEFAULT}/dm/search-tailieu-all`,
      method: GET
    }
  },
  DOWNLOAD: {
    ATTACHMENT: {
      url: `${API_DEFAULT}/download`,
      method: GET
    },
    PRINT_PHIEU_YC: {
      url: `${API_DEFAULT}/download/export-phieu-ycptpl`,
      method: GET
    }
  },
  DMKD: {
    SEARCH: {
      url: `${API_DEFAULT}/dm/loai-kiem-dinh/search`,
      method: GET,
      buttons: ['[BTN_SEARCH]DMKD']
    },
    SELECT_ITEM: {
      url: `${API_DEFAULT}/dm/loai-kiem-dinh/search`,
      method: GET,
      buttons: ['[BTN_SEARCH]DMKD', '[BTN_UPDATE]DMKD']
    },
    INSERT: {
      url: `${API_DEFAULT}/dm/loai-kiem-dinh/`,
      method: POST,
      buttons: ['[BTN_INSERT]DMKD']
    },
    UPDATE: {
      url: `${API_DEFAULT}/dm/loai-kiem-dinh/`,
      method: PUT,
      buttons: ['[BTN_UPDATE]DMKD']
    },
    DELETE: {
      url: `${API_DEFAULT}/dm/loai-kiem-dinh/`,
      method: DELETE,
      buttons: ['[BTN_DELETE]DMKD']
    }
  },  
  QLND: {
    SEARCH: {
      url: `${API_DEFAULT}/api/qlnd/search`,
      method: GET,
      buttons: ['[BTN_SEARCH]QLND']
    },
    SELECT_ITEM: {
      url: `${API_DEFAULT}/api/qlnd/select-item`,
      method: GET,
      buttons: ['[BTN_SEARCH]QLND', '[BTN_UPDATE]QLND']
    },
    INSERT: {
      url: `${API_DEFAULT}/api/qlnd/`,
      method: POST,
      buttons: ['[BTN_INSERT]QLND']
    },
    UPDATE: {
      url: `${API_DEFAULT}/api/qlnd/`,
      method: PUT,
      buttons: ['[BTN_UPDATE]QLND']
    },
    DELETE: {
      url: `${API_DEFAULT}/api/qlnd/`,
      method: DELETE,
      buttons: ['[BTN_DELETE]QLND']
    },
    GET_MENU_BY_PERMISSION: {
      url: `${API_DEFAULT}/api/menu/get-menu-by-permission`,
      method: GET,
      buttons: ['[BTN_USER_PERMISSION]QLND']
    },
    RESET_PASS: {
      url: `${API_DEFAULT}/user/changepass-user`,
      method: PUT
    },
    GET_TOTP_SECRET: {
        url: `${API_DEFAULT}/user/get-totp-secret`,
        method: GET
    },
    UPDATE_TOTP_SECRET: {
        url: `${API_DEFAULT}/user/update-totp-secret`,
        method: PUT
    },
    GET_RESEND_TOTP_KEY: {
        url: `${API_DEFAULT}/user/get-totp-key`,
        method: GET
    },
    CHECK_TOTP_KEY: {
        url: `${API_DEFAULT}/user/check-totp-key`,
        method: POST
    },
    TRANSFER_ORG: {
        url: `${API_DEFAULT}/user/get-org-history-current`,
        method: GET
    }
  },  
  YCPTPL: {
    SEARCH: {
      url: `${API_DEFAULT}/nv/pycptpl/search`,
      method: GET,
      buttons: ['[BTN_SEARCH]YCPTPL']
    },
    TRA_CUU_HSPTPL: {
      url: `${API_DEFAULT}/nv/pycptpl/tra-cuu-hsptpl`,
      method: GET,
      buttons: ['[BTN_SEARCH]YCPTPL']
    },
    SEARCH_BY_SOTK: {
      url: `${API_DEFAULT}/nv/pycptpl/select-pycptpl-by-sotk`,
      method: GET,
      buttons: ['[BTN_SEARCH]YCPTPL', '[BTN_INSERT]YCPTPL']
    },
    SELECT_ITEM: {
      url: `${API_DEFAULT}/nv/pycptpl/select-item`,
      method: GET,
      buttons: ['[BTN_SEARCH]YCPTPL', '[BTN_UPDATE]YCPTPL']
    },
    SELECT_ITEM_BY_ID: {
      url: `${API_DEFAULT}/nv/pycptpl/select-pycptpl-by-id`,
      method: GET,
      buttons: ['[BTN_SEARCH]YCPTPL', '[BTN_UPDATE]YCPTPL']
    },
    INSERT: {
      url: `${API_DEFAULT}/nv/pycptpl/`,
      method: POST,
      buttons: ['[BTN_INSERT]YCPTPL']
    },
    UPDATE: {
      url: `${API_DEFAULT}/nv/pycptpl/`,
      method: PUT,
      buttons: ['[BTN_UPDATE]YCPTPL']
    },
    DELETE: {
      url: `${API_DEFAULT}/nv/pycptpl/`,
      method: DELETE,
      buttons: ['[BTN_DELETE]YCPTPL']
    }
  }
}
export default ConstantAPI
