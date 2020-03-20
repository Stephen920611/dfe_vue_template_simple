<template>
    <div :class="{'has-logo':showLogo}" class="head-nav-bar">
        <logo v-if="showLogo"/>
        <div class="header-menu" :style="toggleMenuVisible ? null : 'overflow:hidden'">
            <el-menu
                    :default-active="activeMenu"
                    background-color="#304156"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    mode="horizontal"
                    class="el-menu-demo"
                    ref="subMenuList"
            >
                <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route"
                              :base-path="route.path"/>
            </el-menu>
        </div>

        <div  v-show="menuVisibleBtn" class="header-menu-visible" @click ="toggleMenu()">
            <i :class="toggleMenuVisible ? 'el-icon-arrow-up':'el-icon-arrow-down'"  ></i>
        </div>
        <!--最初版本-->
        <!--<div  class="header-menu-visible" @click ="toggleMenu()">-->
            <!--<i :class="toggleMenuVisible ? 'el-icon-arrow-up':'el-icon-arrow-down'"  ></i>-->
        <!--</div>-->
        <div class="right-menu">
            <template v-if="device!=='mobile'">
                <search id="header-search" class="right-menu-item"/>

                <!--<error-log id="error-log" class="errLog-container right-menu-item hover-effect" />-->

                <screenfull id="screenfull" class="right-menu-item hover-effect"/>

                <el-tooltip content="布局大小" effect="dark" placement="bottom">
                    <size-select id="size-select" class="right-menu-item hover-effect"/>
                </el-tooltip>
            </template>
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper" >
                    <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                    <router-link to="/profile/index">
                        <el-dropdown-item>
                            个人中心
                        </el-dropdown-item>
                    </router-link>
                    <router-link to="/">
                        <el-dropdown-item>
                            首页
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided @click.native="logout">
                        <span style="display:block;">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import Logo from './Logo'
    import SidebarItem from './SidebarItem'
    import variables from '@/styles/variables.scss'

    import Breadcrumb from '@/components/Breadcrumb'
    import Hamburger from '@/components/Hamburger'
    import ErrorLog from '@/components/ErrorLog'
    import Screenfull from '@/components/Screenfull'
    import SizeSelect from '@/components/SizeSelect'
    import Search from '@/components/HeaderSearch'

    export default {
        components: {
            SidebarItem,
            Logo,
            Hamburger,
            ErrorLog,
            Screenfull,
            SizeSelect,
            Breadcrumb,
            Search
        },
        data() {
            return {
                list: null,
                listLoading: true
            }
        },
        computed: {
            ...mapGetters([
                'permission_routes',
                'sidebar',
                'device',
                'avatar',
                'toggleMenuVisible',
                'menuVisibleBtn',
                'resizeHandlerVisible'
            ]),
            activeMenu() {
                const route = this.$route
                const {meta, path} = route
//                console.log('route',route);
                // if set path, the sidebar will highlight the path you set
                if (meta.activeMenu) {
                    return meta.activeMenu
                }
                return path
            },
            showLogo() {
//                return this.$store.state.settings.sidebarLogo
                return true
            },
            variables() {
                return variables
            },
        },
        watch: {
            resizeHandlerVisible:{
                handler(val, oldVal) {
                    this.resizeUpOrDownBtn();
                },
            }
        },
        mounted:function () {
            const { dispatch } = this.$store;
            this.resizeUpOrDownBtn();
        },
        methods: {
            //是否显示多余菜单
            toggleMenu(){
                const { dispatch } = this.$store;
                dispatch({
                    type:'app/toggleMenu',
                    toggleMenuVisible:!this.toggleMenuVisible
                })
            },
            //监听多余按钮的显示
            resizeUpOrDownBtn(){
                const { dispatch } = this.$store;
                if (this.$refs.subMenuList.$el.offsetHeight > 60) {
                    dispatch({
                        type:'app/toggleMenuBtn',
                        menuVisibleBtn:true
                    })
                }else{
                    dispatch({
                        type:'app/toggleMenuBtn',
                        menuVisibleBtn:false
                    })
                }
            },
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            async logout() {
                await this.$store.dispatch('user/logout')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }
        }
    }
