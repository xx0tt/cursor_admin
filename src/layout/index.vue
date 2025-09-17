<template>
  <!-- 主布局容器 -->
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="layout-sidebar" :class="{ 'is-collapsed': isCollapsed }">
      <Sidebar :collapsed="isCollapsed" />
    </div>

    <!-- 主内容区域 -->
    <div class="layout-main">
      <!-- 头部导航栏 -->
      <div class="layout-header">
        <Header :collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />
      </div>

      <!-- 页面内容区域 -->
      <div class="layout-content">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-container">
          <Breadcrumb />
        </div>

        <!-- 路由视图 - 显示当前页面内容 -->
        <div class="page-wrapper">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import Breadcrumb from './components/Breadcrumb.vue'

// 响应式数据
const isCollapsed = ref(false) // 侧边栏是否折叠
const cachedViews = ref(['Dashboard']) // 需要缓存的页面组件名称

const route = useRoute()

/**
 * 切换侧边栏折叠状态
 */
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

/**
 * 计算主内容区域的左边距
 * 根据侧边栏是否折叠来调整布局
 */
const mainLeftMargin = computed(() => {
  return isCollapsed.value ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'
})
</script>

<style scoped>
/* 布局容器样式 */
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* 侧边栏样式 */
.layout-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: #001529;
  transition: width 0.3s;
  z-index: 1001;
}

.layout-sidebar.is-collapsed {
  width: var(--sidebar-collapsed-width);
}

/* 主内容区域样式 */
.layout-main {
  flex: 1;
  margin-left: v-bind(mainLeftMargin);
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 头部样式 */
.layout-header {
  position: fixed;
  top: 0;
  right: 0;
  left: v-bind(mainLeftMargin);
  height: var(--header-height);
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: left 0.3s;
}

/* 内容区域样式 */
.layout-content {
  flex: 1;
  margin-top: var(--header-height);
  background: var(--bg-color);
  min-height: calc(100vh - var(--header-height));
}

/* 面包屑容器样式 */
.breadcrumb-container {
  background: var(--card-bg);
  padding: 12px 20px;
  border-bottom: 1px solid var(--border-color);
}

/* 页面包装器样式 */
.page-wrapper {
  padding: 0;
  min-height: calc(100vh - var(--header-height) - 49px);
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-sidebar {
    width: 0;
    overflow: hidden;
  }

  .layout-sidebar.is-collapsed {
    width: 0;
  }

  .layout-main {
    margin-left: 0;
  }

  .layout-header {
    left: 0;
  }

  .breadcrumb-container {
    padding: 8px 12px;
  }
}
</style>
