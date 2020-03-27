import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'

// 创建一个axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // 跨域请求时发送cookies，send cookies when cross-domain requests
    timeout: 5000 // 请求超时，request timeout
})

// request 请求拦截器
service.interceptors.request.use(
    config => {
        // 在发送请求之前做一些事情，do something before request is sent

        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor 响应拦截器
service.interceptors.response.use(
    /**
     * 如果要获取http信息（例如headers或status）
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     * 通过自定义代码确定请求状态
     * 下面是个例子
     * 您还可以通过HTTP状态代码来判断状态
     */
    response => {
        const res = response.data
        // 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 20000) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: （非法taken）Illegal token; 50012: （其他客户端登录了）Other clients logged in; 50014: (Token过期)Token expired;
            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
