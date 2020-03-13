<template>
    <div v-if="!item.hidden" style="display:inline-block;">
        <template
                v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}"
                              @click="menuChange(onlyOneChild)">
                    <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title"/>
                </el-menu-item>
            </app-link>
        </template>
        <!--<template v-else ref="subMenu" popper-append-to-body>
            <app-link v-if="item.meta" :to="resolvePath(item.path)">
                <el-menu-item :index="resolvePath(item.path)"
                              @click="menuHasChild(item)" >
                    <item :icon="item.meta && item.meta.icon" :title="item.meta.title"/>
                </el-menu-item>
            </app-link>
        </template>-->

         <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body  @click.native="menuHasChild(item)" >
             <template slot="title"  >
                 <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title"/>
            <!--增加固定宽度解决箭头被遮挡的问题-->
                 <!--<div style="display:inline-block;width: 18px "></div>-->
             </template>
             <!--<vertical-item
                     v-for="child in item.children"
                     :key="child.path"
                     :is-nest="true"
                     :item="child"
                     :base-path="resolvePath(child.path)"
             />-->
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
            // TODO: refactor with render function
            this.onlyOneChild = null
            return {}
        },
        mounted: function () {
//            console.log(this.props,'13232323')
        },

        methods: {
            updateSidebar(data, status, parents) {
                const {dispatch} = this.$store;
                dispatch({
                    type: 'app/updateSidebar',//调用action
                    sidebarData: data,//侧边栏的数据
                    hasSidebar: status,//是否显示侧边栏
                    sidebarParents: parents,//点击的顶部标题的数据
                })

            },
            menuChange(onlyOneChild) {
                this.updateSidebar(null, false, null);

            },
            menuHasChild(item) {
                //更改侧边栏
                this.updateSidebar(item.children, true, item);
                //跳转重定向路由
                this.$router.push({
                    path: item.path,
                })
            },
            hasOneShowingChild(children = [], parent) {
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        // Temp set(will be used if only has one showing child)
                        this.onlyOneChild = item
                        return true
                    }
                })

                // When there is only one child router, the child router is displayed by default
                if (showingChildren.length === 1) {
//                    console.log('showingChildren',showingChildren);
                    return true
                }

                // Show parent if there are no child router to display
                if (showingChildren.length === 0) {
                    this.onlyOneChild = {...parent, path: '', noShowingChildren: true}
//                    console.log('onlyOneChild',this.onlyOneChild);

                    return true
                }

                return false
            },
            resolvePath(routePath) {
                if (isExternal(routePath)) {
                    return routePath
                }
                if (isExternal(this.basePath)) {
                    return this.basePath
                }
                return path.resolve(this.basePath, routePath)
            }
        }
    }
</script>
