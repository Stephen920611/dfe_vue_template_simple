/**
 * @description
 * @Version Created by Qina on 2020/3/18.
 * @Author Qina
 * @license dongfangdianzi
 */

import Vue from 'vue'
import 'classlist-polyfill'
import PerfectScrollbar from 'perfect-scrollbar'
import 'perfect-scrollbar/css/perfect-scrollbar.css'

const el_scrollBar = (el) => {
    if (el._ps_ instanceof PerfectScrollbar) {
        el._ps_.update()
    } else {
        el._ps_ = new PerfectScrollbar(el, {suppressScrollX: true})
    }
};

Vue.directive('scrollBar', {
    inserted(el, binding, vnode) {
        const rules = ['fixed', 'absolute', 'relative'];
        let position = window.getComputedStyle(el).position;
        if (
            position != 'fixed' &&
            position != 'absolute' &&
            position != 'relative'
        ) {
            console.error(
                `scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`
            )
        }
        el_scrollBar(el)
    },

    componentUpdated(el, binding, vnode, oldVnode) {
        let content = document.getElementById('app-content');
        content.scrollTop = 0;
        try {
            vnode.context.$nextTick(() => {
                el_scrollBar(el)
            })
        } catch (error) {
            console.error(error);
            el_scrollBar(el)
        }
    }
});