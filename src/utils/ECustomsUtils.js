import apiFactory from '@/api/apiFactory'
import { API_AUTH, CUSTOM_LEVEL } from '@/utils/Constant'
import ConstantAPI from '@/utils/ConstantAPI'
import moment from 'moment'
import _ from 'lodash'
import { async } from 'ff24-customs-lib'

export const LIST_CUSTOMS = 'LIST_CUSTOMS'
export const LIST_POSITIONS = 'LIST_POSITIONS'
export const LIST_DEPARTMENT = 'LIST_DEPARTMENT'
export const LIST_MENU_BUTTON_FE = 'LIST_MENU_BUTTON_FE'

export const LIST_MASTER_DATA = 'LIST_MASTER_DATA'

export const getListHq = JSON.parse(localStorage.getItem(LIST_CUSTOMS))
export const getListPosition = JSON.parse(localStorage.getItem(LIST_POSITIONS))
export const getListDepartment = JSON.parse(
  localStorage.getItem(LIST_DEPARTMENT)
)

export const LIST_DEPARTMENT_CUSTOM = [
  {
    "propertyName": "Khoa Môi trường",
    "propertyValue": "KHOA_MOI_TRUONG",
    "description": "Khoa thí nghiệm",
    "order": 1,
    "type": "LAB_DEPARTMENT"
  },
  {
    "propertyName": "Khoa Địa chất",
    "propertyValue": "KHOA_DIA_CHAT",
    "description": "Khoa thí nghiệm",
    "order": 2,
    "type": "LAB_DEPARTMENT"
  },
  {
    "propertyName": "Khoa Tài nguyên nước",
    "propertyValue": "KHOA_TN_NUOC",
    "description": "Khoa thí nghiệm",
    "order": 3,
    "type": "LAB_DEPARTMENT"
  }
]
export function getMenuButtonFE() {
  apiFactory
    .get(API_AUTH, `/api/auth/cas/get-menu-group-by-parent-code`, {
      appCode: process.env.VUE_APP_APP_CODE,
      type: 5
    })
    .then(response => {
      localStorage.setItem(LIST_MENU_BUTTON_FE, JSON.stringify(response))
    })
    .catch(response => {
      console.log('Lỗi API LIST_MENU_BUTTON_FE:', response.message)
    })
}

export function getListCustoms() {
  apiFactory
    .callAPI(ConstantAPI['QLDM-1-1-1'].ALL)
    .then(response => {
      localStorage.setItem(LIST_CUSTOMS, JSON.stringify(response))
    })
    .catch(response => {
      console.log('Lỗi API LIST_CUSTOMS:', response.message)
    })
}

export function getListMasterData() {
  console.log("LIST_MASTER_DATA")
  apiFactory
    .callAPI(ConstantAPI['MASTER'].SEARCH_ALL)
    .then(response => {
      console.log(response)
      localStorage.setItem(LIST_MASTER_DATA, JSON.stringify(response))
    })
    .catch(response => {
      console.log('Lỗi API LIST_MASTER_DATA:', response.message)
    })
}

export async function cacheLocal() {
  await getListMasterData()
}

export function getListPositions() {
  apiFactory
    .callAPI(ConstantAPI['QLDM-1-1-1'].ALL_POSITION)
    .then(response => {
      localStorage.setItem(LIST_POSITIONS, JSON.stringify(response))
    })
    .catch(response => {
      console.log('Lỗi API LIST_POSITIONS:', response.message)
    })
}

export function getListDepartments() {
  apiFactory
    .callAPI(ConstantAPI['QLDM-1-1-1'].ALL_DEPARTMENT)
    .then(response => {
      localStorage.setItem(LIST_DEPARTMENT, JSON.stringify(response))
    })
    .catch(response => {
      console.log('Lỗi API LIST_DEPARTMENT:', response.message)
    })
}

export function getTenHqByMa(maHq) {
  const listHq = JSON.parse(localStorage.getItem(LIST_CUSTOMS))
  if (listHq) {
    for (const item of listHq) {
      if (item.code.trim() === maHq.trim()) {
        return item.code.trim().concat(' - ', item.name)
      }
    }
  }
  return maHq
}

