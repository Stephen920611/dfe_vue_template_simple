const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
    sidebarData: state => state.app.sidebarData,
    hasSidebar: state => state.app.hasSidebar,
    sidebarParents: state => state.app.sidebarParents
}
export default getters
