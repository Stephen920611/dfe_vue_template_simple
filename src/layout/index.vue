<template>
    <div :class="classObj" class="app-wrapper"  >
        <div v-if="device==='mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
        <head-navbar />
        <div>
            <sidebar  v-if="hasSidebar" class="sidebar-container" :style="headVisible ? 'padding-top: 60px' : null"/>
            <!--<div :class="{'fixed-header':fixedHeader}" class="navbar-container" :style=" hasSidebar ? 'margin-left:210px' : null">-->
            <div :class="{'fixed-header':fixedHeader}" class="navbar-container" :style="!hasSidebar ? 'margin-left:0' : null">
                <navbar/>
            </div>
            <div class="main-container" :style="!hasSidebar ? 'margin-left:0' : null" v-scrollBar>
                    <app-main/>
            </div>

        </div>
    </div>
</template>

<script>
    import {Navbar, Sidebar, AppMain, HeadNavbar} from './components'
    import ResizeMixin from './mixin/ResizeHandler'
    import { mapGetters } from 'vuex'

    export default {
        name: 'Layout',
        components: {
            Navbar,
            Sidebar,
            AppMain,
            HeadNavbar,
        },
        data() {
            return {
                headVisible: this.$store.state.app.headVisible,
//                hasSidebar: this.$store.state.app.hasSidebar,
            }
        },
        mixins: [ResizeMixin],
        computed: {
            ...mapGetters([
                'hasSidebar'
            ]),
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            fixedHeader() {
                return this.$store.state.settings.fixedHeader
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile'
                }
            },
        },
        watch:{

        },
        methods: {
            handleClickOutside() {
                this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
            }
        }
    }
</script>

<style lang="scss" scoped type="text/scss">
    @import "~@/styles/mixin.scss";
    @import "~@/styles/variables.scss";

    .app-wrapper {
    @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;

    &
    .mobile.openSidebar {
        position: fixed;
        top: 0;
    }

    }
    .drawer-bg {
        background: #000;
        opacity: 0.3;
        width: 100%;
        top: 0;
        height: 100%;
        position: absolute;
        z-index: 999;
    }

    .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - #{$sideBarWidth});
        transition: width 0.28s;
    }

    .hideSidebar .fixed-header {
        width: calc(100% - 54px)
    }

    .mobile .fixed-header {
        width: 100%;
    }
</style>
