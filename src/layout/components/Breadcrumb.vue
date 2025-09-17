<template>
  <!-- 面包屑导航组件 -->
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="item.path"
        :to="index === breadcrumbList.length - 1 ? null : item.path"
      >
        <!-- 添加图标 -->
        <el-icon v-if="item.icon" class="breadcrumb-icon">
          <component :is="item.icon" />
        </el-icon>
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/**
 * 计算面包屑导航列表
 * 根据当前路由的matched数组生成面包屑
 */
const breadcrumbList = computed(() => {
  const matched = route.matched.filter(item => item.meta?.title)
  const breadcrumbs = []

  // 总是添加首页
  if (route.path !== '/dashboard') {
    breadcrumbs.push({
      path: '/dashboard',
      title: '首页',
      icon: 'HomeFilled'
    })
  }

  // 处理路由层级
  matched.forEach((item, index) => {
    // 跳过根路由
    if (item.path === '/') return

    const breadcrumbItem = {
      path: item.path,
      title: item.meta.title,
      icon: item.meta.icon
    }

    // 处理子路由的路径拼接
    if (item.children && item.children.length > 0) {
      const currentChild = item.children.find(child => {
        const fullPath = item.path + '/' + child.path
        return route.path.startsWith(fullPath)
      })

      if (currentChild && !currentChild.meta?.hidden) {
        // 如果是多级菜单，先添加父级
        if (item.children.length > 1) {
          breadcrumbs.push(breadcrumbItem)
        }
        
        // 添加当前子路由
        breadcrumbs.push({
          path: item.path + '/' + currentChild.path,
          title: currentChild.meta.title,
          icon: currentChild.meta.icon
        })
      } else if (item.children.length === 1) {
        // 只有一个子路由的情况，直接使用子路由信息
        const child = item.children[0]
        breadcrumbs.push({
          path: item.path + '/' + child.path,
          title: child.meta.title || item.meta.title,
          icon: item.meta.icon
        })
      } else {
        breadcrumbs.push(breadcrumbItem)
      }
    } else {
      breadcrumbs.push(breadcrumbItem)
    }
  })

  // 处理详情页面等特殊路由
  if (route.path.includes('/detail/')) {
    const detailTitle = getDetailTitle()
    if (detailTitle) {
      breadcrumbs.push({
        path: route.path,
        title: detailTitle,
        icon: 'Document'
      })
    }
  }

  return breadcrumbs
})

/**
 * 获取详情页面的标题
 * 根据路由参数和页面类型生成合适的标题
 */
const getDetailTitle = () => {
  const { params, path } = route
  
  if (path.includes('/order/detail/')) {
    return `订单详情 #${params.id}`
  } else if (path.includes('/aftersale/detail/')) {
    return `工单详情 #${params.id}`
  } else if (path.includes('/equipment/detail/')) {
    return `设备详情 #${params.id}`
  }
  
  return '详情'
}
</script>

<style scoped>
/* 面包屑容器样式 */
.breadcrumb-container {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 面包屑样式 */
.breadcrumb {
  font-size: 14px;
}

.breadcrumb-icon {
  margin-right: 4px;
  font-size: 14px;
}

/* Element Plus 面包屑样式覆盖 */
:deep(.el-breadcrumb__item) {
  display: flex;
  align-items: center;
}

:deep(.el-breadcrumb__inner) {
  display: flex;
  align-items: center;
  color: var(--text-regular);
  font-weight: 400;
}

:deep(.el-breadcrumb__inner:hover) {
  color: var(--primary-color);
  cursor: pointer;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: var(--text-primary);
  font-weight: 500;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover) {
  color: var(--text-primary);
  cursor: default;
}

:deep(.el-breadcrumb__separator) {
  margin: 0 8px;
  color: var(--text-placeholder);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .breadcrumb {
    font-size: 12px;
  }
  
  .breadcrumb-icon {
    font-size: 12px;
  }
  
  :deep(.el-breadcrumb__separator) {
    margin: 0 4px;
  }
}
</style>
