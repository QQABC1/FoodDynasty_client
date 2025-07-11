<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const cartItems = ref([])
const loading = ref(true)
const error = ref(null)
const userId = ref(1) // 实际项目中应从登录状态获取用户ID




// 从后端获取购物车数据
const fetchCartItems = async () => {
  try {
    loading.value = true
    const response = await axios.get(`http://localhost:8080/api/cart/${userId.value}`)
    cartItems.value = response.data.map(item => ({
      cartItemId: item.cartItemId,
      dishId: item.dish.dishId,
      name: item.dish.name,
      price: item.dish.price,
      image: `/images/${item.dish.imageName}`,
      quantity: item.quantity,
      customization: {
        size: item.size,
        spice: item.taste,
        addition: item.addition
      }
    }))
    error.value = null
  } catch (err) {
    // ========== 调用调试函数 ==========
    logError(err, '获取购物车数据');
    console.error('获取购物车数据失败:', err)
    // ========== 原有逻辑保持不变 ==========
    error.value = '加载购物车数据失败，请稍后再试'
    cartItems.value = [
      {
        cartItemId: 1,
        dishId: 1,
        name: "宫保鸡丁",
        price: 28.0,
        image: "/placeholder.svg?height=200&width=300",
        quantity: 2,
        customization: { size: "中份", spice: "微辣" },
      },
      {
        cartItemId: 2,
        dishId: 2,
        name: "秘制红烧排骨面",
        price: 68.0,
        image: "/placeholder.svg?height=200&width=300",
        quantity: 1,
        customization: null,
      },
    ]
  } finally {
    loading.value = false
  }
}

/// 更新数量 - 修复版 (增强删除功能)
const updateQuantity = async (cartItemId, newQuantity) => {
  try {
    const userIdStr = String(userId.value);
    const cartItemIdStr = String(cartItemId);
    
    if (newQuantity <= 0) {
      await axios.delete(`http://localhost:8080/api/cart/${userIdStr}/delete/${cartItemIdStr}`)
      cartItems.value = cartItems.value.filter(item => item.cartItemId !== cartItemId)
      const deletedItem = cartItems.value.find(item => item.cartItemId === cartItemId);
      if (deletedItem) {
        alert(`已从购物车中移除: ${deletedItem.name}`);
      }
    } else {
      const response = await axios.put(
        `http://localhost:8080/api/cart/${userIdStr}/update/${cartItemIdStr}?newQuantity=${newQuantity}`
      )
      const index = cartItems.value.findIndex(item => item.cartItemId === cartItemId)
      if (index !== -1) {
        cartItems.value[index].quantity = newQuantity;
      }
    }
  } catch (err) {
    // ========== 调用调试函数 ==========
    logError(err, '更新购物车（数量调整/删除）');
    console.error('更新购物车失败:', err)
    // ========== 原有逻辑保持不变 ==========
    let errorMessage = '更新购物车失败，请稍后再试';
    if (err.response?.data) {
      if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
      } else {
        errorMessage = err.response.data.message || JSON.stringify(err.response.data);
      }
    } else if (err.message) {
      errorMessage = err.message;
    }
    alert(errorMessage)
    fetchCartItems()
  }
}

// 清空购物车
const clearCart = async () => {
  try {
    await axios.delete(`http://localhost:8080/api/cart/${userId.value}/clear`)
    cartItems.value = []
    alert('购物车已清空')
  } catch (err) {
    // ========== 调用调试函数 ==========
    console.error('清空购物车失败:', err)
    // ========== 原有逻辑保持不变 ==========
    alert('清空购物车失败：' + (err.response?.data?.message || '操作失败'))
  }
}

