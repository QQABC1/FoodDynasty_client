<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
    <!-- 英雄区块 -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- 左侧内容 -->
        <div class="space-y-8">
          <!-- Badge 替换为 span -->
          <span class="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm font-medium">
            ✨ 传承经典美味
          </span>
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            品味百种风味
            <span class="block text-orange-600">汇聚一堂</span>
          </h1>
          <p class="text-xl text-gray-600 leading-relaxed max-w-lg">
            在食朝王朝，我们将烹饪艺术与精致用餐完美融合。每一道菜品都是感官的盛宴，
            每一次用餐都是优雅的体验。这里是味蕾的圣殿，精致用餐的典范。
          </p>

          <!-- 按钮组：替换为原生 button -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              立即预订
            </button>
            <button
              class="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-transparent"
            >
              浏览菜单
            </button>
          </div>

          <!-- 数据统计 -->
          <div class="flex gap-8 pt-8">
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">60+</div>
              <div class="text-sm text-gray-600">年传承经验</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">15</div>
              <div class="text-sm text-gray-600">位名厨大师</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">1000+</div>
              <div class="text-sm text-gray-600">满意顾客</div>
            </div>
          </div>
        </div>

        <!-- 右侧图片 + 浮动卡片 -->
        <div class="relative">
          <!-- 占位图：改用在线服务 -->
          <div class="relative overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="https://via.placeholder.com/600x500"
              alt="食朝王朝餐厅内景"
              class="w-full h-[600px] object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <!-- 浮动卡片：替换为 div + 样式 -->
          <div class="absolute -left-6 top-20 p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-md">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Star class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900">4.9/5</div>
                <div class="text-sm text-gray-600">顾客评分</div>
              </div>
            </div>
          </div>

          <div class="absolute -right-6 bottom-20 p-4 bg-white/95 backdrop-blur-sm shadow-xl border-0 rounded-md">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Award class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900">米其林推荐</div>
                <div class="text-sm text-gray-600">2024年度</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们区块 -->
    <section class="container mx-auto px-4 py-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- 左侧图片网格 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-4">
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="https://via.placeholder.com/250x250"
                alt="餐厅优雅内景"
                class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="https://via.placeholder.com/200x250"
                alt="精美菜品"
                class="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          <div class="space-y-4 pt-8">
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="https://via.placeholder.com/200x250"
                alt="温馨用餐场景"
                class="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="overflow-hidden rounded-2xl shadow-lg">
              <img
                src="https://via.placeholder.com/250x250"
                alt="餐厅设计细节"
                class="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="space-y-8">
          <!-- Badge 替换为 span -->
          <span class="bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2 text-sm font-medium">
            🏮 关于我们
          </span>
          <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            欢迎来到
            <span class="block text-orange-600">食朝王朝</span>
          </h2>
          <p class="text-lg text-gray-600 leading-relaxed">
            食朝王朝秉承卓越品质的承诺，将传统烹饪工艺与现代创新完美结合。
            我们的每一位大厨都拥有数十年的丰富经验，致力于为您呈现最地道、 最精致的美食体验。
          </p>

          <!-- 数据卡片：替换为 div + 渐变样式 -->
          <div class="grid grid-cols-2 gap-6">
            <div class="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 rounded-md">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center">
                  <Clock class="w-7 h-7 text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-orange-600">60年</div>
                  <div class="text-gray-600 font-medium">传承经验</div>
                </div>
              </div>
            </div>

            <div class="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 rounded-md">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center">
                  <Users class="w-7 h-7 text-white" />
                </div>
                <div>
                  <div class="text-2xl font-bold text-orange-600">15位</div>
                  <div class="text-gray-600 font-medium">名厨大师</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 按钮：替换为原生 button -->
          <button
            class="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            了解更多
          </button>
        </div>
      </div>
    </section>

    <!-- 特色服务区块 -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- 卡片：替换为 div + 样式 -->
        <div class="p-8 text-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-md">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">精致美食</h3>
          <p class="text-gray-600">每一道菜品都经过精心调制，选用最优质的食材，呈现完美的味觉体验</p>
        </div>

        <div class="p-8 text-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-md">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">优质服务</h3>
          <p class="text-gray-600">专业的服务团队为您提供贴心周到的用餐服务，让每一次体验都难忘</p>
        </div>

        <div class="p-8 text-center bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-md">
          <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award class="w-8 h-8 text-orange-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4">优雅环境</h3>
          <p class="text-gray-600">精心设计的用餐环境，营造温馨优雅的氛围，是商务宴请的理想选择</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 导入 Lucide 图标（需先安装：npm install lucide-vue-next）
import { Star, Users, Award, Clock } from 'lucide-vue-next'
</script>

<style scoped>
/* 若需局部样式，可在此补充（Tailwind 已覆盖大部分样式） */
</style>