export function getTenChucVuByKey(posCode) {
  const listChucVu = JSON.parse(localStorage.getItem(LIST_POSITIONS))
  if (listChucVu) {
    for (const item of listChucVu) {
      if (item.code === posCode) {
        return item.code.concat(' - ', item.name)
      }
    }
  }
  return posCode
}

export function getTenPhongBanByKey(depCode) {
  const listPhongBan = JSON.parse(localStorage.getItem(LIST_DEPARTMENT))
  if (listPhongBan) {
    for (const item of listPhongBan) {
      if (item.code === depCode) {
        return item.code.concat(' - ', item.name)
      }
    }
  }
  return depCode
}

export function getCapMaHq(maHq) {
  if (maHq) {
    if (maHq === '00ZZ') {
      return CUSTOM_LEVEL.TONG_CUC
    } else if (maHq.substring(2, 4) === 'ZZ' && maHq !== '00ZZ') {
      return CUSTOM_LEVEL.CUC
    } else {
      return CUSTOM_LEVEL.CHI_CUC
    }
  }
  return 0
}

export function mapCustomNameByCodeFromList(listTk) {
  const haiQuanFullName = {}
  getListHq.forEach(item => {
    haiQuanFullName[item.code] = item.code.concat(' - ', item.name)
  })
  if (listTk) {
    listTk.map(item => {
      item.customCode = haiQuanFullName[item.customCode.trim()]
      return item
    })
  }
}

export function filterByKeyAndValue(query, item) {
  return (
    (item.label &&
      item.label.toLowerCase().indexOf(query ? query.toLowerCase() : '') >
        -1) ||
    (item.key &&
      item.key.toLowerCase().indexOf(query ? query.toLowerCase() : '') > -1)
  )
}

export const allowedFiles = [
  '.pdf',
  '.zip',
  '.docx',
  '.doc',
  '.xlsx',
  '.xls',
  '.rar',
  '.7z',
  '.jpg',
  '.jpeg',
  '.png',
  '.tif'
]
export const allowedFilesGUQ = [
  '.pdf',
  '.docx',
  '.doc',
  '.jpg',
  '.jpeg',
  '.png'
]
export const allowedExcel = ['.xlsx', '.xls']
export const allowedImages = ['.jpeg', '.jpg','.png','.git','.bmp']
// File Size 5MB
export const maxFileSize = 5

export function validateFileExtension(file, isExcel) {
  var regex

  if (isExcel === true) {
    regex = new RegExp(
      '([a-zA-Z0-9s_\\.()-:])+(' + allowedExcel.join('|') + ')$'
    )
  } else {
    regex = new RegExp(
      '([a-zA-Z0-9s_\\.()-:])+(' + allowedFiles.join('|') + ')$'
    )
  }
  // console.log(file.name.toLowerCase())
  if (!regex.test(file.name.toLowerCase())) {
    return false
  }
  return true
}

export function isImage(file) {
  return file['type'].split('/')[0] == 'image'; //returns true or false
}

export function getFileExtension(file) {
  // var ValidImageTypes = ["image/gif", "image/jpeg", "image/png","image/svg+xml"];
  // var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png", ".svg"];
  const fileName = file.name || file.fileName
  const filextend = fileName !==null? fileName.substring(fileName.lastIndexOf(".") + 1) :'';
  return filextend.toLowerCase()
}

export function checkIsValidFileSize(size, maxSize) {
  // Chia 1024 => KB , /1024 =>MB
  const mb = size / (1024 * 1024)
  if (mb > maxSize) {
    return false
  }
  return true
}

// Get Ten theo Ma tren Grid
export function getNameByIdOnGrid(id, prop1, prop2, lstDm) {
  try {
    const lstObject = lstDm.filter(o => o['' + prop1 + ''] === id)
    return lstObject.length > 0 ? lstObject[0]['' + prop2 + ''] : ''
  } catch (error) {
    
    return ''
  }
}

