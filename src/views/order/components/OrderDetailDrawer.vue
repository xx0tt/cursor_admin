<template>
  <!-- 订单详情抽屉 -->
  <el-drawer
    v-model="drawerVisible"
    title="订单详情"
    :size="800"
    :before-close="handleClose"
  >
    <!-- 抽屉内容 -->
    <div v-loading="orderLoading" class="drawer-content">
      <!-- 订单基本信息 -->
      <div class="info-section" v-if="orderDetail">
        <div class="section-header">
          <h4 class="section-title">基本信息</h4>
          <el-tag
            :type="ORDER_STATUS_TYPES[orderDetail.status]"
            size="default"
          >
            {{ ORDER_STATUS_LABELS[orderDetail.status] }}
          </el-tag>
        </div>
        
        <div class="info-list">
          <div class="info-row">
            <span class="info-label">订单号：</span>
            <span class="info-value">{{ orderDetail.orderNo }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">客户名称：</span>
            <span class="info-value">{{ orderDetail.customerName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系电话：</span>
            <span class="info-value">{{ orderDetail.customerPhone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">联系人：</span>
            <span class="info-value">{{ orderDetail.contact }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">项目地址：</span>
            <span class="info-value">{{ orderDetail.address }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">创建时间：</span>
            <span class="info-value">{{ formatDateTime(orderDetail.createTime) }}</span>
          </div>
        </div>
      </div>

      <!-- 设备信息 -->
      <div class="equipment-section" v-if="orderDetail">
        <div class="section-header">
          <h4 class="section-title">设备信息</h4>
        </div>
        
        <div class="equipment-summary">
          <div class="summary-row">
            <span class="summary-label">设备类型：</span>
            <span class="summary-value">{{ orderDetail.equipmentType }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">设备型号：</span>
            <span class="summary-value">{{ orderDetail.equipmentModel }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">租赁数量：</span>
            <span class="summary-value">{{ orderDetail.quantity }} 台</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">单价：</span>
            <span class="summary-value">¥{{ formatAmount(orderDetail.unitPrice) }}/天</span>
          </div>
        </div>

        <!-- 设备详情表格 -->
        <div class="equipment-table" v-if="orderDetail.equipmentDetails">
          <h5 class="table-title">设备详情</h5>
          <el-table :data="orderDetail.equipmentDetails" size="small">
            <el-table-column prop="id" label="设备编号" width="100" />
            <el-table-column prop="name" label="设备名称" />
            <el-table-column prop="serialNumber" label="序列号" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === '租赁中' ? 'warning' : 'success'"
                  size="small"
                >
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 租赁信息 -->
      <div class="rental-section" v-if="orderDetail">
        <div class="section-header">
          <h4 class="section-title">租赁信息</h4>
        </div>
        
        <div class="rental-info">
          <div class="rental-dates">
            <div class="date-item">
              <div class="date-label">开始时间</div>
              <div class="date-value">{{ formatDateTime(orderDetail.rentStartDate) }}</div>
            </div>
            <div class="date-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
            <div class="date-item">
              <div class="date-label">结束时间</div>
              <div class="date-value">{{ formatDateTime(orderDetail.rentEndDate) }}</div>
            </div>
          </div>
          
          <div class="rental-summary-cards">
            <div class="summary-card">
              <div class="card-label">租赁天数</div>
              <div class="card-value">
                {{ calculateRentDays(orderDetail.rentStartDate, orderDetail.rentEndDate) }} 天
              </div>
            </div>
            <div class="summary-card highlight">
              <div class="card-label">总金额</div>
              <div class="card-value">¥{{ formatAmount(orderDetail.totalAmount) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单进度 -->
      <div class="timeline-section" v-if="orderDetail && orderDetail.timeline">
        <div class="section-header">
          <h4 class="section-title">订单进度</h4>
        </div>
        
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in orderDetail.timeline"
            :key="index"
            :timestamp="formatDateTime(item.time)"
            :type="getTimelineType(item.status)"
            size="small"
          >
            <div class="timeline-content">
              <div class="timeline-title">{{ item.status }}</div>
              <div class="timeline-operator">操作人：{{ item.operator }}</div>
              <div class="timeline-remark" v-if="item.remark">
                {{ item.remark }}
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 备注信息 -->
      <div class="remarks-section" v-if="orderDetail && orderDetail.remark">
        <div class="section-header">
          <h4 class="section-title">备注信息</h4>
        </div>
        <div class="remarks-content">
          {{ orderDetail.remark }}
        </div>
      </div>
    </div>

    <!-- 抽屉底部操作按钮 -->
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleViewFull">
          查看完整详情
        </el-button>
        <el-button
          type="primary"
          @click="handleEdit"
          v-if="canEdit"
        >
          编辑订单
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores'

// Props定义
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  orderId: {
    type: [String, Number],
    required: true
  }
})

// Emits定义
const emit = defineEmits(['update:visible', 'refresh', 'edit'])

const router = useRouter()
const orderStore = useOrderStore()

// 解构store中的数据
const { 
  currentOrder: orderDetail, 
  orderLoading, 
  ORDER_STATUS, 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_TYPES 
} = orderStore

// 响应式数据
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 计算属性
const canEdit = computed(() => {
  if (!orderDetail.value) return false
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(orderDetail.value.status)
})

/**
 * 处理关闭抽屉
 */
const handleClose = () => {
  drawerVisible.value = false
}

/**
 * 处理查看完整详情
 */
const handleViewFull = () => {
  router.push(`/order/detail/${props.orderId}`)
  handleClose()
}

/**
 * 处理编辑
 */
const handleEdit = () => {
  emit('edit', orderDetail.value)
  handleClose()
}

/**
 * 格式化日期时间
 */
const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

/**
 * 格式化金额
 */
const formatAmount = (amount) => {
  if (!amount) return '0.00'
  return parseFloat(amount).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 计算租赁天数
 */
const calculateRentDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
}

/**
 * 获取时间轴类型
 */
const getTimelineType = (status) => {
  const typeMap = {
    '订单创建': 'primary',
    '订单确认': 'success',
    '开始执行': 'warning',
    '订单完成': 'success',
    '订单取消': 'danger'
  }
  return typeMap[status] || 'info'
}

/**
 * 加载订单详情
 */
const loadOrderDetail = async () => {
  if (!props.orderId) return
  
  try {
    await orderStore.fetchOrderDetail(props.orderId)
  } catch (error) {
    console.error('加载订单详情失败:', error)
  }
}

// 监听orderId变化
watch(
  () => props.orderId,
  (newId) => {
    if (newId && props.visible) {
      loadOrderDetail()
    }
  }
)

// 监听抽屉显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible && props.orderId) {
      loadOrderDetail()
    }
  }
)
</script>

<style scoped>
/* 抽屉内容样式 */
.drawer-content {
  padding: 0 20px 20px;
  height: 100%;
  overflow-y: auto;
}

/* 区域样式 */
.info-section,
.equipment-section,
.rental-section,
.timeline-section,
.remarks-section {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.info-section:last-child,
.equipment-section:last-child,
.rental-section:last-child,
.timeline-section:last-child,
.remarks-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 基本信息样式 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-label {
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.info-value {
  color: var(--text-primary);
  flex: 1;
}

/* 设备信息样式 */
.equipment-summary {
  background: var(--bg-color);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-label {
  font-weight: 500;
  color: var(--text-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.summary-value {
  color: var(--text-primary);
  font-weight: 500;
}

.equipment-table {
  margin-top: 20px;
}

.table-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 12px 0;
}

/* 租赁信息样式 */
.rental-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rental-dates {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
}

.date-item {
  text-align: center;
}

.date-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.date-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.date-arrow {
  color: var(--text-placeholder);
}

.rental-summary-cards {
  display: flex;
  gap: 16px;
}

.summary-card {
  flex: 1;
  text-align: center;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
}

.summary-card.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.summary-card.highlight .card-label {
  color: rgba(255, 255, 255, 0.8);
}

.card-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.summary-card.highlight .card-value {
  color: white;
}

/* 时间轴样式 */
.timeline-content {
  padding: 4px 0;
}

.timeline-title {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.timeline-operator {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.timeline-remark {
  font-size: 12px;
  color: var(--text-placeholder);
  font-style: italic;
}

/* 备注信息样式 */
.remarks-content {
  padding: 16px;
  background: var(--bg-color);
  border-radius: 8px;
  color: var(--text-primary);
  line-height: 1.6;
}

/* 抽屉底部样式 */
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .drawer-content {
    padding: 0 12px 12px;
  }
  
  .rental-dates {
    flex-direction: column;
    gap: 12px;
  }
  
  .date-arrow {
    transform: rotate(90deg);
  }
  
  .rental-summary-cards {
    flex-direction: column;
  }
  
  .drawer-footer {
    flex-direction: column;
    padding: 12px 16px;
  }
}
</style>