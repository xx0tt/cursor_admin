<template>
  <!-- 侧边栏菜单容器 -->
  <div class="sidebar-container">
    <!-- Logo区域 -->
    <div class="sidebar-logo" :class="{ 'is-collapsed': collapsed }">
      <router-link to="/dashboard" class="logo-link">
        <img 
          src="/logo.png" 
          alt="Logo" 
          class="logo-image"
          v-if="!collapsed"
        />
        <img 
          src="/logo-mini.png" 
          alt="Logo" 
          class="logo-image-mini"
          v-else
        />
        <span class="logo-text" v-if="!collapsed">
          设备租赁管理
        </span>
      </router-link>
    </div>

    <!-- 菜单区域 -->
    <div class="sidebar-menu">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapsed"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        @select="handleMenuSelect"
      >
        <!-- 遍历渲染菜单项 -->
        <template v-for="route in menuRoutes" :key="route.path">
          <!-- 单级菜单 -->
          <el-menu-item 
            v-if="!route.children || route.children.length === 1" 
            :index="getMenuPath(route)"
            @click="handleMenuClick(getMenuPath(route))"
          >
            <el-icon>
              <component :is="route.meta?.icon || 'Document'" />
            </el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>

          <!-- 多级菜单 -->
          <el-sub-menu 
            v-else 
            :index="route.path"
          >
            <template #title>
              <el-icon>
                <component :is="route.meta?.icon || 'Document'" />
              </el-icon>
              <span>{{ route.meta?.title }}</span>
            </template>
            
            <!-- 子菜单项 -->
            <el-menu-item
              v-for="child in route.children"
              :key="child.path"
              :index="route.path + '/' + child.path"
              @click="handleMenuClick(route.path + '/' + child.path)"
              v-show="!child.meta?.hidden"
            >
              <template #title>{{ child.meta?.title }}</template>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Props定义
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

/**
 * 获取当前激活的菜单项
 * 根据当前路由路径确定高亮的菜单
 */
const activeMenu = computed(() => {
  const { path } = route
  // 处理详情页面等隐藏路由，显示其父级菜单为激活状态
  if (path.includes('/detail/')) {
    return path.substring(0, path.lastIndexOf('/'))
  }
  return path
})

/**
 * 过滤出需要在菜单中显示的路由
 * 排除登录页、404页面等不需要在侧边栏显示的路由
 */
const menuRoutes = computed(() => {
  return router.getRoutes().filter(route => {
    return route.path !== '/' && 
           route.path !== '/login' && 
           route.path !== '/404' && 
           !route.path.includes('/:pathMatch') &&
           route.meta?.title &&
           !route.meta?.hidden
  })
})

/**
 * 获取菜单项的路径
 * 处理单级菜单和多级菜单的路径计算
 */
const getMenuPath = (route) => {
  if (!route.children || route.children.length === 1) {
    // 单级菜单或只有一个子菜单的情况
    if (route.children && route.children.length === 1) {
      return route.path + '/' + route.children[0].path
    }
    return route.path
  }
  return route.path
}

/**
 * 处理菜单选择事件
 */
const handleMenuSelect = (index) => {
  console.log('菜单选择:', index)
}

/**
 * 处理菜单点击事件
 * 导航到对应的路由
 */
const handleMenuClick = (path) => {
  if (path !== route.path) {
    router.push(path).catch(err => {
      console.warn('路由跳转警告:', err)
    })
  }
}
</script>

<style scoped>
/* 侧边栏容器样式 */
.sidebar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Logo区域样式 */
.sidebar-logo {
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #002140;
  border-bottom: 1px solid #1f2937;
}

.sidebar-logo.is-collapsed {
  padding: 0 12px;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  width: 100%;
  justify-content: center;
}

.logo-image {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo-image-mini {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

/* 菜单区域样式 */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Element Plus菜单样式覆盖 */
:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
}

:deep(.el-menu-item:hover) {
  background-color: #1f2937 !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #1f2937 !important;
  border-right: 3px solid var(--primary-color);
}

:deep(.el-sub-menu .el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
}

:deep(.el-sub-menu .el-sub-menu__title:hover) {
  background-color: #1f2937 !important;
}

:deep(.el-sub-menu .el-menu-item) {
  background-color: #0c1419 !important;
  height: 44px;
  line-height: 44px;
}

:deep(.el-sub-menu .el-menu-item:hover) {
  background-color: #1f2937 !important;
}

:deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: #1f2937 !important;
}

/* 折叠状态下的样式调整 */
:deep(.el-menu--collapse) {
  width: var(--sidebar-collapsed-width);
}

:deep(.el-menu--collapse .el-menu-item) {
  text-align: center;
  padding: 0 12px !important;
}

:deep(.el-menu--collapse .el-sub-menu) {
  text-align: center;
}

:deep(.el-menu--collapse .el-sub-menu .el-sub-menu__title) {
  padding: 0 12px !important;
}

/* 滚动条样式 */
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: #001529;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}
</style>