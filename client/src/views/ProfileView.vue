<template>
    <div class="bg-gray-50 min-h-screen py-8">
      <div class="max-w-2xl mx-auto px-4">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">个人中心</h1>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <!-- User Info -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon class="w-10 h-10 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-800">{{ customer.name }}</h2>
            <p class="text-gray-600">用户ID: {{ customer.id }}</p>
          </div>

          <!-- User Details -->
          <div class="space-y-6">
            <div class="flex justify-between items-center py-4 border-b">
              <span class="font-medium text-gray-700">电话号码</span>
              <span class="text-gray-600">{{ customer.phone }}</span>
            </div>

            <div class="flex justify-between items-center py-4 border-b">
              <span class="font-medium text-gray-700">账户余额</span>
              <span class="text-2xl font-bold text-orange-500">¥{{ customer.balance.toFixed(2) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="grid md:grid-cols-3 gap-4 pt-6">
              <button
                @click="showRecharge = true"
                class="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                充值
              </button>
              <button class="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors">
                修改密码
              </button>
              <button class="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors">
                编辑资料
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recharge Modal -->
      <div v-if="showRecharge" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h3 class="text-xl font-bold mb-4">账户充值</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">充值金额</label>
              <input
                v-model="rechargeAmount"
                type="number"
                min="1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div class="flex space-x-4">
              <button
                @click="recharge"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                确认充值
              </button>
              <button
                @click="showRecharge = false"
                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const userId = ref(1)
const customer = ref({
  id: '',
  name: '',
  phone: '',
  balance: 0
})

// 状态管理
const showRecharge = ref(false)
const rechargeAmount = ref('')
const isLoading = ref(true)
const errorMessage = ref('')

// 获取用户数据
const fetchUserData = async () => {
  try {
    isLoading.value = true
    const response = await axios.get(`http://localhost:8080/api/user/${userId.value}`)
    
    // 修改：直接使用返回的数据结构（无success字段）
    if (response.data.userId) {
      customer.value = {
        id: response.data.userId,
        name: response.data.name,
        phone: response.data.phone,
        balance: response.data.money
      }
    } else {
      errorMessage.value = response.data?.message || '获取用户信息失败'
    }
  } catch (error) {
    handleApiError(error, '获取用户信息失败')
  } finally {
    isLoading.value = false
  }
}

// 统一的错误处理函数
const handleApiError = (error, defaultMessage) => {
  if (error.response) {
    if (error.response.status === 404) {
      errorMessage.value = '用户不存在'
    } else if (error.response.status === 400) {
      errorMessage.value = error.response.data?.message || '请求参数错误'
    } else {
      errorMessage.value = error.response.data?.message || `服务器错误: ${error.response.status}`
    }
  } else {
    errorMessage.value = defaultMessage + ': ' + error.message
  }
}

// 充值功能
const recharge = async () => {
  if (!rechargeAmount.value || parseFloat(rechargeAmount.value) <= 0) {
    errorMessage.value = '请输入有效的充值金额'
    return
  }
  
  try {
    const response = await axios.post(
      `http://localhost:8080/api/user/${userId.value}/recharge`,
      { amount: parseFloat(rechargeAmount.value) }
    )
    
    // 直接使用响应中的新余额更新界面
    if (response.data.success) {
      customer.value.balance = response.data.newBalance
      alert(`充值成功！当前余额：¥${response.data.newBalance.toFixed(2)}`)
      showRecharge.value = false
      rechargeAmount.value = ''
      errorMessage.value = '' // 清除错误信息
    } else {
      errorMessage.value = response.data.message || '充值失败'
    }
  } catch (error) {
    // 统一处理错误信息
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message || '充值请求失败'
    } else {
      errorMessage.value = '网络错误: ' + error.message
    }
  }
}
// 组件挂载时获取用户数据
onMounted(() => {
  fetchUserData()
})
</script>
  