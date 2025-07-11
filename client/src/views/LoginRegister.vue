<template>
  <div>
    <!-- 登录容器 -->
    <div class="login-container">
      <!-- 顶部标题区域 -->
      <div class="login-header">
        <i class="icon"></i>
        <h2>智慧餐厅</h2>
        <p>欢迎使用餐厅管理系统</p>
      </div>
      
      <!-- 登录类型切换标签 -->
      <div class="tab">
        <span 
          :class="{ active: loginType === 'customer' }" 
          @click="loginType = 'customer'"
        >顾客登录</span>
        <span 
          :class="{ active: loginType === 'admin' }" 
          @click="loginType = 'admin'"
        >管理员登录</span>
      </div>
      
      <!-- 登录表单 -->
      <form class="login-form" @submit.prevent="handleLogin">
        <input 
          type="text" 
          placeholder="用户名" 
          v-model="form.name" 
        >
        <input 
          type="password" 
          placeholder="密码" 
          v-model="form.password"
        >
        
        <!-- 显示错误信息 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <!-- 注册跳转 -->
      <div class="register-link">
        没有账户？<a href="#" @click.prevent="goRegister">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      loginType: 'customer', 
      form: {
        name: '',
        password: ''
      },
      errorMessage: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      if (!this.form.name || !this.form.password) {
        this.errorMessage = '用户名和密码不能为空';
        return;
      }
      
      this.loading = true;
      this.errorMessage = '';
      
      try {
        let url = this.loginType === 'customer' 
          ? 'http://localhost:8080/api/user/login'
          : 'http://localhost:8080/api/admin/login';
        
        const response = await axios.post(url, {
          name: this.form.name,
          password: this.form.password
        });

        console.log("请求URL:", url);
        console.log("响应数据:", response.data);

  
          // 跳转到首页
          this.$router.push('/');
  
      } catch (error) {
        console.error("完整错误:", error);
        
        if (error.response) {
          console.error("响应数据:", error.response.data);
          console.error("状态码:", error.response.status);
          
          // 更友好的错误提示
          if (error.response.status === 401) {
            this.errorMessage = "用户名或密码错误";
          } else if (error.response.status === 404) {
            this.errorMessage = "API地址不存在，请检查登录类型";
          } else {
            this.errorMessage = error.response.data.message || '服务器错误';
          }
        } else if (error.request) {
          this.errorMessage = "无法连接到服务器，请检查网络";
        } else {
          this.errorMessage = "请求配置错误";
        }
      } finally {
        this.loading = false;
      }
    },
    
    goRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<style scoped>
/* 保持原有的样式不变 */
.login-container {
  width: 300px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.tab {
  display: flex;
  margin-bottom: 20px;
}

.tab span {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab span.active {
  border-bottom-color: #409EFF;
  color: #409EFF;
}

.login-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.login-form button {
  width: 100%;
  padding: 10px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.login-form button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}

.error-message {
  color: #f56c6c;
  margin-bottom: 10px;
  text-align: center;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.register-link a {
  color: #409EFF;
  text-decoration: none;
}
</style>