/*
 * Hàm hiển thị dialog xác nhận khi gửi bản kê
 * @param this$Confirm  :this.$confirm
 * @param onSuccess : function callBack khi click nút có
 * */
export function showConfirmCustom(
  this$Confirm,
  MESSAGE_CONFIRM,
  onSuccess,
  TITLE_MESSAGE = 'Cảnh báo',
  TITLE_MESSAGE_BOX = '',
  CANCEL_BUTTON_BOX = '',
  CONFIRM_BUTTON_BOX = ''
) {
  return this$Confirm(MESSAGE_CONFIRM, TITLE_MESSAGE, {
    confirmButtonText: 'Có',
    cancelButtonText: 'Không',
    customClass: TITLE_MESSAGE_BOX,
    cancelButtonClass: CANCEL_BUTTON_BOX,
    confirmButtonClass: CONFIRM_BUTTON_BOX,
    type: 'warning'
  })
    .then(onSuccess)
    .catch(() => {
      // doNothing
    })
}

export function getCurrentDateNoTime() {
  const dt = new Date()
  const y = dt.getFullYear()
  const m = dt.getMonth()
  const d = dt.getDate()
  return new Date(y, m, d)
}

export function createDateFromStrDate(strDate) {
  try {
    var textDate = strDate.trim()
    var Y_M_D, D_M_Y, H_M
    var dt, yyyy, mm, dd, hh, mi, arrDate

    // yyyy-MM-ddThh:mm:ss (2016-07-12T00:00:00)
    if (textDate.length === 19 && textDate.indexOf(' ') === -1) {
      textDate = textDate.substring(0, 10)

      Y_M_D = textDate.split('-')
      dt = new Date(
        parseInt(Y_M_D[0], 10),
        parseInt(Y_M_D[1], 10) - 1,
        parseInt(Y_M_D[2], 10),
        0,
        0
      )
      return dt
    }
    if (textDate.length === 10) {
      if (textDate.indexOf('/') > 2) {
        /* Format Date YYYY/MM/DD*/
        Y_M_D = textDate.split('/')
        dt = new Date(
          parseInt(Y_M_D[0], 10),
          parseInt(Y_M_D[1], 10) - 1,
          parseInt(Y_M_D[2], 10),
          0,
          0
        )
      } else {
        /* textDate = '17/12/2015'*/
        D_M_Y = textDate.split('/')
        dt = new Date(
          parseInt(D_M_Y[2], 10),
          parseInt(D_M_Y[1], 10) - 1,
          parseInt(D_M_Y[0], 10),
          0,
          0
        )
      }
      return dt
    }
    /* Format Date DD/MM/YYYY*/
    if (textDate.length === 16) {
      /* textDate = '17/12/2015 23:25'*/
      arrDate = textDate.split(' ')
      if (arrDate[0].length > arrDate[1].length) {
        D_M_Y = arrDate[0].split('/')
        H_M = arrDate[1].split(':')
        dt = new Date(
          parseInt(D_M_Y[2], 10),
          parseInt(D_M_Y[1], 10) - 1,
          parseInt(D_M_Y[0], 10),
          H_M[0],
          H_M[1]
        )
        return dt
      } else if (arrDate[0].length < arrDate[1].length) {
        // '23:25 17/12/2015'
        H_M = arrDate[0].split(':')
        D_M_Y = arrDate[1].split('/')
        dt = new Date(
          parseInt(D_M_Y[2], 10),
          parseInt(D_M_Y[1], 10) - 1,
          parseInt(D_M_Y[0], 10),
          H_M[0],
          H_M[1]
        )
        return dt
      }
    }
    /* Format Date DDMMYYYY*/
    if (textDate.length === 8) {
      /* '17122015' */
      var now = new Date()
      dd = strDate.substring(0, 2)
      mm = strDate.substring(2, 4)
      yyyy = strDate.substring(4, 8)
      hh = now.getHours()
      mi = now.getMinutes()
      dt = new Date(
        parseInt(yyyy, 10),
        parseInt(mm, 10) - 1,
        parseInt(dd, 10),
        hh,
        mi
      )
      return dt
    }

    return createDateFromStrDateChild(strDate)
    // eslint-disable-next-line no-empty
  } catch (er) {}
}