const checkout = async () => {
  try {
    if (cartItems.value.length === 0) {
      alert('购物车为空')
      return
    }
    
    const orderRequest = {
      items: cartItems.value.map(item => ({
        dishId: item.dishId,
        quantity: item.quantity,
        taste: item.customization?.spice || "标准",
        size: item.customization?.size || "标准",
        addition: item.customization?.addition || null
      }))
    }
    
    const response = await axios.post(
      `http://localhost:8080/api/cart/${userId.value}/checkout`,
      orderRequest
    )
    
    if (response.data && response.data.success) {
      alert('订单提交成功')
      
      // 1. 清空本地购物车数据
      cartItems.value = []
      
      // 2. 清空本地存储的购物车（如果需要）
      localStorage.removeItem('cartItems')
      
      // 3. 跳转到订单页面
      router.push('/orders')
    } else {
      throw new Error(response.data?.message || '结算失败')
    }
  } catch (err) {
    console.error('结算失败:', err)
    
    let errorMessage = '结算失败：'
    if (err.response?.data) {
      const msg = err.response.data.message
      if (msg && typeof msg === 'string' && msg.includes("库存不足")) {
        errorMessage += "部分菜品库存不足，请调整数量后重试"
      } else if (msg) {
        errorMessage += msg
      } else {
        errorMessage += JSON.stringify(err.response.data)
      }
    } else if (err.message) {
      errorMessage += err.message
    } else {
      errorMessage += '未知错误'
    }
    
    alert(errorMessage)
    
    // 重新获取购物车数据，同步服务器状态
    fetchCartItems()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCartItems()
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- 顶部标题 + 清空按钮 -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">购物车</h1>
        <button 
          @click="clearCart" 
          class="text-red-500 hover:text-red-600 font-medium"
          :disabled="cartItems.length === 0"
        >
          清空购物车
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p class="text-gray-600">加载购物车中...</p>
        </div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <p class="text-red-500 text-xl mb-6">{{ error }}</p>
        <button
          @click="fetchCartItems"
          class="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          重新加载
        </button>
      </div>

      <!-- 空购物车提示 -->
      <div 
        v-else-if="cartItems.length === 0" 
        class="text-center py-16"
      >
        <ShoppingCart class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 text-lg">购物车为空</p>
        <button
          @click="router.push('/menu')"
          class="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          去选购
        </button>
      </div>

      <!-- 购物车列表 -->
      <div 
        v-else 
        class="space-y-4"
      >
        <!-- 商品项循环 -->
        <div 
          v-for="(item, index) in cartItems" 
          :key="`${item.cartItemId}-${index}`" 
          class="bg-white rounded-lg shadow-md p-6"
        >
          <div class="flex items-center justify-between">
            <!-- 商品图片 + 信息 -->
            <div class="flex items-center space-x-4">
              <img
                :src="item.image" 
                :alt="item.name" 
                class="w-16 h-16 object-cover rounded-lg"
              />
              <div>
                <h3 class="font-semibold text-lg">{{ item.name }}</h3>
                <p class="text-gray-600">单价: ¥{{ item.price.toFixed(2) }}</p>
                <!-- 自定义项 -->
                <p v-if="item.customization" class="text-sm text-gray-500">
                  {{ item.customization.size }} | {{ item.customization.spice }}
                  <span v-if="item.customization.addition"> | {{ item.customization.addition }}</span>
                </p>
              </div>
            </div>

            <!-- 数量控制 + 小计 -->
            <div class="flex items-center space-x-4">
              <!-- 数量增减 -->
              <div class="flex items-center space-x-2">
                <button
                  @click="updateQuantity(item.cartItemId, item.quantity - 1)"
                  class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                  :disabled="item.quantity <= 1"
                >
                  <Minus class="w-4 h-4" />
                </button>
                <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>
                <button
                  @click="updateQuantity(item.cartItemId, item.quantity + 1)"
                  class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
                <!-- 添加删除按钮 -->
              <button
                  @click="updateQuantity(item.cartItemId, 0)"
                  class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600"
                  title="删除商品"
                >
                  <Trash2 class="w-4 h-4" /> <!-- 需要导入Trash2图标 -->
              </button>
              <!-- 小计金额 -->
              <div class="text-right">
                <p class="font-semibold text-lg">¥{{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 总计 + 结算 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center text-xl font-bold">
            <span>总计:</span>
            <span class="text-orange-500">
              ¥{{ cartItems.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2) }}
            </span>
          </div>
          <button
            @click="checkout"
            class="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
          >
            结算
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>