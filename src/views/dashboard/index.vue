<template>
  <!-- 数据看板主页面 -->
  <div class="dashboard-container page-container">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <div class="page-title">数据看板</div>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
          class="date-picker"
        />
        <el-button type="primary" :icon="Refresh" @click="refreshData">
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 核心指标卡片区域 -->
    <div class="metrics-grid">
      <div 
        v-for="metric in coreMetrics" 
        :key="metric.key"
        class="metric-card"
      >
        <div class="metric-icon" :style="{ backgroundColor: metric.color + '20' }">
          <el-icon :size="32" :color="metric.color">
            <component :is="metric.icon" />
          </el-icon>
        </div>
        <div class="metric-content">
          <div class="metric-title">{{ metric.title }}</div>
          <div class="metric-value">{{ formatNumber(metric.value) }}</div>
          <div class="metric-change" :class="metric.trend">
            <el-icon>
              <component :is="metric.trend === 'up' ? 'TrendChartUp' : 'TrendChartDown'" />
            </el-icon>
            <span>{{ metric.change }}</span>
            <span class="change-text">较昨日</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 收入趋势图 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">收入趋势</h3>
              <div class="chart-actions">
                <el-radio-group v-model="revenueChartPeriod" size="small">
                  <el-radio-button label="7days">近7天</el-radio-button>
                  <el-radio-button label="30days">近30天</el-radio-button>
                  <el-radio-button label="3months">近3月</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="chart-content">
              <v-chart 
                class="chart" 
                :option="revenueChartOption" 
                :loading="chartLoading"
                autoresize
              />
            </div>
          </div>
        </el-col>

        <!-- 设备状态分布图 -->
        <el-col :span="12">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">设备状态分布</h3>
            </div>
            <div class="chart-content">
              <v-chart 
                class="chart" 
                :option="equipmentStatusChartOption" 
                :loading="chartLoading"
                autoresize
              />
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-4">
        <!-- 订单统计图 -->
        <el-col :span="16">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">订单统计</h3>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-color" style="background: #5470c6;"></span>
                  新增订单
                </span>
                <span class="legend-item">
                  <span class="legend-color" style="background: #91cc75;"></span>
                  完成订单
                </span>
                <span class="legend-item">
                  <span class="legend-color" style="background: #fac858;"></span>
                  取消订单
                </span>
              </div>
            </div>
            <div class="chart-content">
              <v-chart 
                class="chart" 
                :option="orderChartOption" 
                :loading="chartLoading"
                autoresize
              />
            </div>
          </div>
        </el-col>

        <!-- 热门设备排行 -->
        <el-col :span="8">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">热门设备排行</h3>
            </div>
            <div class="ranking-list">
              <div 
                v-for="(item, index) in popularEquipment" 
                :key="item.id"
                class="ranking-item"
              >
                <div class="ranking-number" :class="`rank-${index + 1}`">
                  {{ index + 1 }}
                </div>
                <div class="ranking-info">
                  <div class="equipment-name">{{ item.name }}</div>
                  <div class="equipment-stats">
                    <span>租赁次数: {{ item.rentCount }}</span>
                    <span>收入: ¥{{ formatNumber(item.revenue) }}</span>
                  </div>
                </div>
                <div class="ranking-progress">
                  <el-progress
                    :percentage="item.percentage"
                    :stroke-width="6"
                    :show-text="false"
                    :color="getProgressColor(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 快速操作区域 -->
    <div class="quick-actions-section">
      <div class="section-header">
        <h3 class="section-title">快速操作</h3>
      </div>
      <div class="quick-actions-grid">
        <div 
          v-for="action in quickActions" 
          :key="action.key"
          class="quick-action-item"
          @click="handleQuickAction(action)"
        >
          <div class="action-icon">
            <el-icon :size="24">
              <component :is="action.icon" />
            </el-icon>
          </div>
          <div class="action-content">
            <div class="action-title">{{ action.title }}</div>
            <div class="action-desc">{{ action.description }}</div>
          </div>
          <el-icon class="action-arrow">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 最近活动区域 -->
    <div class="recent-activities-section">
      <div class="section-header">
        <h3 class="section-title">最近活动</h3>
        <el-button type="text" @click="viewAllActivities">查看全部</el-button>
      </div>
      <div class="activities-list">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-avatar">
            <el-avatar :size="40" :src="activity.avatar">
              {{ activity.user?.charAt(0) }}
            </el-avatar>
          </div>
          <div class="activity-content">
            <div class="activity-text">
              <span class="user-name">{{ activity.user }}</span>
              <span class="activity-action">{{ activity.action }}</span>
              <span class="activity-target">{{ activity.target }}</span>
            </div>
            <div class="activity-time">{{ formatTime(activity.time) }}</div>
          </div>
          <div class="activity-status">
            <el-tag :type="getActivityTagType(activity.status)" size="small">
              {{ activity.status }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册ECharts组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const router = useRouter()

// 响应式数据
const dateRange = ref([])
const chartLoading = ref(false)
const revenueChartPeriod = ref('30days')

// 核心指标数据
const coreMetrics = reactive([
  {
    key: 'totalRevenue',
    title: '总收入',
    value: 1234567,
    change: '+12.5%',
    trend: 'up',
    icon: 'Money',
    color: '#67C23A'
  },
  {
    key: 'activeOrders',
    title: '活跃订单',
    value: 856,
    change: '+8.2%',
    trend: 'up',
    icon: 'Document',
    color: '#409EFF'
  },
  {
    key: 'totalEquipment',
    title: '设备总数',
    value: 2341,
    change: '+2.1%',
    trend: 'up',
    icon: 'Monitor',
    color: '#E6A23C'
  },
  {
    key: 'customerSatisfaction',
    title: '客户满意度',
    value: 98.5,
    change: '-0.3%',
    trend: 'down',
    icon: 'Star',
    color: '#F56C6C'
  }
])

// 热门设备数据
const popularEquipment = reactive([
  {
    id: 1,
    name: '挖掘机CAT320D',
    rentCount: 156,
    revenue: 234567,
    percentage: 100
  },
  {
    id: 2,
    name: '装载机LG956L',
    rentCount: 142,
    revenue: 198432,
    percentage: 85
  },
  {
    id: 3,
    name: '推土机SD16',
    rentCount: 128,
    revenue: 167890,
    percentage: 72
  },
  {
    id: 4,
    name: '压路机XS203J',
    rentCount: 98,
    revenue: 123456,
    percentage: 58
  },
  {
    id: 5,
    name: '起重机QY25K5',
    rentCount: 76,
    revenue: 98765,
    percentage: 42
  }
])

// 快速操作数据
const quickActions = reactive([
  {
    key: 'newOrder',
    title: '新建订单',
    description: '创建新的设备租赁订单',
    icon: 'Plus',
    route: '/order/create'
  },
  {
    key: 'equipmentCheck',
    title: '设备检查',
    description: '进行设备状态检查',
    icon: 'Monitor',
    route: '/equipment/maintenance'
  },
  {
    key: 'inventoryManage',
    title: '库存管理',
    description: '管理设备库存信息',
    icon: 'Box',
    route: '/warehouse/inventory'
  },
  {
    key: 'financeReport',
    title: '财务报表',
    description: '查看财务统计报表',
    icon: 'DataAnalysis',
    route: '/finance/reports'
  }
])

// 最近活动数据
const recentActivities = reactive([
  {
    id: 1,
    user: '张三',
    action: '创建了订单',
    target: '#ORD-2024-001',
    time: new Date(Date.now() - 5 * 60 * 1000),
    status: '进行中',
    avatar: ''
  },
  {
    id: 2,
    user: '李四',
    action: '完成了设备维护',
    target: '挖掘机CAT320D',
    time: new Date(Date.now() - 30 * 60 * 1000),
    status: '已完成',
    avatar: ''
  },
  {
    id: 3,
    user: '王五',
    action: '处理了客服工单',
    target: '#CS-2024-045',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: '已解决',
    avatar: ''
  },
  {
    id: 4,
    user: '赵六',
    action: '更新了库存信息',
    target: '装载机LG956L',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: '已完成',
    avatar: ''
  }
])

// 收入趋势图表配置
const revenueChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}万'
    }
  },
  series: [
    {
      name: '收入',
      type: 'line',
      smooth: true,
      data: [85, 92, 78, 96, 108, 125, 142, 158, 136, 147, 162, 178],
      itemStyle: {
        color: '#5470c6'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(84, 112, 198, 0.3)'
          }, {
            offset: 1, color: 'rgba(84, 112, 198, 0.1)'
          }]
        }
      }
    }
  ]
}))

