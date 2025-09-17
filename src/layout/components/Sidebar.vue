<template>
  <!-- 侧边栏菜单容器 -->
  <div class="sidebar-container">
    <!-- Logo区域 -->
    <div class="sidebar-logo" :class="{ 'is-collapsed': collapsed }">
      <router-link to="/dashboard" class="logo-link">
        <img src="/logo.svg" alt="Logo" class="logo-image" v-if="!collapsed" />
        <img src="/logo-mini.svg" alt="Logo" class="logo-image-mini" v-else />
        <span class="logo-text" v-if="!collapsed"> 设备租赁管理 </span>
      </router-link>
    </div>

    <!-- 菜单区域 -->
    <div class="sidebar-menu">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        :collapse="collapsed"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
        @select="handleMenuSelect"
      >
        <!-- 单页：数据看板 -->
        <el-menu-item
          v-if="dashboardItem"
          :index="dashboardItem.path"
          @click="handleMenuClick(dashboardItem.path)"
        >
          <el-icon>
            <component :is="getIconComponent(dashboardItem.icon)" />
          </el-icon>
          <template #title>{{ dashboardItem.title }}</template>
        </el-menu-item>

        <!-- 二级菜单：各业务模块 -->
        <el-sub-menu v-for="parent in parentMenus" :key="parent.path" :index="parent.path">
          <template #title>
            <el-icon>
              <component :is="getIconComponent(parent.icon)" />
            </el-icon>
            <span>{{ parent.title }}</span>
          </template>

          <el-menu-item
            v-for="child in parent.children"
            :key="child.path"
            :index="child.path"
            @click="handleMenuClick(child.path)"
          >
            <template #title>{{ child.title }}</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import * as Icons from '@element-plus/icons-vue'
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
  const currentPath = route.path
  // 如果是菜单中可见路由，直接返回
  if (visibleRoutePaths.value.has(currentPath)) return currentPath

  // 处理详情等隐藏路由：回退到同父级的默认子路由（优先 list），否则父级第一个子路由
  const segments = currentPath.split('/').filter(Boolean)
  if (segments.length === 0) return '/dashboard'
  const parentBase = '/' + segments[0]
  const children = childrenMap.value.get(parentBase)
  if (children && children.length) {
    const listChild = children.find(c => c.path.endsWith('/list'))
    return listChild ? listChild.path : children[0].path
  }
  return currentPath
})

// 展开父级菜单
const defaultOpeneds = computed(() => {
  const path = activeMenu.value
  const segments = path.split('/').filter(Boolean)
  if (segments.length >= 1) {
    return ['/' + segments[0]]
  }
  return []
})

/**
 * 过滤出需要在菜单中显示的路由
 * 排除登录页、404页面等不需要在侧边栏显示的路由
 */
// 从当前路由配置构建菜单结构：
// 1) 单页：/dashboard
// 2) 模块父级：/order, /aftersale, /customer-service, /equipment, /warehouse, /staff, /finance
const allRoutes = computed(() => router.getRoutes())

const visibleRoutes = computed(() => allRoutes.value.filter(r => r.meta?.title && !r.meta?.hidden))

const dashboardItem = computed(() => {
  const dash = visibleRoutes.value.find(r => r.path === '/dashboard')
  if (!dash) return null
  return {
    path: dash.path,
    title: dash.meta?.title,
    icon: dash.meta?.icon
  }
})

// Map: 父级路径 -> 子菜单项
const childrenMap = computed(() => {
  const map = new Map()
  const parents = new Set(
    visibleRoutes.value.filter(r => /^\/[A-Za-z0-9\-]+$/.test(r.path)).map(r => r.path)
  )
  parents.forEach(parentPath => {
    const children = visibleRoutes.value
      .filter(r => r.path.startsWith(parentPath + '/'))
      .map(r => ({ path: r.path, title: r.meta?.title }))
    if (children.length) {
      map.set(parentPath, children)
    }
  })
  return map
})

// 父级菜单集合（需自身也可见）
const parentMenus = computed(() => {
  const parents = visibleRoutes.value.filter(r => /^\/[A-Za-z0-9\-]+$/.test(r.path))
  return parents
    .filter(p => childrenMap.value.has(p.path))
    .map(p => ({
      path: p.path,
      title: p.meta?.title,
      icon: p.meta?.icon,
      children: childrenMap.value.get(p.path) || []
    }))
})

// 用于快速判断路由是否在菜单中可见
const visibleRoutePaths = computed(
  () =>
    new Set([
      ...(dashboardItem.value ? [dashboardItem.value.path] : []),
      ...Array.from(childrenMap.value.values())
        .flat()
        .map(c => c.path)
    ])
)

/**
 * 获取菜单项的路径
 * 处理单级菜单和多级菜单的路径计算
 */
const getMenuPath = route => route.path

/**
 * 处理菜单选择事件
 */
const handleMenuSelect = index => {
  console.log('菜单选择:', index)
}

/**
 * 根据路由 meta.icon 名称安全获取图标组件
 * - 支持直接传入组件
 * - 支持传入字符串按名称在 @element-plus/icons-vue 查找
 * - 兜底返回 Document 图标
 */
const getIconComponent = icon => {
  if (!icon) return Icons.Document
  if (typeof icon === 'object') return icon
  if (typeof icon === 'string' && Icons[icon]) return Icons[icon]
  return Icons.Document
}

/**
 * 处理菜单点击事件
 * 导航到对应的路由
 */
const handleMenuClick = path => {
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
