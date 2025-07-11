<!-- src/components/common/Layout.vue -->
<template>
  <div class="app-layout">
    <!-- 导航栏（对应React的Navbar） -->
    <Navbar />
        <!-- 子页面内容区域：必须有 <router-view> -->
    <main class="flex-1 p-6"> 
      <router-view /> <!-- OrderView 会在这里渲染 -->
    </main>
    <!-- 页脚（对应React的Footer） -->
    <Footer />
  </div>
</template>

<script setup>
// 导入导航栏和页脚组件
import Navbar from './Header.vue'
import Footer from './Footer.vue'
</script>

<style scoped>
.min-h-screen { min-height: 100vh; }
.flex-1 { flex: 1; } /* 确保内容区域占满空间 */
</style>