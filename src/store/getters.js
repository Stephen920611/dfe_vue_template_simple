const getters = {
  sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
    sidebarData: state => state.app.sidebarData,
    hasSidebar: state => state.app.hasSidebar,
    sidebarParents: state => state.app.sidebarParents,
    toggleMenuVisible: state => state.app.toggleMenuVisible,
    menuVisibleBtn: state => state.app.menuVisibleBtn,
    resizeHandlerVisible: state => state.app.resizeHandlerVisible
}
export default getters
