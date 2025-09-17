<template>
  <!-- 头部导航栏 -->
  <div class="header-container">
    <!-- 左侧区域 -->
    <div class="header-left">
      <!-- 侧边栏折叠按钮 -->
      <el-button
        type="text"
        size="large"
        class="collapse-btn"
        @click="handleToggleSidebar"
      >
        <el-icon size="18">
          <component :is="collapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </el-button>

      <!-- 页面标题 -->
      <div class="page-title">
        {{ currentPageTitle }}
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="header-right">
      <!-- 全屏切换按钮 -->
      <el-tooltip content="全屏" placement="bottom">
        <el-button
          type="text"
          size="large"
          class="header-btn"
          @click="toggleFullscreen"
        >
          <el-icon size="18">
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <!-- 消息通知 -->
      <el-dropdown trigger="click" class="notification-dropdown">
        <el-button type="text" size="large" class="header-btn">
          <el-badge :value="unreadCount" :hidden="unreadCount === 0">
            <el-icon size="18">
              <Bell />
            </el-icon>
          </el-badge>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="notification-menu">
            <div class="notification-header">
              <span>消息通知</span>
              <el-button type="text" size="small" @click="markAllAsRead">
                全部已读
              </el-button>
            </div>
            <el-scrollbar height="300px">
              <div class="notification-list">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'is-unread': !notification.read }"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-desc">{{ notification.description }}</div>
                    <div class="notification-time">{{ formatTime(notification.time) }}</div>
                  </div>
                  <div v-if="!notification.read" class="notification-dot"></div>
                </div>
              </div>
            </el-scrollbar>
            <div class="notification-footer">
              <el-button type="text" size="small">查看全部</el-button>
            </div>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 用户信息下拉菜单 -->
      <el-dropdown trigger="click" class="user-dropdown">
        <div class="user-info">
          <el-avatar
            :size="36"
            :src="userInfo.avatar"
            class="user-avatar"
          >
            {{ userInfo.name?.charAt(0) }}
          </el-avatar>
          <span class="user-name">{{ userInfo.name }}</span>
          <el-icon class="dropdown-icon">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUserProfile">
              <el-icon><User /></el-icon>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item @click="handleSettings">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// Props定义
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

// Emits定义
const emit = defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()

// 响应式数据
const userInfo = ref({
  name: '管理员',
  avatar: '',
  role: '超级管理员',
  email: 'admin@example.com'
})

const notifications = ref([
  {
    id: 1,
    title: '新订单提醒',
    description: '您有一个新的设备租赁订单需要处理',
    time: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
    read: false,
    type: 'order'
  },
  {
    id: 2,
    title: '设备维护提醒',
    description: '编号为EQ001的设备需要进行定期维护',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
    read: false,
    type: 'maintenance'
  },
  {
    id: 3,
    title: '客服工单',
    description: '客户反馈设备使用问题，请及时处理',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    read: true,
    type: 'service'
  }
])

/**
 * 计算当前页面标题
 */
const currentPageTitle = computed(() => {
  return route.meta?.title || '租赁设备管理系统'
})

/**
 * 计算未读消息数量
 */
const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.read).length
})

/**
 * 处理侧边栏折叠切换
 */
const handleToggleSidebar = () => {
  emit('toggle-sidebar')
}

/**
 * 切换全屏模式
 */
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      ElMessage.error('进入全屏模式失败')
    })
  } else {
    document.exitFullscreen().catch(err => {
      ElMessage.error('退出全屏模式失败')
    })
  }
}

/**
 * 标记所有消息为已读
 */
const markAllAsRead = () => {
  notifications.value.forEach(item => {
    item.read = true
  })
  ElMessage.success('所有消息已标记为已读')
}

/**
 * 处理消息点击
 */
const handleNotificationClick = (notification) => {
  if (!notification.read) {
    notification.read = true
  }
  
  // 根据消息类型跳转到相应页面
  switch (notification.type) {
    case 'order':
      router.push('/order/list')
      break
    case 'maintenance':
      router.push('/equipment/maintenance')
      break
    case 'service':
      router.push('/customer-service/tickets')
      break
  }
}

/**
 * 格式化时间显示
 */
const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return time.toLocaleDateString()
  }
}

/**
 * 处理用户个人中心
 */
const handleUserProfile = () => {
  ElMessage.info('个人中心功能开发中...')
}

/**
 * 处理系统设置
 */
const handleSettings = () => {
  ElMessage.info('系统设置功能开发中...')
}

/**
 * 处理用户登出
 */
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 清除用户信息和token
    localStorage.removeItem('token')
    sessionStorage.removeItem('userInfo')
    
    // 跳转到登录页
    router.push('/login')
    ElMessage.success('已成功退出登录')
  } catch {
    // 用户取消登出
  }
}

// 组件挂载时获取用户信息
onMounted(() => {
  // 这里应该从API获取用户信息
  // 暂时使用模拟数据
})
</script>

<style scoped>
/* 头部容器样式 */
.header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: var(--card-bg);
}

/* 左侧区域样式 */
.header-left {
  display: flex;
  align-items: center;
}

.collapse-btn {
  margin-right: 16px;
  color: var(--text-regular);
}

.collapse-btn:hover {
  color: var(--primary-color);
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: var(--text-primary);
}

/* 右侧区域样式 */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  color: var(--text-regular);
  padding: 8px;
}

.header-btn:hover {
  color: var(--primary-color);
  background-color: var(--bg-color);
}

/* 用户信息样式 */
.user-dropdown {
  margin-left: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: var(--bg-color);
}

.user-avatar {
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  color: var(--text-primary);
  margin-right: 4px;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 消息通知样式 */
.notification-dropdown {
  margin-right: 8px;
}

.notification-menu {
  width: 350px;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

.notification-list {
  padding: 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
  position: relative;
}

.notification-item:hover {
  background-color: var(--bg-color);
}

.notification-item.is-unread {
  background-color: #f0f9ff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.notification-desc {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 12px;
  color: var(--text-placeholder);
}

.notification-dot {
  width: 6px;
  height: 6px;
  background-color: var(--primary-color);
  border-radius: 50%;
  margin-top: 8px;
  margin-left: 8px;
}

.notification-footer {
  padding: 8px 16px;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 12px;
  }
  
  .page-title {
    display: none;
  }
  
  .user-name {
    display: none;
  }
  
  .notification-menu {
    width: 300px;
  }
}
</style>