function createDateFromStrDateChild(strDate) {
  var textDate = strDate.trim()
  var D_M_Y, H_M
  var dt, yyyy, mm, dd, hh, mi, ss, arrDate

  /* Format Date DD/MM/YYYY HH:MM:SS*/
  if (textDate.length === 19 && textDate.indexOf(' ') > -1) {
    /* textDate = '17/12/2015 23:25:24'*/
    arrDate = textDate.split(' ')
    if (arrDate[0].length > arrDate[1].length) {
      D_M_Y = arrDate[0].split('/')
      H_M = arrDate[1].split(':')
      dt = new Date(
        parseInt(D_M_Y[2], 10),
        parseInt(D_M_Y[1], 10) - 1,
        parseInt(D_M_Y[0], 10),
        H_M[0],
        H_M[1],
        H_M[2]
      )
      return dt
    } else if (arrDate[0].length < arrDate[1].length) {
      /* textDate = '23:25:24 17/12/2015'*/
      H_M = arrDate[0].split(':')
      D_M_Y = arrDate[1].split('/')
      dt = new Date(
        parseInt(D_M_Y[2], 10),
        parseInt(D_M_Y[1], 10) - 1,
        parseInt(D_M_Y[0], 10),
        H_M[0],
        H_M[1],
        H_M[2]
      )
      return dt
    }
  }
  /* Format Date 2021-02-06 08:53:00.0*/
  if (textDate.length === 21) {
    yyyy = strDate.substring(0, 4)
    mm = strDate.substring(5, 7)
    dd = strDate.substring(8, 10)
    hh = strDate.substring(11, 13)
    mi = strDate.substring(14, 16)
    ss = strDate.substring(17, 19)
    dt = new Date(
      parseInt(yyyy, 10),
      parseInt(mm, 10) - 1,
      parseInt(dd, 10),
      parseInt(hh, 10),
      parseInt(mi, 10),
      parseInt(ss, 10)
    )
    return dt
  }
}

export function createDateYYYYMMDD(strDate)
{
  var textDate = strDate.trim();
  try
  {
    /*Format Date YYYYMMDD*/
      if (textDate.length == 8) {
          /* '20200515' */
          var now = new Date();
          var yyyy = strDate.substring(0, 4);
          var mm = strDate.substring(4, 6);
          var dd = strDate.substring(6, 8);
          var hh = now.getHours();
          var mi = now.getMinutes();
          var dt = new Date(parseInt(yyyy, 10),
              parseInt(mm, 10) - 1,
              parseInt(dd, 10),
              hh,
              mi);
          return dt;
      }
      /*Format Date YYYYMMDD HHMMSS*/
      if (textDate.length == 15) {
        var yyyy = strDate.substring(0, 4);
          var mm = strDate.substring(4, 6);
          var dd = strDate.substring(6, 8);
          var hh = strDate.substring(9, 11);
          var mi = strDate.substring(11, 13);
          var ss = strDate.substring(13, 15);
          var dt = new Date(parseInt(yyyy, 10),
              parseInt(mm, 10) - 1,
              parseInt(dd, 10),
              parseInt(hh, 10),
              parseInt(mi, 10),
              parseInt(ss, 10));
          return dt;
      }     
  }catch(ex)
  {
    
  } 
}

