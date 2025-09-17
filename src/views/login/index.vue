<template>
  <!-- 登录页面 -->
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="login-background">
      <div class="bg-decoration bg-decoration-1"></div>
      <div class="bg-decoration bg-decoration-2"></div>
      <div class="bg-decoration bg-decoration-3"></div>
    </div>

    <!-- 登录表单区域 -->
    <div class="login-content">
      <!-- 左侧介绍区域 -->
      <div class="login-intro">
        <div class="intro-content">
          <div class="logo-section">
            <img src="/logo.svg" alt="Logo" class="logo-image" />
            <h1 class="system-title">租赁设备管理系统</h1>
          </div>
          <div class="intro-text">
            <h2 class="intro-title">专业的设备租赁管理平台</h2>
            <p class="intro-description">
              提供全面的设备管理、订单管理、客服管理等功能，
              帮助您高效管理设备租赁业务，提升运营效率。
            </p>
            <div class="feature-list">
              <div class="feature-item">
                <el-icon><Monitor /></el-icon>
                <span>设备全生命周期管理</span>
              </div>
              <div class="feature-item">
                <el-icon><Document /></el-icon>
                <span>智能订单处理系统</span>
              </div>
              <div class="feature-item">
                <el-icon><Service /></el-icon>
                <span>专业客服支持体系</span>
              </div>
              <div class="feature-item">
                <el-icon><DataAnalysis /></el-icon>
                <span>实时数据分析报表</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <h3 class="form-title">登录系统</h3>
            <p class="form-subtitle">欢迎回来，请输入您的账户信息</p>
          </div>

          <!-- 登录表单 -->
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
            @keyup.enter="handleLogin"
          >
            <!-- 用户名输入框 -->
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                clearable
                :disabled="loading"
              />
            </el-form-item>

            <!-- 密码输入框 -->
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                clearable
                :disabled="loading"
              />
            </el-form-item>

            <!-- 验证码输入框 -->
            <el-form-item prop="captcha" v-if="showCaptcha">
              <div class="captcha-container">
                <el-input
                  v-model="loginForm.captcha"
                  placeholder="请输入验证码"
                  :prefix-icon="Key"
                  clearable
                  :disabled="loading"
                  class="captcha-input"
                />
                <div class="captcha-image" @click="refreshCaptcha">
                  <img :src="captchaUrl" alt="验证码" />
                  <div class="captcha-refresh">
                    <el-icon><Refresh /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>

            <!-- 记住密码和忘记密码 -->
            <div class="form-options">
              <el-checkbox v-model="loginForm.rememberMe" :disabled="loading">
                记住密码
              </el-checkbox>
              <el-button type="text" @click="handleForgotPassword" :disabled="loading">
                忘记密码？
              </el-button>
            </div>

            <!-- 登录按钮 -->
            <el-form-item>
              <el-button
                type="primary"
                class="login-button"
                :loading="loading"
                @click="handleLogin"
              >
                <span v-if="!loading">登录</span>
                <span v-else>登录中...</span>
              </el-button>
            </el-form-item>
          </el-form>

          <!-- 其他登录方式 -->
          <div class="other-login" v-if="false">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-login">
              <el-button circle :icon="Platform" />
              <el-button circle :icon="Message" />
              <el-button circle :icon="Phone" />
            </div>
          </div>

          <!-- 演示账号信息 -->
          <div class="demo-info">
            <el-alert title="演示账号" type="info" :closable="false" show-icon>
              <template #default>
                <div class="demo-accounts">
                  <div class="demo-account"><strong>管理员：</strong>admin / 123456</div>
                  <div class="demo-account"><strong>操作员：</strong>operator / 123456</div>
                </div>
              </template>
            </el-alert>
          </div>
        </div>

        <!-- 页脚信息 -->
        <div class="login-footer">
          <p>&copy; 2024 租赁设备管理系统. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  Monitor,
  Document,
  Service,
  DataAnalysis,
  User,
  Lock,
  Key,
  Refresh,
  Platform,
  Message,
  Phone
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 响应式数据
const loginFormRef = ref()
const loading = ref(false)
const showCaptcha = ref(false)
const captchaUrl = ref('')

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: '',
  rememberMe: false
})

