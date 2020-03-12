import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  headVisible:true, //检测是顶部标题true还是侧边栏false
    sidebarData:null,
    hasSidebar:false,//是否有sidebar
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
    UPDATE_SIDEBAR:(state,{sidebarData,hasSidebar})=>{
      state.sidebarData = sidebarData;
        state.hasSidebar = hasSidebar;
    }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
    updateSidebar({commit},{type,sidebarData,hasSidebar}){
        commit('UPDATE_SIDEBAR',{sidebarData,hasSidebar})
  }
  }

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
