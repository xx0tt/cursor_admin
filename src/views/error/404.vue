<template>
  <!-- 404错误页面 -->
  <div class="error-page">
    <div class="error-container">
      <!-- 404图标和动画 -->
      <div class="error-animation">
        <div class="error-number">
          <span class="four">4</span>
          <span class="zero">0</span>
          <span class="four">4</span>
        </div>
        <div class="error-illustration">
          <div class="cloud cloud-1"></div>
          <div class="cloud cloud-2"></div>
          <div class="cloud cloud-3"></div>
          <div class="astronaut">
            <div class="helmet"></div>
            <div class="body"></div>
            <div class="arm arm-left"></div>
            <div class="arm arm-right"></div>
            <div class="leg leg-left"></div>
            <div class="leg leg-right"></div>
          </div>
        </div>
      </div>

      <!-- 错误信息 -->
      <div class="error-content">
        <h1 class="error-title">页面走丢了</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被移除。<br>
          请检查网址是否正确，或返回首页继续浏览。
        </p>
        
        <!-- 可能的原因 -->
        <div class="error-reasons">
          <h3 class="reasons-title">可能的原因：</h3>
          <ul class="reasons-list">
            <li>网址输入错误</li>
            <li>页面已被删除或移动</li>
            <li>您没有访问权限</li>
            <li>服务器临时故障</li>
          </ul>
        </div>

        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button
            type="primary"
            size="large"
            :icon="HomeFilled"
            @click="goHome"
          >
            返回首页
          </el-button>
          
          <el-button
            size="large"
            :icon="ArrowLeft"
            @click="goBack"
          >
            返回上页
          </el-button>
          
          <el-button
            size="large"
            :icon="Refresh"
            @click="refresh"
          >
            刷新页面
          </el-button>
        </div>

        <!-- 帮助信息 -->
        <div class="error-help">
          <p class="help-text">
            如果问题持续存在，请联系系统管理员或
            <el-button type="text" @click="reportProblem">
              报告问题
            </el-button>
          </p>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="star star-1"></div>
      <div class="star star-2"></div>
      <div class="star star-3"></div>
      <div class="star star-4"></div>
      <div class="star star-5"></div>
      <div class="star star-6"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

/**
 * 返回首页
 */
const goHome = () => {
  router.push('/dashboard')
}

/**
 * 返回上一页
 */
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

/**
 * 刷新页面
 */
const refresh = () => {
  window.location.reload()
}

/**
 * 报告问题
 */
const reportProblem = () => {
  ElMessage.info('问题报告功能开发中，请联系系统管理员')
}
</script>

<style scoped>
/* 错误页面容器 */
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.error-container {
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* 404动画区域 */
.error-animation {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.error-number {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.error-number span {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
}

.error-number .four:first-child {
  animation-delay: 0s;
}

.error-number .zero {
  animation-delay: 0.2s;
}

.error-number .four:last-child {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* 插图动画 */
.error-illustration {
  position: relative;
  width: 300px;
  height: 200px;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50px;
  animation: float 3s ease-in-out infinite;
}

.cloud-1 {
  width: 60px;
  height: 30px;
  top: 20px;
  left: 50px;
  animation-delay: 0s;
}

.cloud-2 {
  width: 80px;
  height: 40px;
  top: 10px;
  right: 40px;
  animation-delay: 1s;
}

.cloud-3 {
  width: 50px;
  height: 25px;
  top: 50px;
  left: 20px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.astronaut {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  animation: astronautFloat 4s ease-in-out infinite;
}

@keyframes astronautFloat {
  0%, 100% {
    transform: translateX(-50%) translateY(0px) rotate(-5deg);
  }
  50% {
    transform: translateX(-50%) translateY(-15px) rotate(5deg);
  }
}

.helmet {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  position: relative;
  margin: 0 auto 5px;
}

.body {
  width: 30px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 15px;
  margin: 0 auto;
  position: relative;
}

.arm {
  width: 20px;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  position: absolute;
  top: 50px;
}

.arm-left {
  left: -15px;
  transform: rotate(-30deg);
}

.arm-right {
  right: -15px;
  transform: rotate(30deg);
}

.leg {
  width: 8px;
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  position: absolute;
  top: 85px;
}

.leg-left {
  left: 8px;
}

.leg-right {
  right: 8px;
}

/* 错误内容区域 */
.error-content {
  flex: 1;
  text-align: left;
}

.error-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.error-description {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 30px 0;
}

.error-reasons {
  margin-bottom: 40px;
}

.reasons-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

.reasons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reasons-list li {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.reasons-list li::before {
  content: '•';
  color: var(--primary-color);
  font-weight: 600;
  position: absolute;
  left: 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.error-help {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.help-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.star {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: twinkle 2s infinite;
}

.star-1 {
  width: 4px;
  height: 4px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.star-2 {
  width: 6px;
  height: 6px;
  top: 30%;
  right: 20%;
  animation-delay: 0.5s;
}

.star-3 {
  width: 3px;
  height: 3px;
  top: 60%;
  left: 20%;
  animation-delay: 1s;
}

.star-4 {
  width: 5px;
  height: 5px;
  top: 70%;
  right: 10%;
  animation-delay: 1.5s;
}

.star-5 {
  width: 4px;
  height: 4px;
  top: 10%;
  left: 60%;
  animation-delay: 2s;
}

.star-6 {
  width: 7px;
  height: 7px;
  bottom: 20%;
  left: 30%;
  animation-delay: 2.5s;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    flex-direction: column;
    gap: 40px;
    padding: 30px 20px;
    text-align: center;
  }
  
  .error-number span {
    font-size: 80px;
  }
  
  .error-title {
    font-size: 36px;
  }
  
  .error-description {
    font-size: 16px;
  }
  
  .error-actions {
    justify-content: center;
    flex-direction: column;
  }
  
  .error-actions .el-button {
    width: 100%;
  }
  
  .error-illustration {
    width: 250px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .error-container {
    padding: 20px 15px;
  }
  
  .error-number span {
    font-size: 60px;
  }
  
  .error-title {
    font-size: 28px;
  }
  
  .error-actions {
    gap: 12px;
  }
}
</style>