<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 静态数据（替代状态管理，可按需扩展）
const userId = ref(1) 
const cartItems = ref([]) 

// 路由相关
const router = useRouter()
const route = useRoute()
const pathname = computed(() => route.path)

// 导航显示条件：排除登录/注册页
const showNavigation = computed(() => {
  return !['/login', '/register'].includes(pathname.value)
})

// 导航按钮样式逻辑
const navButtonClass = (path) => {
  return pathname.value === path 
    ? 'text-orange-400 font-semibold' 
    : 'text-white hover:text-orange-400 transition-colors'
}

// 导航跳转
const handleNavigate = (path) => {
  router.push(path)
}

// 退出登录
const logout = () => {
  router.push('/login')
}
</script>
<template>
  <!-- 仅保留导航栏，删除外层的min-h-screen和内容区域 -->
  <nav v-if="showNavigation" class="bg-black text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <h1 class="text-xl font-bold text-orange-400">Food Dynasty</h1>
          <div class="hidden md:flex space-x-6">
            <!-- 导航按钮（保持原有逻辑） -->
            <button @click="handleNavigate('/')" :class="navButtonClass('/')">主页</button>
            <button @click="handleNavigate('/menu')" :class="navButtonClass('/menu')">菜单</button>
            <button @click="handleNavigate(`/cart/${userId}`)" :class="navButtonClass('/cart')">
              购物车 
              <span v-if="cartItems.length > 0" class="bg-orange-500 text-white rounded-full px-2 py-1 text-xs ml-1">
                {{ cartItems.length }}
              </span>
            </button>
            <button @click="handleNavigate('/orders')" :class="navButtonClass('/orders')">我的订单</button>
            <button @click="handleNavigate('/profile')" :class="navButtonClass('/profile')">个人中心</button>
            <button @click="handleNavigate('/tables')" :class="navButtonClass('/tables')">选择餐桌</button>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <span class="text-sm">欢迎，{{ customerName || "游客" }}</span>
          <button @click="logout" class="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm transition-colors">
            退出登录
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>



<style scoped>
/* 仅保留导航栏样式，删除外层背景相关样式 */
.bg-black {
  background-color: black;
}
.text-white {
  color: white;
}
/* 其他导航栏样式... */
</style>