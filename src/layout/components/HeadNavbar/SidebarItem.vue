<template>
    <div v-if="!item.hidden" style="display:inline-block;">
        <!--路由没有子元素-->
        <template
                v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}"
                              @click="menuChange(onlyOneChild,true)">
                    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title"/>
                </el-menu-item>
            </app-link>
        </template>
        <!--路由下有子路由-->
         <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body  @click.native="menuChange(item,false)" >
             <template slot="title"  >
                 <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"/>
            <!--增加固定宽度解决箭头被遮挡的问题-->
                 <!--<div style="display:inline-block;width: 18px "></div>-->
             </template>
             <!--子路由垂直显示-->
             <!--<vertical-item
                     v-for="child in item.children"
                     :key="child.path"
                     :is-nest="true"
                     :item="child"
                     :base-path="resolvePath(child.path)"
             />-->
             <!--TODO:顶部标题下子路由渲染，但不显示，为了顶部标题选中状态和绑定侧边栏-->
             <sidebar-item
                     v-show="false"
                     v-for="child in item.children"
                     :key="child.path"
                     :is-nest="true"
                     :item="child"
                     :base-path="resolvePath(child.path)"
                     class="nest-menu"
             />
         </el-submenu>
    </div>
</template>

<script>
    import path from 'path'
    import {isExternal} from '@/utils/validate'
    import Item from './Item'
    import AppLink from './Link'
    import VerticalItem from './VerticalItem'
    import FixiOSBug from './FixiOSBug'

    export default {
        name: 'SidebarItem',
        components: {Item, AppLink, VerticalItem},
        mixins: [FixiOSBug],
        props: {
            // route object
            item: {
                type: Object,
                required: true
            },
            isNest: {
                type: Boolean,
                default: false
            },
            basePath: {
                type: String,
                default: ''
            }
        },
        data() {
            // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
            // TODO: 用渲染功能重构
            this.onlyOneChild = null
            return {}
        },

        methods: {
            /**
             * 顶部菜单栏箭头变化
             */
            toggleMenuItem(){
                const { dispatch } = this.$store;
//                this.menuVisible = ! this.menuVisible;
                dispatch({
                    type:'app/toggleMenu',
                    toggleMenuVisible:false
                })
            },
            /**
             * 更新侧边栏
             * @param data {Array} 侧边栏的显示数据
             * @param status {Boolean} 是否显示侧边栏
             * @param parents {Object} 选中顶部标题的数据
             */
            updateSidebar(data, status, parents) {
                const {dispatch} = this.$store;
                dispatch({
                    type: 'app/updateSidebar',//调用action
                    sidebarData: data,//侧边栏的数据
                    hasSidebar: status,//是否显示侧边栏
                    sidebarParents: parents,//点击的顶部标题的数据
                })

            },
            /**
             * 选中顶部菜单选项没有子路由，点击事件
             * @param item {Object} 元素数据
             * @param onlyOneChild {Boolean} 是否含有子元素
             */
            menuChange(item, onlyOneChild) {
                // 收起顶部标题（箭头变化）
                this.toggleMenuItem()
                if(!onlyOneChild){
                    // 更改侧边栏（子路由的值，是否显示侧边栏，父路由数据）
                    this.updateSidebar(item.children, true, item);
                    // 跳转重定向路由
                    this.$router.push({
                        path: item.path
                    })
                }else{
                    // 更改侧边栏（子路由的值，是否显示侧边栏，父路由数据）
                    this.updateSidebar(null, false, null);
                }

            },
            /**
             * 是否只有一个子元素显示
             * @param children {Array} 子元素
             * @param parent {Object} 该元素数据
             * @returns {boolean}
             */

            hasOneShowingChild(children = [], parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        // Temp set 临时集（如果只有一个显示子级，将使用该集）
                        this.onlyOneChild = item
                        return true
                    }
                })

                // 当只有一个子路由器时，默认情况下会显示该子路由器
                if (showingChildren.length === 1) {
//                    console.log('showingChildren',showingChildren);
                    return true
                }

                // 如果没有子路由器要显示，请显示父路由
                if (showingChildren.length === 0) {
                    this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
//                    console.log('onlyOneChild',this.onlyOneChild);

                    return true
                }

                return false
            },
            /**
             * 路由字符串处理
             * @param routePath {String} 路由
             * @returns {*}
             */
            resolvePath(routePath) {
                //判断路由是否是外链地址 https://...
                if (isExternal(routePath)) {
                    return routePath
                }
                if (isExternal(this.basePath)) {
                    return this.basePath
                }
                //拼接路由（父元素路由地址，子元素）
                return path.resolve(this.basePath, routePath)
            }
        }
    }
</script>
