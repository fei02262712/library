import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Books from '../views/Books.vue'
import BookDetail from '../views/BookDetail.vue'  // 新增

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/books',
        name: 'Books',
        component: Books
    },
    {
        path: '/books/:id',     // :id 是动态参数
        name: 'BookDetail',
        component: BookDetail
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫：检查是否登录
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
        return
    }

    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn === 'true') {
        next()
    } else {
        next('/login')
    }
})

export default router