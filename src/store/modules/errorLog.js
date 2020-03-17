const state = {
    logs: [{
        err: {
            message: '错误日志',
            stack:'stack stack stack'
        },
        url: 'url-url-url',
        info:"info-info-info",
    },{
        err: {
            message: '错误日志'
        },
        url: 'url-url-url',
        info:"info-info-info",
    }]
}

const mutations = {
    ADD_ERROR_LOG: (state, log) => {
        state.logs.push(log)
    },
    CLEAR_ERROR_LOG: (state) => {
        state.logs.splice(0)
    }
}

const actions = {
    addErrorLog({commit}, log) {
        commit('ADD_ERROR_LOG', log)
    },
    clearErrorLog({commit}) {
        commit('CLEAR_ERROR_LOG')
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