</script>
<style lang="scss" scoped type="text/scss">
    @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";
    .el-menu--popup{
        padding: 0;
    }
    #app {

        & > > > .hideSidebar .main-container {
            margin-left: 0;
        }

        .main-container {
            min-height: 100%;
            transition: margin-left .28s;
            margin-left: $sideBarWidth;
            position: relative;
        }
        .header-menu-visible{
            height: 60px;
            width: 40px;
            line-height: 60px;
            padding-top: 4px;
            text-align: center;
            background-color:#304156;
            color: #fff;
            & > i{
                font-size: 20px;
                &:hover{
                    cursor: pointer;
                }
            }
        }
        .head-nav-bar {
            position: fixed;
            top:0;
            width: 100%;
            z-index: 2000;
            display: flex;
            flex: 1;
            .sidebar-logo-container {
                height: 60px;
                line-height: 60px;
                background-color: #304156;
            }
            & > > > .svg-icon {
                margin-right: 16px;
            }
            & > > > .submenu-title-noDropdown {
                padding: 0 20px !important;
                position: relative;

                .el-tooltip {
                    padding: 0 !important;

                    .svg-icon {
                        margin-left: 20px;
                    }
                }
            }
            & > > > .el-menu-item, .el-submenu__title {
                height: 60px;
                line-height: 60px;
            }
            & > > > .sidebar-container {
                width: 0 !important; //默认54px，收起时会展示图标，因此我们设为0
            }

            & > > > .main-container {
                margin-left: 0 !important; //默认54px，收起时会留出 54px 的空白，因此我们设为0
            }

        }
        .header-menu{
            /*width: 100%;*/
            flex:1;
            height: 60px;
            .el-menu.el-menu--horizontal{
                border: none;
            }
        }
        .el-scrollbar {
            width: 100%;
            & > > > .el-scrollbar__wrap {
                overflow: visible !important;
            }
        }

        .sidebar-container {
            transition: width 0.28s;
            width: $sideBarWidth !important;
            background-color: $menuBg;
            height: 100%;
            position: fixed;
            font-size: 0px;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1001;
            overflow: hidden;

            // reset element-ui css
            .horizontal-collapse-transition {
                transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
            }

            .scrollbar-wrapper {
                overflow-x: hidden !important;
            }

            .el-scrollbar__bar.is-vertical {
                right: 0px;
            }

            .el-scrollbar {
                height: 100%;
            }

            &.has-logo {
                .el-scrollbar {
                    height: calc(100% - 50px);
                }
            }

            .is-horizontal {
                display: none;
            }

            a {
                display: inline-block;
                width: 100%;
                overflow: hidden;
            }

            .svg-icon {
                margin-right: 16px;
            }

            .el-menu {
                border: none;
                height: 100%;
                width: 100% !important;
            }

            // menu hover
            .submenu-title-noDropdown,
            .el-submenu__title {
                &:hover {
                    background-color: $menuHover !important;
                }
            }

            .is-active > .el-submenu__title {
                color: $subMenuActiveText !important;
            }

            & .nest-menu .el-submenu > .el-submenu__title,
            & .el-submenu .el-menu-item {
                min-width: $sideBarWidth !important;
                background-color: $subMenuBg !important;

                &:hover {
                    background-color: $subMenuHover !important;
                }
            }
        }

        /*.hideSidebar {
            .sidebar-container {
                width: 54px !important;
            }

            .main-container {
                margin-left: 54px;
            }

            .submenu-title-noDropdown {
                padding: 0 !important;
                position: relative;

                .el-tooltip {
                    padding: 0 !important;

                    .svg-icon {
                        margin-left: 20px;
                    }
                }
            }

            .el-submenu {
                overflow: hidden;

                & > .el-submenu__title {
                    padding: 0 !important;

                    .svg-icon {
                        margin-left: 20px;
                    }

                    .el-submenu__icon-arrow {
                        display: none;
                    }
                }
            }

            .el-menu--collapse {
                .el-submenu {
                    & > .el-submenu__title {
                        & > span {
                            height: 0;
                            width: 0;
                            overflow: hidden;
                            visibility: hidden;
                            display: inline-block;
                        }
                    }
                }
            }
        }*/
        .hideSidebar {
            .sidebar-container {
                width: 0 !important; //默认54px，收起时会展示图标，因此我们设为0
            }

            .main-container {
                margin-left: 0; //默认54px，收起时会留出 54px 的空白，因此我们设为0
            }

            .submenu-title-noDropdown {
                //padding: 0 !important;// 注意！ 侧边栏有。顶部导航的时候没有
                position: relative;

                .el-tooltip {
                    padding: 0 !important;

                    .svg-icon {
                        margin-left: 20px;
                    }
                }
            }
            /*    注释掉.hideSidebar的子样式.el-submenu，避免submenu样式失灵，原因很简单，就是这段代码会导致标题之间距离从原本的20px变成0*/
            /*   .el-submenu {
                 overflow: hidden;

                 &>.el-submenu__title {
                   padding: 0 !important;

                   .svg-icon {
                     margin-left: 20px;
                   }

                   .el-submenu__icon-arrow {
                     display: none;
                   }
                 }
               }*/
            .el-menu--collapse {
                .el-submenu {
                    & > .el-submenu__title {
                        & > span {
                            height: 0;
                            width: 0;
                            overflow: hidden;
                            visibility: hidden;
                            display: inline-block;
                        }
                    }
                }
            }
        }

        .el-menu--collapse .el-menu .el-submenu {
            min-width: $sideBarWidth !important;
        }

        // mobile responsive
        .mobile {
            .main-container {
                margin-left: 0px;
            }

            .sidebar-container {
                transition: transform .28s;
                width: $sideBarWidth !important;
            }

            &.hideSidebar {
                .sidebar-container {
                    pointer-events: none;
                    transition-duration: 0.3s;
                    transform: translate3d(-$sideBarWidth, 0, 0);
                }
            }
        }

        .withoutAnimation {

            .main-container,
            .sidebar-container {
                transition: none;
            }
        }
    }

    .right-menu {
        padding-left: 20px;
        float: right;
        /*height: 100%;*/
        line-height: 60px;
        height: 60px;
        background-color: #304156;
        color: #fff;
        padding-top: 5px;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }
        & > > > .svg-icon {
            margin-right: 0 !important;
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }


    // when menu collapsed
    .el-menu--vertical {
        & > .el-menu {
            .svg-icon {
                margin-right: 16px;
            }
        }

        .nest-menu .el-submenu > .el-submenu__title,
        .el-menu-item {
            &:hover {
                // you can use $subMenuHover
                background-color: $menuHover !important;
            }
        }

        // the scroll bar appears when the subMenu is too long
        > .el-menu--popup {
            max-height: 100vh;
            overflow-y: auto;

            &::-webkit-scrollbar-track-piece {
                background: #d3dce6;
            }

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-thumb {
                background: #99a9bf;
                border-radius: 20px;
            }
        }
    }
</style>
