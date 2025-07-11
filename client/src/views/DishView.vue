<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- 返回按钮 -->
      <button
        @click="$router.push('/menu')"
        class="mb-6 flex items-center text-orange-500 hover:text-orange-600"
      >
        <ArrowLeft class="w-5 h-5 mr-2" />
        返回菜单
      </button>

      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center items-center h-96">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p class="text-gray-600">加载菜品详情中...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <p class="text-red-500 text-xl mb-6">{{ error }}</p>
        <button
          @click="fetchDishDetails"
          class="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          重新加载
        </button>
      </div>

      <!-- 菜品详情内容 -->
      <div v-else-if="selectedDish" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- 菜品主图 + 渐变遮罩 -->
        <div class="relative">
          <img
            :src="imageUrl"
            :alt="selectedDish.name"
            class="w-full h-96 object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 class="text-3xl font-bold text-white mb-2">{{ selectedDish.name }}</h1>
            <div class="flex items-center space-x-4">
              <span class="text-2xl font-bold text-orange-400">¥{{ selectedDish.price.toFixed(2) }}</span>
              <span class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">招牌菜</span>
            </div>
          </div>
        </div>

        <!-- 菜品详情内容 -->
        <div class="p-8">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- 左侧：菜品介绍 -->
            <div>
              <h2 class="text-xl font-bold mb-4 text-gray-800">菜品介绍</h2>
              <p class="text-gray-600 mb-6">{{ selectedDish.description }}</p>

              <h3 class="text-lg font-semibold mb-3 text-gray-800">菜品信息</h3>
              <div class="space-y-2 text-sm text-gray-600">
                <p>
                  <span class="font-medium">分类:</span> {{ categoryName }}
                </p>
                <p>
                  <span class="font-medium">库存:</span> {{ selectedDish.stock }} 份
                </p>
                <p>
                  <span class="font-medium">状态:</span> 
                  <span :class="selectedDish.isSell ? 'text-green-600' : 'text-red-600'">
                    {{ !selectedDish.isSell ? '在售中' : '已下架' }}
                  </span>
                </p>
              </div>
            </div>

            <!-- 右侧：定制选项 -->
            <div>
              <h2 class="text-xl font-bold mb-4 text-gray-800">定制选项</h2>

              <div class="space-y-6">
                <!-- 分量选择 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">分量选择</label>
                  <div class="flex flex-wrap gap-3">
                    <button
                      v-for="size in ['标准', '大份', '特大份']"
                      :key="size"
                      @click="dishCustomization.size = size"
                      :class="`px-4 py-2 rounded-lg font-medium transition-colors ${
                        dishCustomization.size === size 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`"
                    >
                      {{ size }}
                    </button>
                  </div>
                </div>

                <!-- 口味选择 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">口味选择</label>
                  <div class="flex flex-wrap gap-3">
                    <button
                      v-for="taste in ['标准', '少盐', '少油', '微辣', '中辣', '特辣']"
                      :key="taste"
                      @click="dishCustomization.taste = taste"
                      :class="`px-4 py-2 rounded-lg font-medium transition-colors ${
                        dishCustomization.taste === taste 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`"
                    >
                      {{ taste }}
                    </button>
                  </div>
                </div>

                <!-- 备注信息 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">备注信息</label>
                  <textarea
                    v-model="dishCustomization.addition"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="请输入特殊要求（如：不要香菜、少放糖等）"
                  />
                </div>

                <!-- 数量选择 -->
                <div class="flex items-center">
                  <label class="block text-sm font-medium text-gray-700 mr-4">数量:</label>
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      @click="decreaseQuantity"
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      :disabled="quantity <= 1"
                    >
                      -
                    </button>
                    <span class="px-4 py-2 w-12 text-center">{{ quantity }}</span>
                    <button 
                      @click="increaseQuantity"
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      :disabled="quantity >= selectedDish.stock"
                    >
                      +
                    </button>
                  </div>
                  <span class="ml-4 text-sm text-gray-500">
                    剩余 {{ selectedDish.stock }} 份
                  </span>
                </div>

                <!-- 加入购物车按钮 -->
                <button
                  @click="handleAddToCart"
                  class="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-500 hover:to-orange-700 transition-all flex items-center justify-center"
                  :disabled="addingToCart"
                >
                  <span v-if="addingToCart" class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </span>
                  <span v-else>
                    加入购物车 ¥{{ (selectedDish.price * quantity).toFixed(2) }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// 状态管理
const selectedDish = ref(null)
const dishTypes = ref([])
const loading = ref(true)
const error = ref(null)
const addingToCart = ref(false)
const quantity = ref(1)

// 定制选项
const dishCustomization = ref({
  size: "标准",
  taste: "标准",
  addition: "",
})

// 计算属性
const categoryName = computed(() => {
  if (!selectedDish.value || !dishTypes.value.length) return '未知分类'
  const category = dishTypes.value.find(t => t.typeId === selectedDish.value.typeId)
  return category ? category.name : '未知分类'
})

const imageUrl = computed(() => {
  if (!selectedDish.value) return '/placeholder.svg'
  return selectedDish.value.imageName 
    ? `/images/${selectedDish.value.imageName}` 
    : '/placeholder.svg'
})

// 从后端获取菜品详情
const fetchDishDetails = async () => {
  try {
    loading.value = true
    error.value = null
    
    // 获取菜品ID (匹配后端Controller的@GetMapping("/{id}"))
    const dishId = route.params.id
    
    // 同时获取菜品数据和分类数据
    const [dishRes, typesRes] = await Promise.all([
      // 使用 /api/menu/{id} 端点
      axios.get(`http://localhost:8080/api/menu/${dishId}`),
      axios.get('http://localhost:8080/api/dishtypes')
    ])
    
    selectedDish.value = dishRes.data
    dishTypes.value = typesRes.data
    
    // 重置数量为1
    quantity.value = 1
    
  } catch (err) {
    console.error('获取菜品详情失败:', err)
    
    if (err.response && err.response.status === 404) {
      error.value = '菜品不存在'
    } else {
      error.value = '加载菜品详情失败，请稍后再试'
    }
    
    selectedDish.value = null
  } finally {
    loading.value = false
  }
}

