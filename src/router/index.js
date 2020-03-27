import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/** 菜单的配置
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   是否在侧边栏或者顶部导航栏显示；设为true, 该路由会隐藏（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单，
 *                                如果未设置alwaysShow，则当项具有多个子路线时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    权限，控制页面角色（您可以设置多个角色）
    title: 'title'               名称，显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'             侧栏中或顶部导航栏的图标显示
    breadcrumb: false            如果设为false,该路由将在breadcrumb面包屑中隐藏（默认是false）
    activeMenu: '/example/list'  如果设置了路径，则侧边栏将突出高亮显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
    {
        path: '/redirect',//路由重置
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },

    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: {
                title: '首页',
                icon: 'dashboard'
            }
        }]
    },

    {
        path: '/example',
        component: Layout,
        redirect: '/example/table',
        name: 'Example',
        meta: {title: '案例', icon: 'example'},
        children: [
            {
                path: 'table',
                name: 'Table',
                component: () => import('@/views/table/index'),
                meta: {
                    title: '表格',
                    icon: 'table',
                }
            },
            {
                path: 'tree',
                name: 'Tree',
                component: () => import('@/views/tree/index'),
                meta: {title: '树', icon: 'tree'}
            }
        ]
    },

    {
        path: '/form',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Form',
                component: () => import('@/views/form/index'),
                meta: {title: 'Form表单', icon: 'form'}
            }
        ]
    },
    {
        path: '/profile',
        component: Layout,
        redirect: '/profile/index',
        hidden: true,
        children: [
            {
                path: 'index',
                component: () => import('@/views/profile/index'),
                name: 'Profile',
                meta: { title: '个人中心', icon: 'user', noCache: true }
            }
        ]
    },
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
    {
        path: '/permission',
        component: Layout,
        redirect: '/permission/page',
        alwaysShow: true, // 始终显示根菜单
        name: 'Permission',
        meta: {
            title: '权限测试页',
            icon: 'lock',
            roles: ['admin', 'editor'] // 可以在根导航中设置角色
        },
        children: [
            {
                path: 'page',
                component: () => import('@/views/permission/page'),
                name: 'PagePermission',
                meta: {
                    title: '页面权限',
                    icon: 'lock',
                    // roles: ['admin']
                    roles: ['admin', 'editor']
                }
            },
            {
                path: 'directive',
                component: () => import('@/views/permission/directive'),
                name: 'DirectivePermission',
                meta: {
                    title: '指令权限',
                    icon: 'lock',
                    roles: ['admin'] // 可以在根导航中设置角色
                    // 如果未设置角色，则表示：该页面不需要权限
                }
            },
            {
                path: 'role',
                component: () => import('@/views/permission/role'),
                name: 'RolePermission',
                meta: {
                    title: '角色权限',
                    icon: 'lock',
                    // roles: ['admin', 'editor'] // 或者只能在子导航中设置角色
                    roles: ['admin']
                }
            }
        ]
    },

    {
        path: '/nested',
        component: Layout,
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
            title: '路由嵌套',
            icon: 'nested'
        },
        children: [
            {
                path: 'menu1',
                component: () => import('@/views/nested/menu1/index'), // Parent router-view
                name: 'Menu1',
                meta: {title: '菜单1'},
                children: [
                    {
                        path: 'menu1-1',
                        component: () => import('@/views/nested/menu1/menu1-1'),
                        name: 'Menu1-1',
                        meta: {
                            title: '菜单1-1',
                            noCache: true,///如果设置为true，则不会被 <keep-alive> 缓存(默认 false)--- 如果为true时，点击路由会重新渲染
                        }
                    },
                    {
                        path: 'menu1-2',
                        component: () => import('@/views/nested/menu1/menu1-2'),
                        name: 'Menu1-2',
                        meta: {title: '菜单1-2'},
                        children: [
                            {
                                path: 'menu1-2-1',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                                name: 'Menu1-2-1',
                                meta: {
                                    title: '菜单1-2-1',
                                    noCache: true,///如果设置为true，则不会被 <keep-alive> 缓存(默认 false)--- 如果为true时，点击路由会重新渲染
                                }
                            },
                            {
                                path: 'menu1-2-2',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                                name: 'Menu1-2-2',
                                meta: {
                                    title: '菜单1-2-2',
                                    noCache: true,///如果设置为true，则不会被 <keep-alive> 缓存(默认 false)--- 如果为true时，点击路由会重新渲染
                                }
                            }
                        ]
                    },
                    {
                        path: 'menu1-3',
                        component: () => import('@/views/nested/menu1/menu1-3'),
                        name: 'Menu1-3',
                        meta: {
                            title: '菜单1-3',
                            noCache: true,///如果设置为true，则不会被 <keep-alive> 缓存(默认 false)--- 如果为true时，点击路由会重新渲染
                        }
                    }
                ]
            },
            {
                path: 'menu2',
                component: () => import('@/views/nested/menu2/index'),
                meta: {
                    title: '菜单2',
                    noCache: true,///如果设置为true，则不会被 <keep-alive> 缓存(默认 false)--- 如果为true时，点击路由会重新渲染
                }
            }
        ]
    },

    // 404 page must be placed at the end !!!
    {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
