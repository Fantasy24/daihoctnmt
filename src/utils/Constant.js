/* API_KIEMDINH*/
import { PAGINATION_PARAM as PAGING } from 'ff24-js/src/utils/Constant'

const V1 = process.env.VUE_APP_API_VER
const CATE = process.env.VUE_APP_API_CATE
const CATEGORY_COMMON = process.env.VUE_APP_API_CATEGORY_COMMON
const API_GATEWAY = process.env.VUE_APP_API_GATEWAY
export const API_AUTH = API_GATEWAY + CATE
/** ************ENDPOINT API LOCAL**************/
export const API_DEFAULT = API_GATEWAY

/** ************ENDPOINT API SERVER**************/
// export const API_DEFAULT = API_GATEWAY + process.env.VUE_APP_ENDPOINT_DEFAULT + V1

export const API_DOWNLOAD_FILE =
  API_GATEWAY +
  process.env.VUE_APP_ENDPOINT_DEFAULT +
  '/swagger-resources/download-public'
export const API_CATEGORIES_COMMON = API_GATEWAY + CATE + V1 + CATEGORY_COMMON
export const API_CATEGORIES_V1 = API_GATEWAY + CATE + V1

/* FLAG_STATUS*/
export const FORM_MODE = {
  DEFAULT: 0,
  CREATE: 1,
  EDIT: 2,
  VIEW: 3,
  APPROVE: 4,
  REJECT: 5
}

export const PAGINATION_PARAM = PAGING

export const DATE_FORMAT = {
  YYYY_MM_DD_TIME: 'YYYY/MM/DD HH:mm:ss',
  YYYY_MM_DD: 'YYYY/MM/DD',
  DD_MM_YYYY: 'DD-MM-YYYY'
}

export const SPECIAL_CHAR_REGEX = '^[a-zA-Z0-9]+$'

/* export const PAGINATION_PARAM = {
//   page: 0,
//   size: 10,
//   pageTicket: 1
// }*/

/* Customs Constant*/
export const CUSTOM_LEVEL = {
  TONG_CUC: 1,
  CUC: 2,
  CHI_CUC: 4
}

export const LIST_LV_CUSTOM = [
  { key: CUSTOM_LEVEL.TONG_CUC, label: 'Tổng cục' },
  { key: CUSTOM_LEVEL.CUC, label: 'Cục' },
  { key: CUSTOM_LEVEL.CHI_CUC, label: 'Chi cục' }
]

const CODE_REGEX = '^[A-Za-z_0-9\\-\\]\\[\\/*.%]+$'
export const VALIDATE_CODE = {
  pattern: CODE_REGEX,
  message: `Không được nhập dấu và ký tự đặc biệt ( ngoại trừ [ ] _ - . )`,
  trigger: ['blur', 'change']
}
