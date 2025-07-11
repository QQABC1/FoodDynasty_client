<!-- src/views/TablesPage.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tables = ref([])
const loading = ref(true)
const error = ref(null)
const userId = ref(1) // 实际项目中应从登录状态获取用户ID

// 从后端获取餐桌数据
const fetchTables = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:8080/api/tables')
    tables.value = response.data.map(table => ({
      id: table.tableId,
      number: table.number,
      capacity: table.capacity,
      area: table.area,
      type: table.type,
      available: table.free
    }))
    error.value = null
  } catch (err) {
    console.error('获取餐桌数据失败:', err)
    error.value = '加载餐桌数据失败，请稍后再试'
    tables.value = [
      { id: 19, number: "A01", capacity: 4, area: "A区", type: "方桌", available: true },
      { id: 20, number: "A02", capacity: 6, area: "A区", type: "圆桌", available: false },
      { id: 21, number: "B01", capacity: 2, area: "B区", type: "小桌", available: true },
      { id: 22, number: "B02", capacity: 8, area: "B区", type: "大圆桌", available: true },
      { id: 23, number: "C01", capacity: 4, area: "C区", type: "方桌", available: false },
      { id: 24, number: "C02", capacity: 6, area: "C区", type: "圆桌", available: true }
    ]
  } finally {
    loading.value = false
  }
}

// 选择餐桌方法
const selectTable = async (table) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/tables/${table.id}/select?userId=${userId.value}`
    )
    alert(`已选择餐桌 ${table.number}`)
    // 更新本地餐桌状态
    const updatedTable = tables.value.find(t => t.id === table.id)
    if (updatedTable) {
      updatedTable.available = false
    }
  } catch (err) {
    console.error('选择餐桌失败:', err)
    alert('选择餐桌失败：' + (err.response?.data || '餐桌已被占用'))
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTables()
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p class="text-gray-600">加载餐桌数据中...</p>
        </div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <p class="text-red-500 text-xl mb-6">{{ error }}</p>
        <button
          @click="fetchTables"
          class="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          重新加载
        </button>
      </div>
      
      <!-- 正常显示 -->
      <div v-else>
        <!-- 标题与说明 -->
        <h1 class="text-3xl font-bold text-center mb-4 text-gray-800">选择餐桌</h1>
        <p class="text-center text-gray-600 mb-8">绿色表示空闲餐桌，红色表示已被占用</p>

        <!-- 餐桌网格 -->
        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="table in tables" 
            :key="table.id" 
            :class="[
              'border-2 rounded-lg p-6 text-center',
              table.available ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            ]"
          >
            <!-- 桌号 -->
            <div 
              class="text-2xl font-bold mb-2" 
              :class="table.available ? 'text-green-600' : 'text-red-600'"
            >
              {{ table.number }}
            </div>

            <!-- 桌信息 -->
            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <p><span class="font-medium">容纳人数:</span> {{ table.capacity }}人</p>
              <p><span class="font-medium">区域位置:</span> {{ table.area }}</p>
              <p><span class="font-medium">桌型:</span> {{ table.type }}</p>
            </div>

            <!-- 操作按钮（条件渲染） -->
            <template v-if="table.available">
              <button 
                @click="selectTable(table)" 
                class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                选择此餐桌
              </button>
            </template>
            <template v-else>
              <div class="w-full bg-red-500 text-white py-2 rounded-lg font-semibold">已被占用</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>