// 表单验证规则
const loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码长度为 4 位', trigger: 'blur' }
  ]
})

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    await loginFormRef.value.validate()

    loading.value = true

    // 调用登录接口
    const response = await userStore.login(loginForm)

    ElMessage.success('登录成功')

    // 获取重定向路径
    const redirect = route.query.redirect || '/dashboard'

    // 跳转到目标页面
    router.push(redirect)
  } catch (error) {
    console.error('登录失败:', error)

    // 根据错误类型显示不同的错误信息
    if (error.code === 'INVALID_CAPTCHA') {
      ElMessage.error('验证码错误')
      refreshCaptcha()
    } else if (error.code === 'INVALID_CREDENTIALS') {
      ElMessage.error('用户名或密码错误')
      // 连续登录失败后显示验证码
      showCaptcha.value = true
      refreshCaptcha()
    } else if (error.code === 'ACCOUNT_LOCKED') {
      ElMessage.error('账号已被锁定，请联系管理员')
    } else {
      ElMessage.error(error.message || '登录失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 刷新验证码
 */
const refreshCaptcha = () => {
  // 生成验证码URL
  captchaUrl.value = `/api/captcha?t=${Date.now()}`
}

/**
 * 处理忘记密码
 */
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中，请联系管理员重置密码')
}

/**
 * 初始化页面
 */
const initPage = () => {
  // 如果已经登录，直接跳转到首页
  if (userStore.isLoggedIn) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
    return
  }

  // 从localStorage恢复记住的用户名
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    loginForm.rememberMe = true
  }

  // 初始化验证码
  if (showCaptcha.value) {
    refreshCaptcha()
  }
}

// 组件挂载时初始化
onMounted(() => {
  initPage()
})

// 监听记住密码选项
const handleRememberChange = () => {
  if (loginForm.rememberMe) {
    localStorage.setItem('rememberedUsername', loginForm.username)
  } else {
    localStorage.removeItem('rememberedUsername')
  }
}
</script>

<style scoped>
/* 登录页面容器 */
.login-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 背景装饰 */
.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.bg-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.bg-decoration-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.bg-decoration-2 {
  width: 300px;
  height: 300px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.bg-decoration-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  left: 60%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 主要内容区域 */
.login-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 600px;
}

/* 左侧介绍区域 */
.login-intro {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  position: relative;
}

.intro-content {
  width: 100%;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-image {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.system-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.intro-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
  text-align: center;
}

.intro-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
  text-align: center;
  opacity: 0.9;
}

.feature-list {
  display: grid;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.feature-item .el-icon {
  font-size: 20px;
}

/* 右侧表单区域 */
.login-form-section {
  flex: 1;
  padding: 60px 40px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.form-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 登录表单样式 */
.login-form {
  margin-bottom: 24px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-form .el-input {
  height: 48px;
}

.captcha-container {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  position: relative;
  width: 120px;
  height: 48px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s;
}

.captcha-image:hover {
  border-color: var(--primary-color);
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.captcha-refresh {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.captcha-image:hover .captcha-refresh {
  opacity: 1;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

/* 其他登录方式 */
.other-login {
  margin-top: 24px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.divider span {
  background: white;
  padding: 0 16px;
  color: var(--text-secondary);
  font-size: 12px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 12px;
}

/* 演示信息 */
.demo-info {
  margin-top: 24px;
}

.demo-accounts {
  font-size: 12px;
}

.demo-account {
  margin-bottom: 4px;
}

.demo-account:last-child {
  margin-bottom: 0;
}

/* 页脚 */
.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.login-footer p {
  font-size: 12px;
  color: var(--text-placeholder);
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    margin: 20px;
    max-width: none;
  }

  .login-intro {
    padding: 40px 20px;
  }

  .system-title {
    font-size: 24px;
  }

  .intro-title {
    font-size: 20px;
  }

  .login-form-section {
    padding: 40px 20px 20px;
  }

  .form-title {
    font-size: 28px;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }

  .captcha-container {
    flex-direction: column;
  }

  .captcha-image {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-intro {
    padding: 30px 15px;
  }

  .login-form-section {
    padding: 30px 15px 15px;
  }

  .form-title {
    font-size: 24px;
  }

  .system-title {
    font-size: 20px;
  }
}
</style>
