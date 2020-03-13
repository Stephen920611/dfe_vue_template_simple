<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <span v-if="item.redirect==='noRedirect'||index==levelList.length-1"
                      class="no-redirect">{{ item.meta.title }}</span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
    import pathToRegexp from 'path-to-regexp'
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                levelList: null
            }
        },
        computed: {
            ...mapGetters([
                'permission_routes',
                'sidebar',
                'avatar'
            ]),
        },
        watch: {
            $route() {
                this.getBreadcrumb()
            }
        },
        created() {
            this.getBreadcrumb()
        },
        methods: {
            //获取面包屑
            getBreadcrumb() {
                const {dispatch} = this.$store;
                // only show routes with meta.title
                //只显示路由的meta.title
                let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
                const first = matched[0]

                //判断是否是首页，如果不是首页，就拼接上首页

                if (!this.isDashboard(first)) {
                    matched = [{path: '/dashboard', meta: {title: '首页'}}].concat(matched)
                }

                this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
                //根据路由显示侧边栏
                this.permission_routes.map((val,idx)=>{
                   if(val.hasOwnProperty('name') &&this.levelList.length >1 && val.name === this.levelList[1].name){
                       dispatch({
                           type: 'app/updateSidebar',//调用action
                           sidebarData: val.children,//侧边栏的数据
                           hasSidebar: true,//是否显示侧边栏
                           sidebarParents: val,//点击的顶部标题的数据
                       })

                   }

               });


            },
            //是否是首页
            isDashboard(route) {
                const name = route && route.name
                if (!name) {
                    return false
                }
                return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
            },
            pathCompile(path) {
                // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
                const {params} = this.$route
                var toPath = pathToRegexp.compile(path)
                return toPath(params)
            },
            //点击跳转路由
            handleLink(item) {
                const {redirect, path} = item
                if (redirect) {
                    this.$router.push(redirect)
                    return
                }
                this.$router.push(this.pathCompile(path))
            }
        }
    }
</script>

<style lang="scss" scoped>
    .app-breadcrumb.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 50px;
        margin-left: 8px;

        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }
</style>