export function getDateStringHoursMinutesSecond(date) {
  try {
      var strDay = '';
      var strMonth = '';
      var strHours = '';
      var strMinutes = '';
      var strSecond = '';
      if (date != null && date != undefined) {
          var day = date.getDate();
          var month = date.getMonth();
          var year = date.getFullYear();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var second = date.getSeconds();
          /*(month + 1)*/
          month = month + 1;
          /*day*/
          if (day < 10) {
              strDay = '0' + day.toString();
          } else {
              strDay = day.toString();
          }
          /*month*/
          if (month < 10) {
              strMonth = '0' + month.toString();
          } else {
              strMonth = month.toString();
          }
          /*Hours*/
          if (hours < 10) {
              strHours = '0' + hours.toString();
          } else {
              strHours = hours.toString();
          }
          /*Minutes*/
          if (minutes < 10) {
              strMinutes = '0' + minutes.toString();
          } else {
              strMinutes = minutes.toString();
          }
          /*Second*/
          if (second < 10) {
            strSecond = '0' + second.toString();
          } else {
            strSecond = second.toString();
          }
          var dateString = strDay + '/' + strMonth + '/' + year + ' ' + strHours + ':' + strMinutes + ':' + strSecond;
          return dateString;
      }
  } catch (err) {}
}

export function getDateStringHoursMinutes(date) {
  try {
    var strDay = ''
    var strMonth = ''
    var strHours = ''
    var strMinutes = ''
    if (date !== null && date !== undefined) {
      var day = date.getDate()
      var month = date.getMonth()
      var year = date.getFullYear()
      var hours = date.getHours()
      var minutes = date.getMinutes()
      /* (month + 1)*/
      month = month + 1
      /* day*/
      if (day < 10) {
        strDay = '0' + day.toString()
      } else {
        strDay = day.toString()
      }
      /* month*/
      if (month < 10) {
        strMonth = '0' + month.toString()
      } else {
        strMonth = month.toString()
      }
      /* Hours*/
      if (hours < 10) {
        strHours = '0' + hours.toString()
      } else {
        strHours = hours.toString()
      }
      /* Minutes*/
      if (minutes < 10) {
        strMinutes = '0' + minutes.toString()
      } else {
        strMinutes = minutes.toString()
      }
      return (
        strDay + '/' + strMonth + '/' + year + ' ' + strHours + ':' + strMinutes
      )
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

export function subtractDate(dt1,dt2,type)
{
  //type: 1-Days, 2-Hours, 3-Minutes, 4-Seconds
  const arrDK = [undefined,null,""];
  let num =0;
  let ret =0;
  if(arrDK.indexOf(dt1) ==-1 && arrDK.indexOf(dt2) ==-1)
  {
    num = dt1 -dt2;
    switch(type)
    {
    case 1:
      ret = num/(1000*60*60*24);
      break;
    case 2:
      ret = num/(1000*60*60);
      break;
    case 3:
      ret = num/(1000*60);
      break;
    case 4:
      ret = num/(1000);
      break;
    }
  }
  return ret;
}

export function formatFullDate_VN(value) {
  if (!value) return ''
  return value !== null ? moment(String(value)).format('DD/MM/YYYY') : null
}

export function camelCaseToSnakeCaseDeep(anything) {
  const thing = _.cloneDeep(anything)

  if (_.isEmpty(thing) || (!_.isObject(thing) && !_.isArray(thing))) {
    return thing
  }

  if (_.isArray(thing)) {
    const arr = thing
    return arr.map(el => camelCaseToSnakeCaseDeep(el))
  }

  // thing can be only not empty object here
  const objWithMappedKeys = _.mapKeys(thing, (value, key) => _.snakeCase(key))
  const objWithMappedValues = _.mapValues(objWithMappedKeys, value =>
    camelCaseToSnakeCaseDeep(value)
  )

  return objWithMappedValues
}

export function snakeCaseToCamelCaseDeep(anything) {
  const thing = _.cloneDeep(anything)

  if (_.isEmpty(thing) || (!_.isObject(thing) && !_.isArray(thing))) {
    return thing
  }

  if (_.isArray(thing)) {
    const arr = thing
    return arr.map(el => snakeCaseToCamelCaseDeep(el))
  }

  // thing can be only not empty object here
  const objWithMappedKeys = _.mapKeys(thing, (value, key) => _.camelCase(key))
  const objWithMappedValues = _.mapValues(objWithMappedKeys, value =>
    snakeCaseToCamelCaseDeep(value)
  )

  return objWithMappedValues
}

export function multiHeaderExcelTraCuu(objThis) {
  const multiHeaderExcel = []

  const maHq = objThis.$store.getters.org.trim()
  const orgList = JSON.parse(localStorage.getItem(LIST_CUSTOMS))
  let coQuanChuQuan = {}
  const coQuanChapHanh = orgList.filter(item => item.code === maHq)

  if (maHq.includes('ZZ')) {
    coQuanChuQuan = orgList.filter(item => item.code === '00ZZ')
  } else {
    const strMaHQ = maHq.substr(0, 2) + 'ZZ'
    coQuanChuQuan = orgList.filter(item => item.code === strMaHQ)
  }

  multiHeaderExcel.push([''.concat(coQuanChuQuan[0].name)])
  multiHeaderExcel.push([''.concat(coQuanChapHanh[0].name)])
  multiHeaderExcel.push([''.concat(objThis.title)])
  const ngayIn = 'Ngày in: '.concat(formatFullDate_VN(new Date()))
  multiHeaderExcel.push([''.concat(ngayIn)])
  multiHeaderExcel.push([''])
  // multiHeaderExcel: [
  //   ['CƠ QUAN CHỦ QUẢN'],
  //   ['CƠ QUAN CHẤP HÀNH'],
  //   ['HỒ SƠ PHÂN TÍCH PHÂN LOẠI'],
  //   ['NGÀY TRA CỨU: 17/11/2021']
  // ]

  return multiHeaderExcel
}

export function mergeCellExcelTraCuu() {
  const mergeCellExcel = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 }},
    { s: { r: 1, c: 0 }, e: { r: 1, c: 2 }},
    { s: { r: 2, c: 0 }, e: { r: 2, c: 0 }, t: 1 },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 2 }}
  ]
  return mergeCellExcel
}

