<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-6xl mx-auto px-4">
      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">我的订单</h1>

      <!-- 订单选项卡 -->
      <div class="flex justify-center mb-8">
        <div class="bg-white rounded-lg shadow-md p-2 flex space-x-2">
          <button
            v-for="tab in orderTabs"
            :key="tab.value"
            @click="selectedOrderTab = tab.value"
            :class="`px-6 py-2 rounded-md font-medium transition-all ${
              selectedOrderTab === tab.value ? 'bg-orange-500 text-white' : 'text-gray-600 hover:text-orange-500'
            }`"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-16 bg-white rounded-lg shadow-md">
        <p class="text-gray-500">加载中...</p>
      </div>

      <!-- 订单列表 -->
      <div v-else-if="filteredOrders.length > 0" class="space-y-6">
        <div 
          v-for="order in filteredOrders" 
          :key="order.orderId" 
          class="bg-white rounded-lg shadow-md p-6"  
        >
          <!-- 订单头部信息 -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-semibold text-lg">订单号: {{ generateOrderNumber(order.orderId) }}</h3>
              <p class="text-gray-600">下单时间: {{ formatDateTime(order.orderTime) }}</p>
            </div>
            <span 
              :class="`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusClass(order.status)}`"
            >
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <!-- 菜品列表 -->
          <div class="border-t pt-4">
            <h4 class="font-medium mb-3">菜品列表:</h4>
            <div class="space-y-2">
              <div 
                v-for="item in order.items" 
                :key="item.itemId" 
                class="flex justify-between text-sm"  
              >
                <span>
                  {{ item.dishName || `菜品${item.dishId || '未知'}` }} × {{ item.quantity || 1 }}
                  <span v-if="item.taste || item.size" class="text-gray-500 text-xs ml-2">
                    ({{ item.taste || '标准' }}, {{ item.size || '标准' }})
                  </span>
                  <span v-if="item.addition" class="text-gray-500 text-xs ml-2">
                    [{{ item.addition }}]
                  </span>
                </span>
                <span>¥{{ ((item.price || 0) * (item.quantity || 0)).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- 订单底部操作区 -->
          <div class="border-t pt-4 flex justify-between items-center">
            <div class="text-lg font-bold">
              总计: <span class="text-orange-500">¥{{ (order.totalAmount || 0).toFixed(2) }}</span>
            </div>
            <div>
              <!-- 待出餐状态显示"确认出餐"按钮 -->
              <button
                v-if="order.status === 'PENDING'"
                @click="confirmServe(order.orderId)"
                class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                确认出餐
              </button>
              
              <!-- 待支付状态显示"立即支付"按钮 -->
              <button
                v-if="order.status === 'PAID'"
                @click="confirmPayment(order.orderId)"
                class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                立即支付
              </button>
              
              <!-- 已完成状态显示禁用按钮 -->
              <button
                v-if="order.status === 'COMPLETED'"
                disabled
                class="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
              >
                已完成
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="!loading && filteredOrders.length === 0" class="text-center py-16 bg-white rounded-lg shadow-md">
        <p class="text-gray-500">暂无{{ getTabText(selectedOrderTab) }}订单</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080'
})

// 用户ID（实际项目中应从登录信息中获取）
const userId = ref(1) // 假设当前用户ID为1
const orders = ref([]) // 初始化为空数组
const loading = ref(true)
const error = ref(null) // 添加错误状态

// 订单选项卡 - 使用对象存储值和标签
const orderTabs = [
  { value: 'ALL', label: '全部订单' },
  { value: 'PENDING', label: '待出餐' },
  { value: 'PAID', label: '待支付' },
  { value: 'COMPLETED', label: '已完成' }
]
const selectedOrderTab = ref('ALL')

// 筛选订单 - 确保始终返回数组
const filteredOrders = computed(() => {
  if (!Array.isArray(orders.value)) return []
  
  if (selectedOrderTab.value === 'ALL') {
    return orders.value
  }
  
  return orders.value.filter(order => order.status === selectedOrderTab.value)
})

// 订单状态样式映射 - 基于英文状态
const getOrderStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-blue-100 text-blue-800" // 待出餐
    case "PAID":
      return "bg-yellow-100 text-yellow-800" // 待支付
    case "COMPLETED":
      return "bg-green-100 text-green-800" // 已完成
    default:
      return "bg-gray-100 text-gray-800" // 默认样式
  }
}

// 获取状态文本
const getStatusText = (status) => {
  switch (status) {
    case "PENDING": return "待出餐"
    case "PAID": return "待支付"
    case "COMPLETED": return "已完成"
    default: return status
  }
}

// 获取选项卡文本
const getTabText = (tabValue) => {
  const tab = orderTabs.find(t => t.value === tabValue)
  return tab ? tab.label : ''
}

// 格式化日期时间 - 添加空值处理
const formatDateTime = (dateTime) => {
  if (!dateTime) return '未知时间'
  
  try {
    const date = new Date(dateTime)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/\//g, '-')
  } catch {
    return '无效时间'
  }
}

// 生成订单号 - 添加空值处理
const generateOrderNumber = (orderId) => {
  if (!orderId) return 'FD00000000'
  return `FD${orderId.toString().padStart(8, '0')}`
}

// 获取用户所有订单
const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 获取订单列表
    const response = await api.get(`/api/orders/user/${userId.value}`)
    
    // 确保响应数据是数组
    if (!Array.isArray(response.data)) {
      throw new Error('API返回的数据格式不正确')
    }
    
    orders.value = response.data
    
    // 后端已经返回了订单项，不需要再单独获取
    // 确保每个订单都有items数组
    orders.value.forEach(order => {
      if (!order.items) {
        order.items = []
      }
    })
    
  } catch (err) {
    console.error('获取订单失败:', err)
    error.value = '加载订单失败，请稍后重试'
    orders.value = [] // 确保设置为空数组
  } finally {
    loading.value = false
  }
}

// 确认出餐（待出餐 -> 待支付）
const confirmServe = async (orderId) => {
  try {
    await api.put(`/api/orders/${orderId}/status`, "PAID", {
      headers: {
        'Content-Type': 'text/plain' // 明确指定内容类型
      }
    })
    await fetchOrders() // 刷新订单数据
    alert("确认出餐成功！订单已进入待支付状态")
  } catch (error) {
    console.error('确认出餐失败:', error)
    alert("确认出餐失败，请重试")
  }
}

// 确认支付（待支付 -> 已完成）
const confirmPayment = async (orderId) => {
  try {
    // 发送支付请求，添加userId参数
    const response = await api.put(
      `/api/orders/${orderId}/status`,
      "COMPLETED",
      {
        headers: {
          'Content-Type': 'text/plain'
        },
        params: {
          userId: userId.value // 添加用户ID参数
        }
      }
    )
    
    // 处理响应
    if (response.data.success) {
      // 如果返回了新余额，更新本地用户余额
      // if (response.data.newBalance !== undefined) {
      //   // 这里需要获取用户信息并更新余额
      //   // 实际项目中可能需要从全局状态获取用户信息
      //   // 这里假设您有更新用户余额的方法
      //   updateUserBalance(response.data.newBalance);
      // }
      
      await fetchOrders() // 刷新订单数据
      alert(`支付成功！${response.data.newBalance ? `当前余额：¥${response.data.newBalance.toFixed(2)}` : "订单已完成"}`)
    } else {
      alert(response.data.message || '支付失败')
    }
  } catch (error) {
    console.error('支付失败:', error)
    
    // 更详细的错误处理
    let errorMessage = "支付失败，请重试";
    if (error.response) {
      if (error.response.status === 400) {
        errorMessage = error.response.data?.message || "余额不足";
      } else if (error.response.status === 404) {
        errorMessage = "订单不存在";
      } else {
        errorMessage = `服务器错误: ${error.response.status}`;
      }
    }
    
    alert(errorMessage)
  }
}

// 组件挂载时获取订单数据
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
/* 保持原有样式不变 */
</style>