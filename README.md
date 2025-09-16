# 租赁设备管理系统

一个基于Vue3的现代化租赁设备后台管理系统，提供全面的设备管理、订单管理、客服管理等功能。

## 🚀 项目特性

- **现代化技术栈**: Vue 3 + Vite + Pinia + Element Plus
- **TypeScript支持**: 完整的类型定义和智能提示
- **响应式设计**: 适配桌面端、平板和移动端
- **模块化架构**: 清晰的目录结构和组件划分
- **状态管理**: 使用Pinia进行集中式状态管理
- **路由管理**: Vue Router 4实现页面路由和权限控制
- **UI组件**: Element Plus提供丰富的UI组件
- **图表可视化**: ECharts集成实现数据可视化
- **开发体验**: ESLint + Prettier代码规范和格式化

## 📋 功能模块

### 🏠 首页数据看板
- 核心指标展示（总收入、活跃订单、设备总数、客户满意度）
- 收入趋势图表
- 设备状态分布图
- 订单统计图表
- 热门设备排行榜
- 快速操作入口
- 最近活动记录

### 📋 订单管理
- 订单列表查看和搜索
- 订单详情查看
- 订单状态管理（待确认、已确认、进行中、已完成、已取消）
- 订单创建和编辑
- 批量操作支持
- 数据导出功能

### 🔧 设备管理
- 设备信息管理
- 设备状态监控（可用、租赁中、维护中、故障、报废）
- 设备分类管理
- 维护记录跟踪
- 设备利用率统计
- 批量导入导出

### 📦 仓储管理
- 库存管理和监控
- 入库出库记录
- 库存预警提醒
- 仓库信息管理
- 库存调整功能
- 供应商管理

### 🛠️ 售后管理
- 售后工单管理
- 处理流程跟踪
- 问题分类统计
- 客户满意度评价
- 技术人员分配

### 💬 客服管理
- 客服工单系统
- 在线咨询功能
- 客户沟通记录
- 问题分类和优先级
- 响应时间统计

### 👥 人员管理
- 员工信息管理
- 角色权限控制
- 部门组织架构
- 工作记录跟踪
- 绩效考核支持

### 💰 财务管理
- 收入支出统计
- 财务报表生成
- 收款记录管理
- 成本分析
- 利润分析

## 🛠️ 技术栈

- **前端框架**: Vue 3.3+
- **构建工具**: Vite 4.4+
- **状态管理**: Pinia 2.1+
- **路由管理**: Vue Router 4.2+
- **UI框架**: Element Plus 2.3+
- **图表库**: ECharts 5.4+ / Vue-ECharts 6.6+
- **HTTP客户端**: Axios 1.4+
- **开发语言**: JavaScript ES6+
- **CSS预处理**: 原生CSS + CSS Variables
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
rental-equipment-admin/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── layout/            # 布局组件
│   │   ├── components/    # 布局子组件
│   │   └── index.vue      # 主布局
│   ├── router/            # 路由配置
│   │   └── index.js       # 路由定义
│   ├── stores/            # 状态管理
│   │   ├── modules/       # 状态模块
│   │   └── index.js       # 状态入口
│   ├── styles/            # 全局样式
│   │   └── index.css      # 样式文件
│   ├── views/             # 页面组件
│   │   ├── dashboard/     # 数据看板
│   │   ├── order/         # 订单管理
│   │   ├── equipment/     # 设备管理
│   │   ├── warehouse/     # 仓储管理
│   │   ├── aftersale/     # 售后管理
│   │   ├── customer-service/ # 客服管理
│   │   ├── staff/         # 人员管理
│   │   ├── finance/       # 财务管理
│   │   ├── login/         # 登录页面
│   │   └── error/         # 错误页面
│   ├── App.vue            # 根组件
│   └── main.js            # 应用入口
├── index.html             # HTML模板
├── package.json           # 项目配置
├── vite.config.js         # Vite配置
└── README.md              # 项目说明
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

### 开发环境运行

```bash
# 启动开发服务器
npm run dev

# 或使用yarn
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本

```bash
# 构建项目
npm run build

# 或使用yarn
yarn build
```

### 预览生产版本

```bash
# 预览构建结果
npm run preview

# 或使用yarn
yarn preview
```

## 🔑 登录信息

系统提供以下演示账号：

- **管理员账号**: 
  - 用户名: `admin`
  - 密码: `123456`
  - 权限: 所有功能访问权限

- **操作员账号**:
  - 用户名: `operator`
  - 密码: `123456`
  - 权限: 基础操作权限

## 📱 功能截图

### 数据看板
- 实时数据展示
- 多维度图表分析
- 快速操作入口

### 订单管理
- 订单列表和搜索
- 详细信息查看
- 状态流程管理

### 设备管理
- 设备信息维护
- 状态实时监控
- 维护记录跟踪

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在侧边栏菜单中添加导航项

### 状态管理

使用Pinia进行状态管理，每个模块都有对应的store：

```javascript
// 使用订单store
import { useOrderStore } from '@/stores'

const orderStore = useOrderStore()
const { orders, fetchOrders } = orderStore
```

### 样式开发

项目使用CSS Variables实现主题定制：

```css
:root {
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --warning-color: #E6A23C;
  --danger-color: #F56C6C;
}
```

### 组件开发

遵循Vue 3 Composition API最佳实践：

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const loading = ref(false)
const formData = reactive({})

// 计算属性
const isValid = computed(() => {
  // 计算逻辑
})

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
/* 组件样式 */
</style>
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-01)
- 🎉 项目初始版本发布
- ✨ 完成核心功能模块开发
- 🎨 实现响应式设计和主题定制
- 📱 支持移动端适配
- 🔐 实现用户权限管理
- 📊 集成数据可视化功能

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [ECharts](https://echarts.apache.org/) - 数据可视化图表库
- [Vite](https://vitejs.dev/) - 前端构建工具

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: support@example.com
- 项目地址: https://github.com/your-username/rental-equipment-admin
- 文档地址: https://your-docs-site.com

---

© 2024 租赁设备管理系统. All rights reserved.