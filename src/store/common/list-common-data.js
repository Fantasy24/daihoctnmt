const state = {
  danhSachMaHaiQuan: [],
  danhSachLoaiHinhXNK: [],
  danhSachCanBoHQ: [],
  danhSachChuyenVienPhanTichPhanLoai: [],
  danhSachTrangThaiPTPL: [],
  danhSachTaiLieuKemTheo: []
}

const actions = {
  // danh_sach_loai_hinh_xnk
  async setDanhSachLoaiHinhXNK({ commit }, payload) {
    commit('setDanhSachLoaiHinhXNK', payload)
  },

  // danh_sach_don_vi
  async setDanhSachChuyenVienPhanTichPhanLoai({ commit }, payload) {
    commit('setDanhSachChuyenVienPhanTichPhanLoai', payload)
  },

  // danh sach trang thai ptpl
  async setDanhSachTrangThaiPTPL({ commit }, payload) {
    commit('setDanhSachTrangThaiPTPL', payload)
  },

  // danh sach tai lieu kem theo
  async setDanhSachTaiLieuKemTheo({ commit }, payload) {
    commit('setDanhSachTaiLieuKemTheo', payload)
  },

  // danh_sach_can_bo_hq
  async setDanhSachCanBoHQ({ commit }, payload) {
    commit('setDanhSachCanBoHQ', payload)
  }
}

const mutations = {
  setDanhSachLoaiHinhXNK(state1, value) {
    state1.danhSachLoaiHinhXNK = value
  },
  setDanhSachCanBoHQ(state1, value) {
    state1.danhSachCanBoHQ = value
  },
  setDanhSachChuyenVienPhanTichPhanLoai(state1, value) {
    state1.danhSachChuyenVienPhanTichPhanLoai = value
  },
  setDanhSachTrangThaiPTPL(state1, value) {
    state1.danhSachTrangThaiPTPL = value
  },
  setDanhSachTaiLieuKemTheo(state1, value) {
    state1.danhSachTaiLieuKemTheo = value
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations: mutations,
  getters: {}
}
