import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 * 路由配置
 * 采用嵌套路由结构，主要分为以下几个模块：
 * 1. 登录页面（独立布局）
 * 2. 主要业务页面（使用Layout布局）
 *   - 首页数据看板
 *   - 订单管理
 *   - 售后管理
 *   - 客服管理
 *   - 设备管理
 *   - 仓储管理
 *   - 人员管理
 *   - 财务管理
 */

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '数据看板',
          icon: 'DataAnalysis',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: {
      title: '订单管理',
      icon: 'Document',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: {
          title: '订单列表',
          requiresAuth: true
        }
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: {
          title: '订单详情',
          requiresAuth: true,
          hidden: true // 在菜单中隐藏
        }
      }
    ]
  },
  {
    path: '/aftersale',
    component: Layout,
    redirect: '/aftersale/list',
    meta: {
      title: '售后管理',
      icon: 'Tools',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'AftersaleList',
        component: () => import('@/views/aftersale/list.vue'),
        meta: {
          title: '售后工单',
          requiresAuth: true
        }
      },
      {
        path: 'detail/:id',
        name: 'AftersaleDetail',
        component: () => import('@/views/aftersale/detail.vue'),
        meta: {
          title: '工单详情',
          requiresAuth: true,
          hidden: true
        }
      }
    ]
  },
  {
    path: '/customer-service',
    component: Layout,
    redirect: '/customer-service/tickets',
    meta: {
      title: '客服管理',
      icon: 'Service',
      requiresAuth: true
    },
    children: [
      {
        path: 'tickets',
        name: 'CustomerServiceTickets',
        component: () => import('@/views/customer-service/tickets.vue'),
        meta: {
          title: '客服工单',
          requiresAuth: true
        }
      },
      {
        path: 'chat',
        name: 'CustomerServiceChat',
        component: () => import('@/views/customer-service/chat.vue'),
        meta: {
          title: '在线客服',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/list',
    meta: {
      title: '设备管理',
      icon: 'Monitor',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'EquipmentList',
        component: () => import('@/views/equipment/list.vue'),
        meta: {
          title: '设备列表',
          requiresAuth: true
        }
      },
      {
        path: 'categories',
        name: 'EquipmentCategories',
        component: () => import('@/views/equipment/categories.vue'),
        meta: {
          title: '设备分类',
          requiresAuth: true
        }
      },
      {
        path: 'maintenance',
        name: 'EquipmentMaintenance',
        component: () => import('@/views/equipment/maintenance.vue'),
        meta: {
          title: '维护记录',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/inventory',
    meta: {
      title: '仓储管理',
      icon: 'Box',
      requiresAuth: true
    },
    children: [
      {
        path: 'inventory',
        name: 'WarehouseInventory',
        component: () => import('@/views/warehouse/inventory.vue'),
        meta: {
          title: '库存管理',
          requiresAuth: true
        }
      },
      {
        path: 'inbound',
        name: 'WarehouseInbound',
        component: () => import('@/views/warehouse/inbound.vue'),
        meta: {
          title: '入库管理',
          requiresAuth: true
        }
      },
      {
        path: 'outbound',
        name: 'WarehouseOutbound',
        component: () => import('@/views/warehouse/outbound.vue'),
        meta: {
          title: '出库管理',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    redirect: '/staff/list',
    meta: {
      title: '人员管理',
      icon: 'User',
      requiresAuth: true
    },
    children: [
      {
        path: 'list',
        name: 'StaffList',
        component: () => import('@/views/staff/list.vue'),
        meta: {
          title: '员工管理',
          requiresAuth: true
        }
      },
      {
        path: 'roles',
        name: 'StaffRoles',
        component: () => import('@/views/staff/roles.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true
        }
      },
      {
        path: 'permissions',
        name: 'StaffPermissions',
        component: () => import('@/views/staff/permissions.vue'),
        meta: {
          title: '权限管理',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/revenue',
    meta: {
      title: '财务管理',
      icon: 'Money',
      requiresAuth: true
    },
    children: [
      {
        path: 'revenue',
        name: 'FinanceRevenue',
        component: () => import('@/views/finance/revenue.vue'),
        meta: {
          title: '收入统计',
          requiresAuth: true
        }
      },
      {
        path: 'expenses',
        name: 'FinanceExpenses',
        component: () => import('@/views/finance/expenses.vue'),
        meta: {
          title: '支出统计',
          requiresAuth: true
        }
      },
      {
        path: 'reports',
        name: 'FinanceReports',
        component: () => import('@/views/finance/reports.vue'),
        meta: {
          title: '财务报表',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时滚动到顶部
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * 路由守卫
 * 1. 检查用户是否已登录
 * 2. 验证用户权限
 * 3. 设置页面标题
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 租赁设备管理系统`
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    // 这里应该检查用户登录状态
    // 暂时简化处理，实际项目中需要检查token或用户信息
    const isLoggedIn = localStorage.getItem('token') || sessionStorage.getItem('userInfo')
    
    if (!isLoggedIn) {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原始路径，登录后跳转
      })
      return
    }
  }

  next()
})

export default router