<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4">
    <!-- 注册表单 -->
    <div class="card bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" :class="{ 'hidden': registrationSuccess }">
      <!-- 顶部标题区域 -->
      <div class="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-center">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-user-plus text-orange-500 text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-white">用户注册</h2>
      </div>
      
      <!-- 表单区域 -->
      <div class="p-8">
        <!-- 错误消息展示 -->
        <div v-if="errorMessage" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm error-message flex items-start">
          <i class="fas fa-exclamation-circle mt-1 mr-2 text-red-500"></i>
          <div>{{ errorMessage }}</div>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- 姓名输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <input
              v-model="form.name"
              :class="{'input-error': errors.name}"
              type="text"
              required
              placeholder="请输入3-20位用户名"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
            <div v-if="errors.name" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i> {{ errors.name }}
            </div>
          </div>
          
          <!-- 电话号码输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">电话号码</label>
            <input
              v-model="form.phone"
              :class="{'input-error': errors.phone}"
              type="tel"
              required
              placeholder="请输入11位手机号"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
            <div v-if="errors.phone" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i> {{ errors.phone }}
            </div>
          </div>
          
          <!-- 密码输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">密码</label>
            <input
              v-model="form.password"
              :class="{'input-error': errors.password}"
              type="password"
              required
              placeholder="请输入6位密码"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
            <div v-if="errors.password" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i> {{ errors.password }}
            </div>
          </div>
          
          <!-- 确认密码输入 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">确认密码</label>
            <input
              v-model="form.confirmPassword"
              :class="{'input-error': errors.confirmPassword}"
              type="password"
              required
              placeholder="请再次输入密码"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
            <div v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1 flex items-center">
              <i class="fas fa-exclamation-circle mr-1"></i> {{ errors.confirmPassword }}
            </div>
          </div>
          
          <!-- 注册按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-500 hover:to-orange-700 transition-all flex justify-center items-center disabled:opacity-70"
          >
            <span v-if="!loading">注册</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理中...
            </span>
          </button>
        </form>
        
        <p class="text-center mt-6 text-gray-600">
          已有账户？
          <button
            @click="goToLogin"
            class="text-orange-500 hover:text-orange-600 font-semibold ml-1"
          >
            立即登录
          </button>
        </p>
      </div>
    </div>
    
    <!-- 成功注册后的显示 -->
    <div class="card bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" :class="{ 'hidden': !registrationSuccess }">
      <div class="bg-gradient-to-r from-green-400 to-green-600 p-6 text-center">
        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check-circle text-green-500 text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-white">注册成功！</h2>
      </div>
      
      <div class="p-8 text-center">
        <div class="success-check w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-check text-green-500 text-2xl"></i>
        </div>
        <p class="text-gray-700 mb-6">您的账户已成功创建，现在可以登录了</p>
        <button 
          @click="goToLogin"
          class="w-full bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-700 transition-all"
        >
          前往登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
// 表单数据
const form = ref({
  name: '',
  phone: '',
  password: '',
  confirmPassword: ''
});

const router = useRouter()
// 错误信息
const errors = ref({});
const errorMessage = ref('');

// 状态控制
const loading = ref(false);
const registrationSuccess = ref(false);

// 表单验证
const validateForm = () => {
  const newErrors = {};
  
  // 验证姓名
  if (!form.value.name.trim()) {
    newErrors.name = '请输入姓名';
  } else if (form.value.name.length < 3 || form.value.name.length > 20) {
    newErrors.name = '姓名长度必须在3-20位之间';
  }
  
  // 验证手机号
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!form.value.phone) {
    newErrors.phone = '请输入手机号';
  } else if (!phoneReg.test(form.value.phone)) {
    newErrors.phone = '请输入有效的11位手机号';
  }
  
  // 验证密码
  if (!form.value.password) {
    newErrors.password = '请输入密码';
  } else if (form.value.password.length < 6) {
    newErrors.password = '密码长度不能少于6位';
  }
  
  // 验证确认密码
  if (!form.value.confirmPassword) {
    newErrors.confirmPassword = '请再次输入密码';
  } else if (form.value.confirmPassword !== form.value.password) {
    newErrors.confirmPassword = '两次输入的密码不一致';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

// 处理注册
const handleRegister = async () => {
  // 清除之前的错误
  errorMessage.value = '';
  
  // 表单验证
  if (!validateForm()) {
    // 给表单添加抖动动画
    const card = document.querySelector('.card:not(.hidden)');
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 500);
    return;
  }
  
  try {
    loading.value = true;
    
    // 发送注册请求
    const response = await axios.post('http://localhost:8080/api/user/register', {
      name: form.value.name,
      phone: form.value.phone,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword
    });
    
    // 注册成功
    if (response.data.success) {
      registrationSuccess.value = true;
    } else {
      errorMessage.value = response.data.message || '注册失败，请稍后再试';
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || '网络错误，请检查网络连接';
  } finally {
    loading.value = false;
  }
  
};
 const goToLogin = () => {
  // 跳转到登录页（路径根据你的路由配置调整，这里假设 '/' 对应登录页）
  router.push('/login'); 
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #4f46e5);
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  transition: all 0.3s ease;
  transform: translateY(0);
  opacity: 1;
}

.card.hidden {
  transform: translateY(20px);
  opacity: 0;
  pointer-events: none;
}

.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.input-error {
  border-color: #ef4444 !important;
}

.error-message {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-check {
  animation: check 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

@keyframes check {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
</style>