export function formatCellStyleExcelTraCuu(lenCol) {
  const formatCellExcel = [
    {
      na: 'A2',
      s: {
        font: {
          name: 'arial',
          bold: true
        }
      }
    },
    {
      na: 'A3',
      s: {
        font: {
          name: 'arial',
          bold: true
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1' // any truthy value here
        }
      }
    },
    {
      na: 'A4',
      s: {
        font: {
          name: 'arial',
          italic: true
        },
        alignment: {
          vertical: 'center',
          horizontal: 'left',
          wrapText: '1'
        }
      }
    }
  ]

  // Bold header
  const strChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lstChar = [...strChar]
  const len = lstChar.length
  let i = 0
  while (i < len) {
    if (i === lenCol) {
      break
    }
    const obj = {}
    obj.na = lstChar[i] + 6
    obj.s = {
      font: {
        name: 'arial',
        bold: true
      },
      alignment: {
        vertical: 'center',
        horizontal: 'left'
      }
    }

    formatCellExcel.push(obj)
    i++
  }
  return formatCellExcel
}
/*Get Parameter Từ URL*/
export function getUrlParameter(sParam) {
  const sPageURL = decodeURIComponent(window.location.hash.split('?')[1])
  let sURLVariables = sPageURL.split('&')
  let sParameterName = ''
  for (let i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};
//routeValueTuVung = getUrlParameterLink(decodeURIComponent(this.href), "tuvung");
export function getUrlParameterLink(strLink, sParam) {
  let sPageURL = ''
  if (strLink != "" && strLink != null && strLink != undefined && strLink.indexOf("{0}") == (-1)) {
      let idx = strLink.indexOf("?");
      let strParam = strLink.substring(idx + 1, strLink.length)
      sPageURL = decodeURIComponent(strParam.replace(/#/g, ''));
  } else {
      sPageURL = decodeURIComponent(window.location.search.substring(1));
  }
  let sURLVariables = sPageURL.split('&');
  let sParameterName =''
  for (let i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
          return sParameterName[1] === undefined ? true : sParameterName[1];
      }
  }
};