// 数量控制
const increaseQuantity = () => {
  if (quantity.value < selectedDish.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 加入购物车
const handleAddToCart = async () => {
  if (!selectedDish.value) return;
  if (addingToCart.value) return;

  try {
    
    addingToCart.value = true;

    // 构造查询参数（匹配后端@RequestParam）
    const params = new URLSearchParams({
      dishId: selectedDish.value.dishId,
      quantity: quantity.value,
      taste: dishCustomization.value.taste || "标准",
      size: dishCustomization.value.size || "标准"
    });

    // 添加可选参数
    if (dishCustomization.value.addition) {
      params.append('addition', dishCustomization.value.addition);
    }

    // 获取用户ID（示例中硬编码为1）
    const userId = 1;

    // 发送请求到正确端点（使用查询参数）
    const response = await axios.post(
      `http://localhost:8080/api/cart/${userId}/add?${params.toString()}`
    );

    // 成功提示
    alert('菜品已成功加入购物车！');
    router.push('/menu');
    
  } catch (err) {
    console.error('加入购物车失败:', err);
    if (err.response) {
      alert(`加入购物车失败: ${err.response.data.message || err.response.data}`);
    } else {
      alert('加入购物车失败，请稍后再试');
    }
  } finally {
    addingToCart.value = false;
  }
}

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchDishDetails()
  }
})

// 组件挂载时获取数据
onMounted(() => {
  if (route.params.id) {
    fetchDishDetails()
  } else {
    error.value = '菜品ID无效'
    loading.value = false
  }
})
</script>

<style scoped>
/* 保持原有样式 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>