// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/common/Layout.vue' // 新布局组件
import HomeView from '../views/HomeView.vue'
import LoginRegister from '../views/LoginRegister.vue'
import CartView from '../views/CartView.vue'
import OrderView from '../views/OrderView.vue'
import ProfileView from '../views/ProfileView.vue'
import Register from '../views/Register.vue'
import TablesView from '../views/TablesView.vue'
import MenuView from '../views/MenuView.vue'
import DishView from '../views/DishView.vue'

const routes = [
  // 🔴 第一组：无需布局（登录/注册，无导航栏）
  {
    path: '/login',
    name: 'login',
    component: LoginRegister
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },

  // 🔵 第二组：需布局（带导航栏，需登录）
  {
    path: '/', // 父路径
    component: Layout, // 应用布局（含导航+页脚）
    // meta: { requiresAuth: true }, // 该布局下的所有页面都需要登录
    children: [
      {
        path: '', // 首页（对应 / 路径）
        name: 'home',
        component: HomeView
      },
      {
        path: 'cart/:id', // 购物车（对应 /cart）
        name: 'cart',
        component: CartView
      },
      {
        path: 'orders', // 订单（对应 /orders）
        name: 'orders',
        component: OrderView
      },
      {
        path: 'profile', // 个人中心（对应 /profile）
        name: 'profile',
        component: ProfileView
      },
      {
        path: 'tables', //选择餐桌
        name: 'tables',
        component: TablesView
      },
      {
        path: 'Menu', //选择菜单
        name: 'Menu',
        component: MenuView
      },
      {
        path: 'dish-detail/:id', // 以 :id 作为动态参数后缀，接收菜品ID
        name: 'dish-detail',
        component: DishView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // 🚨 全局路由守卫：检查登录状态
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('userToken') // 从本地存储取登录态
//   // 检查当前路由或其祖先路由是否需要授权
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
//   if (requiresAuth && !isAuthenticated) {
//     next('/login') // 未登录则跳转到登录页
//   } else {
//     next() // 已登录或无需授权，正常跳转
//   }
// })

export default router