const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // User
  token: state => state.user.token,
  iss: state => state.user.iss,
  uid: state => state.user.uid,
  ufn: state => state.user.ufn,
  org: state => state.user.org,
  dep: state => state.user.dep,
  pos: state => state.user.pos,
  email: state => state.user.ema,
  otp: state => state.user.otp,
  avatar: state => state.user.avatar,
  posName: state => state.user.posName,
  orgName: state => state.user.orgName,
  userInfo: state => state.user.userInfo,

  permission_routes: state => state.permission.routes,
  menus: state => state.permission.menus
}
export default getters
