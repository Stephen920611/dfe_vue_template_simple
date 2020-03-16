import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  headVisible:true, //检测是顶部标题true还是侧边栏false
    sidebarData:null, //侧边栏的数据
    hasSidebar:false,//是否有sidebar，根据顶部导航是否有子元素来判断
    sidebarParents:null,//点击的顶部标题的数据
    toggleMenuVisible:false,//默认显示单行菜单
    menuVisibleBtn:null,// 展开隐藏多行菜单按钮的显示与隐藏
    resizeHandlerVisible:true,// 监听屏幕变化的标志
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
    UPDATE_SIDEBAR:(state,{sidebarData,hasSidebar,sidebarParents})=>{
      state.sidebarData = sidebarData;
        state.hasSidebar = hasSidebar;
        state.sidebarParents = sidebarParents ? sidebarParents.path:''
    },
    TOGGLE_MENU: (state, toggleMenuVisible) => {
        state.toggleMenuVisible = toggleMenuVisible
    },
    TOGGLE_MENU_BTN: (state, menuVisibleBtn) => {
        state.menuVisibleBtn = menuVisibleBtn
    },
    TOGGLE_RESIZE_BTN: (state, resizeHandlerVisible) => {
        state.resizeHandlerVisible = resizeHandlerVisible
    },
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
    updateSidebar({commit},{type,sidebarData,hasSidebar,sidebarParents}){
        commit('UPDATE_SIDEBAR',{sidebarData,hasSidebar,sidebarParents})
  },
    //判断顶部导航显示一行还是多行
    toggleMenu({ commit }, { _, toggleMenuVisible}) {
        commit('TOGGLE_MENU', toggleMenuVisible)
    },
    //判断顶部导航多行按钮的显示与隐藏
    toggleMenuBtn({ commit }, { _, menuVisibleBtn}) {
        commit('TOGGLE_MENU_BTN', menuVisibleBtn)
    },
    //监听屏幕的变化
    toggleResizeBtn({ commit }, {resizeHandlerVisible}) {
        commit('TOGGLE_RESIZE_BTN', resizeHandlerVisible)
    },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
