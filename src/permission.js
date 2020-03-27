import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar  NProgress是页面跳转是出现在浏览器顶部的进度条
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration 进度环显示隐藏

const whiteList = ['/login'] // no redirect whitelist 没有重定向的白名单

router.beforeEach(async (to, from, next) => {
    // start progress bar 开始进度条
    NProgress.start()

    // set page title 设置页面标题
    document.title = getPageTitle(to.meta.title)

    // 确定用户是否已登录
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/login') {
            // 如果已登录，请重定向到主页
            next({path: '/'})
            NProgress.done()
        } else {
            // 确定用户是否已通过getInfo获得其权限角色 determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // 获取用户信息
                    // 注意：角色必须是对象数组！ such as: ['admin'] or ,['developer','editor']
                    const {roles} = await store.dispatch('user/getInfo')

                    // 根据角色生成可访问的路由 generate accessible routes map based on roles
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

                    // 动态添加可访问的路由
                    router.addRoutes(accessRoutes)

                    //hack方法，以确保addRoutes是完整的
                    // 设置replace：true，因此导航不会留下历史记录
                    next({...to, replace: true})
                } catch (error) {
                    // 删除token并进入登录页面以重新登录
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* 没有token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            //在免登录白名单中，直接进入
            next()
        } else {
            // 无权访问的页面将重定向到登录页面。
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 完成进度条
    NProgress.done()
})