// 设备状态分布图表配置
const equipmentStatusChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '设备状态',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: '租赁中' },
        { value: 735, name: '空闲' },
        { value: 580, name: '维护中' },
        { value: 234, name: '故障' },
        { value: 135, name: '报废' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}))

// 订单统计图表配置
const orderChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['新增订单', '完成订单', '取消订单']
  },
  xAxis: {
    type: 'category',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新增订单',
      type: 'bar',
      data: [23, 34, 28, 45, 38, 52, 41]
    },
    {
      name: '完成订单',
      type: 'bar',
      data: [18, 28, 25, 38, 32, 46, 35]
    },
    {
      name: '取消订单',
      type: 'bar',
      data: [2, 3, 1, 4, 2, 3, 2]
    }
  ]
}))

/**
 * 格式化数字显示
 */
const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

/**
 * 获取进度条颜色
 */
const getProgressColor = (index) => {
  const colors = ['#f56c6c', '#e6a23c', '#5cb87a', '#409eff', '#909399']
  return colors[index] || '#909399'
}

/**
 * 获取活动状态标签类型
 */
const getActivityTagType = (status) => {
  const statusMap = {
    '进行中': 'warning',
    '已完成': 'success',
    '已解决': 'success',
    '待处理': 'info',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

/**
 * 格式化时间显示
 */
const formatTime = (time) => {
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return time.toLocaleDateString()
  }
}

/**
 * 处理日期范围变化
 */
const handleDateChange = (dates) => {
  console.log('日期范围变化:', dates)
  // 这里可以根据日期范围重新加载数据
  loadDashboardData()
}

/**
 * 刷新数据
 */
const refreshData = async () => {
  chartLoading.value = true
  try {
    await loadDashboardData()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    chartLoading.value = false
  }
}

/**
 * 处理快速操作点击
 */
const handleQuickAction = (action) => {
  if (action.route) {
    router.push(action.route)
  } else {
    ElMessage.info(`${action.title}功能开发中...`)
  }
}

/**
 * 查看所有活动
 */
const viewAllActivities = () => {
  ElMessage.info('查看全部活动功能开发中...')
}

/**
 * 加载看板数据
 */
const loadDashboardData = async () => {
  try {
    // 这里应该调用API获取看板数据
    // 暂时使用模拟数据
    console.log('加载看板数据...')
  } catch (error) {
    console.error('加载看板数据失败:', error)
    throw error
  }
}

// 监听收入图表周期变化
watch(revenueChartPeriod, (newPeriod) => {
  console.log('收入图表周期变化:', newPeriod)
  // 这里可以根据周期重新加载图表数据
})

// 组件挂载时加载数据
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
/* 数据看板容器样式 */
.dashboard-container {
  padding: 20px;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-picker {
  width: 300px;
}

/* 核心指标网格样式 */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-content {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.metric-change.up {
  color: var(--success-color);
}

.metric-change.down {
  color: var(--danger-color);
}

.change-text {
  color: var(--text-placeholder);
}

/* 图表区域样式 */
.charts-section {
  margin-bottom: 24px;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.chart-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.chart-content {
  flex: 1;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

/* 排行榜样式 */
.ranking-list {
  padding: 16px 0;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-number {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-right: 12px;
}

.ranking-number.rank-1 {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #8b6914;
}

.ranking-number.rank-2 {
  background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
  color: #666;
}

.ranking-number.rank-3 {
  background: linear-gradient(135deg, #cd7f32, #daa520);
  color: white;
}

.ranking-number:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: var(--text-placeholder);
}

.ranking-info {
  flex: 1;
  margin-right: 12px;
}

.equipment-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.equipment-stats {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  gap: 12px;
}

.ranking-progress {
  width: 80px;
}

/* 快速操作区域样式 */
.quick-actions-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.quick-action-item {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
}

.quick-action-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.15);
}

.action-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.action-desc {
  font-size: 12px;
  color: var(--text-secondary);
}

.action-arrow {
  color: var(--text-placeholder);
  transition: transform 0.3s;
}

.quick-action-item:hover .action-arrow {
  transform: translateX(4px);
}

/* 最近活动区域样式 */
.recent-activities-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.activities-list {
  margin-top: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  margin-right: 16px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.user-name {
  font-weight: 500;
  color: var(--primary-color);
}

.activity-action {
  margin: 0 4px;
}

.activity-target {
  font-weight: 500;
  color: var(--text-primary);
}

.activity-time {
  font-size: 12px;
  color: var(--text-placeholder);
}

.activity-status {
  margin-left: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .date-picker {
    width: 200px;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>