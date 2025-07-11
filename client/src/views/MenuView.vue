<!-- src/views/MenuPage.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 状态管理
const menuItems = ref([])
const dishTypes = ref([]) // 存储分类映射关系
const loading = ref(true)
const error = ref(null)
const selectedCategory = ref('全部') // 默认选中"全部"分类
const categories = ref(['全部']) // 动态分类列表，初始包含"全部"

const router = useRouter()

// 动态获取菜单数据
onMounted(async () => {
  try {
    loading.value = true
    
    // 1. 先获取分类数据
    const typesRes = await axios.get('http://localhost:8080/api/dishtypes')
    dishTypes.value = typesRes.data
    
    // 2. 创建分类映射对象 {typeId: name}
    const typeMap = {}
    dishTypes.value.forEach(type => {
      typeMap[type.typeId] = type.name
    })
    
    // 3. 更新分类列表
    categories.value = ['全部', ...dishTypes.value.map(type => type.name)]
    
    // 4. 获取菜单数据
    const menuRes = await axios.get('http://localhost:8080/api/menu')
    
    // 5. 为每个菜品添加分类名称
    menuItems.value = menuRes.data.map(item => ({
      ...item,
      categoryName: typeMap[item.typeId] // 添加分类名称字段
    }))
    
    error.value = null
  } catch (err) {
    console.error('获取菜单数据失败:', err)
    error.value = '加载菜单失败，请稍后再试'
    // 错误时使用备用数据
    menuItems.value = [
      {
        id: 1,
        name: "宫保鸡丁",
        description: "经典川菜，鸡肉嫩滑，花生香脆",
        price: 28.0,
        typeId: 1,
        categoryName: "热菜",
        image: "/placeholder.svg?height=200&width=300"
      }
    ]
    categories.value = ["全部", "热菜", "凉菜", "汤类", "饮品"]
  } finally {
    loading.value = false
  }
})

// 过滤菜单
const filteredMenuItems = computed(() => {
  return selectedCategory.value === '全部' 
    ? menuItems.value 
    : menuItems.value.filter(item => item.categoryName === selectedCategory.value)
})

// 查看详情逻辑
  const viewDishDetail = (dish) => {
  router.push(`/dish-detail/${dish.dishId}`)
}
</script>

<template>
  <!-- 加载状态 -->
  <div v-if="loading" class="bg-gray-50 min-h-screen py-8 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
      <p class="text-gray-600">加载菜单中...</p>
    </div>
  </div>

  <!-- 错误状态 -->
  <div v-else-if="error" class="bg-gray-50 min-h-screen py-8 flex items-center justify-center">
    <div class="text-center">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button
        @click="onMounted"
        class="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
      >
        重试
      </button>
    </div>
  </div>

  <!-- 正常显示 -->
  <div v-else class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- 标题 -->
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">精选菜单</h1>

      <!-- 分类标签栏 -->
      <div class="flex justify-center mb-8">
        <div class="bg-white rounded-lg shadow-md p-2 flex space-x-2">
          <button 
            v-for="category in categories" 
            :key="category" 
            @click="selectedCategory = category"
            :class="`px-6 py-2 rounded-md font-medium transition-all ${
              selectedCategory === category ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
            }`"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 菜单列表 -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="item in filteredMenuItems" 
          :key="item.id" 
          class="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg overflow-hidden text-white"
        >
          <!-- 菜品图片 -->
          <img 
            :src="`/images/${item.imageName}` || '/placeholder.svg?height=200&width=300'" 
            :alt="item.name" 
            class="w-full h-48 object-cover" 
          />
          <!-- 菜品信息 -->
          <div class="p-6">
            <h3 class="text-xl font-bold mb-2">{{ item.name }}</h3>
            <p class="text-orange-100 mb-4 text-sm">{{ item.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-2xl font-bold">¥{{ item.price.toFixed(2) }}</span>
              <button 
                @click="viewDishDetail(item)"
                class="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 保持原有样式不变 */
</style>